import React, { useState } from "react";
import FileBase from "react-file-base64";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const errorToast = (message) => {
    toast(message, { type: "error" });
  };

  const successToast = (message) => {
    toast(message, { type: "success" });
  };

  const handlePost = async () => {
    setDisabled((prev) => !prev);
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL + "post/new",
        { caption, image },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(res);
      if (res.data.status === 201) {
        successToast("Post Successful");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (res.status === 500) {
        errorToast("Internal Server Error");
        setDisabled((prev) => !prev);
      }
    } catch (e) {
      setDisabled((prev) => !prev);
      errorToast("oops, internal server error");
    }
  };
  return (
    <div className="container mt-5" style={{ minHeight: "100vh" }}>
      <div>
        <div className="mb-3">
          <div className="form-control">
            <FileBase
              type="file"
              onDone={async ({ base64 }) => {
                let arr = await base64.split(";");
                if (
                  arr[0] === "data:image/jpeg" ||
                  arr[0] === "data:image/png"
                ) {
                  setDisabled(false);
                  setImage(base64);
                } else {
                  setDisabled((prev) => !prev);
                  errorToast("select image file only");
                }
              }}
              multiple={false}
              required
            />
          </div>
          <div className="form-text">select an image</div>
          {image && (
            <img
              className="img-fluid"
              style={{ maxHeight: "600px", width: "auto" }}
              src={image}
              alt="image"
            />
          )}
        </div>
        <div className="mb-3">
          <label for="caption" className="form-label">
            Caption
          </label>
          <textarea
            required
            onChange={(e) => {
              setCaption(e.target.value);
            }}
            className="form-control"
            id="caption"
          />
          <div className="form-text">max 200 characters</div>
        </div>
        <button
          onClick={() => {
            if (caption.trim().length === 0) {
              errorToast("please enter caption");
            } else {
              if (localStorage.getItem("isAuthenticated") === "true") {
                handlePost();
              } else {
                errorToast("login to post");
              }
            }
          }}
          disabled={disabled}
          type="button"
          className="btn btn-info"
        >
          Post
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
      </div>
    </div>
  );
};

export default Create;
