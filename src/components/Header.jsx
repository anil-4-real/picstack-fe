import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.setItem("isAuthenticated", false);
    localStorage.removeItem("userName");
    window.location.reload();
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-bottom">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand text">
            <u className="text-info">Pic Stack</u>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <span>Home</span>
                </Link>
              </li>
              {localStorage.getItem("isAuthenticated") === "true" ? (
                <li className="nav-item">
                  <Link to="/your-profile" className="nav-link">
                    <span>Profile</span>
                  </Link>
                </li>
              ) : null}
              <li className="nav-item">
                <Link to="/new" className="nav-link">
                  <span>New Post</span>
                </Link>
              </li>
              <li className="nav-item">
                {localStorage.isAuthenticated == "true" ? (
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="mx-2 btn btn-secondary"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                    }}
                    type="button"
                    className="btn btn-light mx-2"
                  >
                    Login
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
