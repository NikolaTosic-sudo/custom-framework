import { h } from "snabbdom";

const initialState = {
  template: "",
  on: {},
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

  return {
    ...acc,
    template: acc.template + currentString + (args[index] || "")
  }
}

const createElement = tagName => (strings, ...args) => {

  const { template, on, style, classes } = strings.reduce(createReducer(args), initialState)
  
  return {
    type: "element",
    template: h(tagName, { on, style, class: classes }, template)
  }
}

export const div = createElement("div");
export const p = createElement("p");