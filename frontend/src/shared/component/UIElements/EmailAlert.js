import React from "react";

import Modal from "./Modal";
import Button from "../formElements/Button";

const ErrorModal = ({ message, onClear }) => {
  return (
    <Modal
      onCancel={onClear}
      header='An Error Occurred!'
      show={!!message}
      footer={<Button onClick={onClear}>Okay</Button>}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ErrorModal;
