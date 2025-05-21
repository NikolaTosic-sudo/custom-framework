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
          // time to build the dom from the ground

          // const domAst = buildDomAST(jsxElement.children);

          // renderMethod.body.body = [t.returnStatement(domAst)];
        }
      }
    }
  };
};