import { createComponent } from "../framework";
import { div, span, wrapper } from "../framework/element";
import { onClick } from "../framework/event";
import { customClasses, customStyles } from "../framework/styles";
import './user.css'

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
}

const template = 
  ({ firstName, lastName, methods }) =>
      wrapper`${onClick(() => methods.changeName("Ina"))}
          ${customStyles(styles)}
          ${customClasses(classes)}
          ${div`${customStyles({ color: "blue" })}${firstName}`}
          ${span`${customStyles({ backgroundColor: "yellow" })}${lastName}`}`;

export const User = createComponent({ template, methods, initialState });