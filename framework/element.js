import { h } from "snabbdom";

const initialState = {
  template: "",
  on: {},
  children: [],
}

const createReducer = args => (acc, currentString, index) => {

  const currentArg = args[index]

  if(currentArg && currentArg.type === "event") {
    return { ...acc, on: { click: currentArg.click }}
  }

  if(currentArg && currentArg.type === "styles") {
    return { ...acc, style: currentArg.styles }
  }

  if(currentArg && currentArg.type === "classes") {
    return { ...acc, classes: currentArg.classes }
  }

  if(currentArg && currentArg.type === "element") {
    if(acc.children && acc.children.length) {
      return { ...acc, children: [ ...acc.children, currentArg ]}
    }
    return { ...acc, children: [ currentArg ] }
  }

  return {
    ...acc,
    template: acc.template + currentString + (args[index] || "")
  }
}

const createElement = tagName => (strings, ...args) => {

  const { template, on, style, classes, children } = strings.reduce(createReducer(args), initialState)

  const renderChildren = children ? children.map((child) => h(child.template.sel, child.template.data, child.template.text)) : [];

  if(tagName === "wrapper") {
    return {
      type: "element",
      template: h("div", { on, style, class: classes }, renderChildren)
    }
  }

  return {
    type: "element",
    template: h(tagName, { on, style, class: classes }, template)
  }
}

export const div = createElement("div");
export const p = createElement("p");
export const span = createElement("span");
export const wrapper = createElement("wrapper");