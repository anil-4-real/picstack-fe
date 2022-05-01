import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const errorToast = (message) => {
    toast(message, { type: "error" });
  };

  const successToast = (message) => {
    toast(message, { type: "success" });
  };
  const handleSignup = async (values) => {
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL + "users/register",
        {
          username: values.username,
          password: values.password,
        }
      );
      console.log(res.data);
      if (res.data.status === 201) {
        successToast("Account Created Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (res.data.status === 400) {
        errorToast("username is already taken");
        setDisabled((prev) => !prev);
      } else if (res.data.status === 500) {
        errorToast("oops, internal server error");
        setDisabled((prev) => !prev);
      }
    } catch (e) {
      errorToast("oops, internal server error");
      console.log(e);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(/^\S+$/, "no space allowed")
        .max(15, "max 15 characters")
        .min(4, "min 4 characters")
        .required("username is required"),
      password: Yup.string()
        .min(4, "min 4 characters")
        .required("password is required"),
      confirmPassword: Yup.string()
        .min(4, "min 4 characters")
        .required("confirm password is required"),
    }),
    onSubmit: (values) => {
      setDisabled((prev) => !prev);
      if (values.password !== values.confirmPassword) {
        errorToast("passwords are not matching");
        setDisabled((prev) => !prev);
      } else {
        handleSignup(values);
      }
    },
  });

  return (
    <div className="container mt-5">
      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-center">Sign up</h2>
        <div className="mb-3">
          <label for="username" className="form-label">
            Username
          </label>
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            type="text"
            className="form-control"
            id="username"
            aria-describedby="username"
          />

          <div id="emailHelp" className="form-text">
            username has to be unique and spaces are not allowed
          </div>
          {formik.touched.username && formik.errors.username ? (
            <div className="text-danger">{formik.errors.username}</div>
          ) : null}
        </div>
        <div className="mb-3">
          <label for="password" className="form-label">
            Password
          </label>
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            type="password"
            className="form-control"
            id="password"
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-danger">{formik.errors.password}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label for="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            type="password"
            className="form-control"
            id="confirmPassword"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-danger">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        <button disabled={disabled} type="submit" className="btn btn-primary">
          Sign up
        </button>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <p className="text-muted mt-2 text-center">
          already have an account? click <Link to="/login">here</Link> to login
        </p>
      </form>
    </div>
  );
};

export default Signup;
