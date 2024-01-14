import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";

export default function Form(props) {
  const { addUsers } = props;

  const initialState = {
    name: "",
    email: "",
    password: "",
    tos: false,
  };

  const [formState, setFormState] = useState(initialState);

  const [errState, setErrState] = useState({
    name: "",
    email: "",
    password: "",
    tos: "",
  });

  const [isValid, setIsValid] = useState(false);

  const inputHandler = (event) => {
    Yup.reach(formSchema, event.target.name)
      .validate(
        event.target.name !== "tos" ? event.target.value : event.target.checked
      )
      .then((res) => {
        setErrState({ ...errState, [event.target.name]: "" });
      })
      .catch((err) => {
        setErrState({ ...errState, [event.target.name]: err.message });
      });
    setFormState({
      ...formState,
      [event.target.name]:
        event.target.name !== "tos" ? event.target.value : event.target.checked,
    });
  };

  const submitHandler = (submit) => {
    submit.preventDefault();
    if (isValid) {
      axios
        .post("https://reqres.in/api/users", formState)
        .then((res) => {
          console.log(res);
          addUsers(res.data);
          setFormState(initialState);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const formSchema = Yup.object().shape({
    name: Yup.string()
      .required("name is required")
      .min(3, "name must be longer than 3 characters"),
    email: Yup.string()
      .email("Must be a valid email adress")
      .required("Must include email adress"),
    password: Yup.string()
      .required("Password is Required")
      .matches(
        /*^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$"*/ "",
        "password doesnt meet requirements"
      )
      .min(6, "Password must be at least 6 characters long"),
    tos: Yup.boolean().oneOf([true], "You must accept Terms and Conditions"),
  });

  useEffect(() => {
    formSchema.isValid(formState).then((res) => {
      setIsValid(res);
    });
  }, [formState]);

  return (
    <form onSubmit={submitHandler}>
      <label>
        Name:
        <input
          type="text"
          value={formState.name}
          name="name"
          onChange={inputHandler}
        />
      </label>
      <p>{errState.name}</p>
      <label>
        Email:
        <input
          type="email"
          value={formState.email}
          name="email"
          onChange={inputHandler}
        />
      </label>
      <p>{errState.email}</p>
      <label>
        Password:
        <input
          type="password"
          value={formState.password}
          name="password"
          onChange={inputHandler}
        />
      </label>
      <p>{errState.password}</p>
      <label>
        Tos:
        <input
          type="checkbox"
          value={formState.tos}
          name="tos"
          onChange={inputHandler}
        />
      </label>
      {errState.tos}
      <button disabled={!isValid}>Submit</button>
    </form>
  );
}
