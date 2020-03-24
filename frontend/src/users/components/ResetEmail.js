import React, { Fragment, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import Card from "../../shared/component/UIElements/Card";
import Input from "../../shared/component/formElements/Input";
import Button from "../../shared/component/formElements/Button";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import { useFrom } from "../../shared/hooks/form-hook";
import { VALIDATOR_MINLENGTH } from "../../shared/Util/validators";
import useHttpClient from "../../shared/hooks/http-hook";
import "./UserItem.css";
const ResetEmail = () => {
  const token = useParams().token;
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [sendPassword, setSendPassword] = useState();
  const [feedback, setFeedback] = useState(false);
  const [state, inputHandler] = useFrom(
    {
      password: {
        value: "",
        isValid: false
      },
      confirmpassword: {
        value: "",
        isValid: false
      }
    },
    false
  );
  const resetPasswordSubmitHandler = async event => {
    event.preventDefault();

    const newPassword = {
      password: state.inputs.password.value,
      confirmpassword: state.inputs.confirmpassword.value
    };
    try {
      event.preventDefault();

      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/reset/${token}`,
        "POST",
        JSON.stringify(newPassword),
        {
          "Content-Type": "application/json"
        }
      );

      setSendPassword(data);
      setFeedback(true);
    } catch (error) {}
  };
  console.log(sendPassword);
  if (!feedback)
    return (
      <Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <LoadingSpinner asOverlay />}

        <Card className="forget_password">
          <form className="place-form" onSubmit={resetPasswordSubmitHandler}>
            <Input
              id="password"
              element="input"
              type="password"
              label="New password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password, at least 6 characters."
              onInput={inputHandler}
            />
            <Input
              id="confirmpassword"
              element="input"
              type="password"
              label="confirm password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password, at least 6 characters."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!state.isValid}>
              Reset Password
            </Button>
          </form>
        </Card>
      </Fragment>
    );
  if (feedback)
    return (
      <div>
        <h2 className="center">{sendPassword.message}</h2>
        <p className="center">Login and explore YourPlaces App</p>
        <div className="center">
          <Link to="/login">Login</Link>
          </div>
        
      </div>
    );
};

export default ResetEmail;
