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

  return {
    ...acc,
    template: acc.template + currentString + (args[index] || "")
  }
}

const createElement = tagName => (strings, ...args) => {

  const { template, on } = strings.reduce(createReducer(args), initialState)
  
  const style = {
    color: "red"
  }

  return {
    type: "element",
    template: h(tagName, { on, style }, template)
  }
}

export const div = createElement("div");
export const p = createElement("p");