import React, { useContext } from "react";
import userIcon from "../assets/userIcon.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";

const UserProfile = () => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  const getUserData = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_URL + "post/current/user",
        { headers: { authorization: localStorage.getItem("token") } }
      );
      if (res.data.status === 200) {
        setUserData(res.data.data);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container mt-5" style={{ minHeight: "100vh" }}>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div>
            <div className="card d-flex justify-content-between align-items-center p-3">
              <img
                src={userIcon}
                style={{ height: "100px", width: "100px" }}
                alt="user icon"
              ></img>
              <p className="text m-2 p-2 fs-4">
                {localStorage.getItem("userName")}
              </p>
            </div>
          </div>
          <div className="accordion mt-5" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  your bookmarks
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="d-flex justify-content-evenly flex-wrap">
                    {userData.bookmarks && userData.bookmarks.length === 0 ? (
                      <p className="text">no post found</p>
                    ) : (
                      <></>
                    )}
                    {userData.bookmarks &&
                      userData.bookmarks.map((bookmark, i) => {
                        return (
                          <img
                            key={i}
                            onClick={() => {
                              navigate(`/post/${bookmark.postId}`);
                            }}
                            style={{ height: "250px", width: "290px" }}
                            src={bookmark.image}
                            className="img-thumbnail m-2"
                            alt="..."
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  your posts
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="d-flex justify-content-evenly flex-wrap">
                    {userData.posts && userData.posts.length === 0 ? (
                      <p className="text">no post found</p>
                    ) : (
                      <></>
                    )}
                    {userData.posts &&
                      userData.posts.map((post, i) => {
                        return (
                          <img
                            key={i}
                            onClick={() => {
                              navigate(`/post/${post.postId}`);
                            }}
                            style={{ height: "250px", width: "290px" }}
                            src={post.image}
                            className="img-thumbnail m-2"
                            alt="..."
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  your followers
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">username</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.followers &&
                        userData.followers.map((follower, i) => {
                          return (
                            <tr key={i}>
                              <th scope="row">{i + 1}</th>
                              <td>
                                <Link to={`/profile/${follower}`}>
                                  {follower}
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  your following
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">username</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.following &&
                        userData.following.map((following, i) => {
                          return (
                            <tr key={i}>
                              <th scope="row">{i + 1}</th>
                              <td>
                                <Link to={`/profile/${following}`}>
                                  {following}
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
