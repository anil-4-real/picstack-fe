import React from "react";
import { SpinnerCircular } from "spinners-react";

const Loader = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div>
        <SpinnerCircular
          size="50px"
          secondaryColor="white"
          color="steelblue"
          speed="150"
        ></SpinnerCircular>
        <p className="fs-6 mt-2 text-muted">loading</p>
      </div>
    </div>
  );
};

export default Loader;
