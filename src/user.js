import { createComponent } from "../framework";
import { div } from "../framework/element";
import { onClick } from "../framework/event";

const initialState = {
  firstName: "Nikola",
  lastName: "Tosic",
};

const methods = {
  changeName: (state, firstName) => ({ ...state, firstName })
}

const template = 
  ({ firstName, lastName, methods }) =>
      div`${onClick(() => methods.changeName("Ina"))} Hello ${firstName} ${lastName}`;

export const User = createComponent({ template, methods, initialState });