import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") == "true") {
      setDisabled(true);
      navigate("/");
    }
  }, []);

  const errorToast = (message) => {
    toast(message, { type: "error" });
  };

  const successToast = (message) => {
    toast(message, { type: "success" });
  };

  const handleLoginResponse = (data) => {
    localStorage.setItem("userId", data.user.userId);
    localStorage.setItem("token", "Bearer " + data.token);
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("userName", data.user.username);
    successToast("Login Successful");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleLogin = async (values) => {
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL + "users/login",
        {
          username: values.username,
          password: values.password,
        }
      );
      if (res.data.status === 200) {
        handleLoginResponse(res.data);
      } else if (res.data.status === 400) {
        errorToast("invalid credentials");
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
    }),
    onSubmit: (values) => {
      setDisabled((prev) => !prev);
      handleLogin(values);
    },
  });

  return (
    <div className="container mt-5">
      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-center">Login</h2>
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
        <button disabled={disabled} type="submit" className="btn btn-primary">
          Login
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
          new user? click <Link to="/register">here</Link> to register
        </p>
      </form>
    </div>
  );
};

export default Login;
