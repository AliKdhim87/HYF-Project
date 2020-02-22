import React, { useState, useContext } from "react";
import "./Auth.css";
import Input from "../../shared/component/formElements/Input";
import Button from "../../shared/component/formElements/Button";
import Card from "../../shared/component/UIElements/Card";
import { useFrom } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from "../../shared/Util/validators";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMod, setIsLoginMod] = useState(true);
  const [state, inputHandler, setFormData] = useFrom(
    {
      email: {
        value: "",
        isValid: false
      },
      password: {
        value: "",
        isValid: false
      }
    },
    false
  );
  const switchModelHandler = () => {
    if (!isLoginMod) {
      setFormData(
        {
          ...state.inputs,
          name: undefined
        },
        state.inputs.email.isValid && state.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...state.inputs,
          name: {
            value: "",
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMod(prevMode => !prevMode);
  };

  const authSubmitHandler = event => {
    event.preventDefault();
    console.log(state.inputs);
    auth.login();
  };
  return (
    <Card className='authentication'>
      <h2>Login Required</h2>
      <hr />
      <form className='place-form' onSubmit={authSubmitHandler}>
        {!isLoginMod && (
          <Input
            id='name'
            element='input'
            type='text'
            label='Your Name'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid name'
            onInput={inputHandler}
          />
        )}
        <Input
          id='email'
          element='input'
          type='email'
          label='Email'
          validators={[VALIDATOR_EMAIL()]}
          errorText='Please enter a valid email address'
          onInput={inputHandler}
        />
        <Input
          id='password'
          element='input'
          type='password'
          label='Password'
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText='Please enter a valid password, at least 5 characters.'
          onInput={inputHandler}
        />
        <Button type='submit' disabled={!state.isValid}>
          {isLoginMod ? "LOGIN" : "SIGNUP"}
        </Button>
      </form>
      <Button inverse onClick={switchModelHandler}>
        SWITHC TO {isLoginMod ? "SIGNUP" : "LOGIN"}
      </Button>
    </Card>
  );
};

export default Auth;
