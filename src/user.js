import { createComponent } from "../framework";
import { div } from "../framework/element";
import { onClick } from "../framework/event";
import { customClasses, customStyles } from "../framework/styles";

const initialState = {
  firstName: "Nikola",
  lastName: "Tosic",
};

const methods = {
  changeName: (state, firstName) => ({ ...state, firstName })
}

const styles = {
  color: "red",
  fontWeight: "bold"
}

const classes = {
  testClass: true,
  anotherClass: true,
}

const template = 
  ({ firstName, lastName, methods }) =>
      div`${onClick(() => methods.changeName("Ina"))}${customStyles(styles)}${customClasses(classes)}Hello ${firstName} ${lastName}`;

export const User = createComponent({ template, methods, initialState });