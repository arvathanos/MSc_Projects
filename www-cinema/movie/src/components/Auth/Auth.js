import React from "react";
import Form from "./Form";
import { sendUserAuthRequest } from "../../api-helpers/api.helpers";
import { useDispatch } from "react-redux";
import { userActions } from "../../store";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onResReceived = (data) => {
    //για να παραμένει το login μετα την ανανέωση
    console.log(data);
    dispatch(userActions.login());
    localStorage.setItem("userId", data.id); //αποθυκευεται στο λοκαλ //storage το id
    navigate("/");
  };

  const getData = (data) => {
    console.log(data);
    sendUserAuthRequest(data.inputs, data.signup, data.isGoogleLogin)
      .then(onResReceived)
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Form onSubmit={getData} isAdmin={false} />
    </div>
  );
};

export default Auth;
