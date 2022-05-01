import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userIcon from "../assets/userIcon.png";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useParams();
  useEffect(() => {
    getUserData();
  }, [user]);

  const errorToast = (message) => {
    toast(message, { type: "error" });
  };

  const successToast = (message) => {
    toast(message, { type: "success" });
  };

  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_URL + `post/posts/${user}`
      );
      if (res.data.status === 200) {
        setUserPosts(res.data.data.posts);
        setUserFollowers(res.data.data.followers);
        setUserFollowing(res.data.data.following);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleFollowButtonClick = async (value, userName) => {
    try {
      const res = await axios.put(
        process.env.REACT_APP_API_URL + "post/followers",
        { value, userName },
        { headers: { authorization: localStorage.getItem("token") } }
      );
      if (res.data.status === 201) {
        if (value == 1) {
          successToast("Followed successfully");
          setDisable(false);
        } else {
          successToast("Unfollowed successfully");
          setDisable(false);
        }
        getUserData();
      } else if (res.data.status === 400) {
        errorToast("You can't follow yourself");
        setDisable(false);
      } else {
        errorToast("something went wrong");
        setDisable(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container mt-5" style={{ minHeight: "100vh" }}>
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
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="">
            <div className="card d-flex justify-content-between align-items-center p-3">
              <img
                src={userIcon}
                style={{ height: "100px", width: "100px" }}
                alt="user icon"
              ></img>
              <p className="text m-2 p-2 fs-4">{user}</p>
              {userFollowers &&
              userFollowers.includes(localStorage.getItem("userName")) ? (
                <button
                  onClick={() => {
                    setDisable((prev) => !prev);
                    if (localStorage.getItem("isAuthenticated") === "true") {
                      handleFollowButtonClick(0, user);
                    } else {
                      setDisable(false);
                      errorToast("You need to login to follow");
                    }
                  }}
                  disabled={disable}
                  className="btn btn-primary p-1 m-1"
                >
                  unfollow -
                </button>
              ) : (
                <button
                  onClick={() => {
                    setDisable((prev) => !prev);
                    if (localStorage.getItem("isAuthenticated") === "true") {
                      handleFollowButtonClick(1, user);
                    } else {
                      setDisable(false);
                      errorToast("You need to login to follow");
                    }
                  }}
                  disabled={disable}
                  className="btn btn-primary p-1 m-1"
                >
                  follow +
                </button>
              )}
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
                  see&nbsp;<b>{user}</b>'s posts
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
                    {userPosts && userPosts.length === 0 ? (
                      <p className="text">no post found</p>
                    ) : (
                      <></>
                    )}
                    {userPosts &&
                      userPosts.map((post, i) => {
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
                  see&nbsp;<b>{user}</b>'s followers
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
                      {userFollowers && userFollowers.length === 0 ? (
                        <tr>
                          <td>
                            <p className="text-muted">
                              this user has no followers
                            </p>
                          </td>
                        </tr>
                      ) : (
                        userFollowers.map((follower, i) => {
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
                        })
                      )}
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
                  see&nbsp;<b>{user}</b>'s following
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
                      {userFollowing && userFollowing.length === 0 ? (
                        <tr>
                          <tr>
                            <p className="text-muted">
                              this user is not following any account
                            </p>
                          </tr>
                        </tr>
                      ) : (
                        userFollowing.map((following, i) => {
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
                        })
                      )}
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

export default Profile;
