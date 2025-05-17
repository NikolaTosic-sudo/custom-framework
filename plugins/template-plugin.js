const { parseDocument } = require('htmlparser2');
const t = require('@babel/types');

module.exports = function templatePlugin() {
  return {
    visitor: {
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee, { name: 'component' }) &&
          t.isObjectExpression(path.node.arguments[1])
        ) {
          const componentObj = path.node.arguments[1];
          const renderMethod = componentObj.properties.find(
            p => t.isObjectMethod(p) && p.key.name === 'render'
          );

          if (!renderMethod) return;

          const templateNodeIndex = renderMethod.body.body.findIndex(
            stmt => {
              return (t.isExpressionStatement(stmt) &&
              t.isJSXElement(stmt.expression) &&
              stmt.expression.openingElement.name.name === 'template'
          )});

          if (templateNodeIndex === -1) return;

          const templateNode = renderMethod.body.body[templateNodeIndex];
          const jsxElement = templateNode.expression;

          // recursive function
          // itterates over the nodes in the template
          // let's try first to make the text join together and parseDocument it
          // after that we can buildDom and send it
          // if that doesn't work as intended I probably need to parse every element individually
          // chain them together, buildDom and send it

          let htmlForParsing = '';

          function getParsedJsxElement(nodes) {
            nodes.map((node) => {
              if(t.isJSXText(node)) {
                htmlForParsing += node.value
              } else if(t.isJSXElement(node)) {
                getParsedJsxElement(node.children)
              }
            })
          };

          getParsedJsxElement(jsxElement.children);

          console.log(htmlForParsing, 'for parsing')

          const dom = parseDocument(htmlForParsing);

          const domAst = buildDomAST(dom.children);

          renderMethod.body.body = [t.returnStatement(domAst)];
        }
      }
    }
  };
};

function buildDomAST(nodes) {
  const t = require('@babel/types');

  function createNode(node) {
    if (node.type === 'text') {
      const interpolated = node.data.replace(/\{\{(.+?)\}\}/g, (_, expr) => `\${${expr.trim()}}`);
      return t.callExpression(
        t.memberExpression(t.identifier('document'), t.identifier('createTextNode')),
        [t.templateLiteral([t.templateElement({ raw: interpolated, cooked: interpolated }, true)], [])]
      );
    }

    if (node.type === 'tag') {
      const create = t.callExpression(
        t.memberExpression(t.identifier('document'), t.identifier('createElement')),
        [t.stringLiteral(node.name)]
      );

      const elVar = t.identifier('el');
      const elDecl = t.variableDeclaration('const', [
        t.variableDeclarator(elVar, create)
      ]);

      const children = (node.children || []).map(createNode);
      const appends = children.map(child =>
        t.expressionStatement(
          t.callExpression(
            t.memberExpression(elVar, t.identifier('appendChild')),
            [child]
          )
        )
      );

      return t.callExpression(
        t.arrowFunctionExpression([], t.blockStatement([
          elDecl,
          ...appends,
          t.returnStatement(elVar)
        ])),
        []
      );
    }

    return t.nullLiteral();
  }

  const roots = nodes.map(createNode);

  if (roots.length === 1) return roots[0];

  const frag = t.callExpression(
    t.memberExpression(t.identifier('document'), t.identifier('createDocumentFragment')),
    []
  );

  const fragVar = t.identifier('frag');
  const fragDecl = t.variableDeclaration('const', [
    t.variableDeclarator(fragVar, frag)
  ]);

  const appendAll = roots.map(child =>
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(fragVar, t.identifier('appendChild')),
        [child]
      )
    )
  );

  return t.callExpression(
    t.arrowFunctionExpression([], t.blockStatement([
      fragDecl,
      ...appendAll,
      t.returnStatement(fragVar)
    ])),
    []
  );
}
