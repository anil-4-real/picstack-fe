import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const FullPostCard = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const errorToast = (message) => {
    toast(message, { type: "error" });
  };

  const successToast = (message) => {
    toast(message, { type: "success" });
  };

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_URL + `post/${postId}`
      );
      if (res.data.status === 200) {
        setPost(res.data.data);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleComment = async () => {
    try {
      const res = await axios.put(
        process.env.REACT_APP_API_URL + `post/${postId}/comment`,
        { comment },
        { headers: { authorization: localStorage.getItem("token") } }
      );
      getPost();
      if (res.data.status === 201) {
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCommentDelete = async (postId, commentId) => {
    try {
      const res = await axios.delete(
        process.env.REACT_APP_API_URL + `post/comment/${postId}/${commentId}`,
        { headers: { authorization: localStorage.getItem("token") } }
      );
      if (res.data.status === 200) {
        successToast("Comment deleted successfully");
        getPost();
      } else {
        errorToast("Something went wrong");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(
        process.env.REACT_APP_API_URL + "post/delete/" + postId,
        { headers: { authorization: localStorage.getItem("token") } }
      );
      if (res.data.status === 200) {
        successToast("Post deleted successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container mt-5" style={{ minHeight: "100vh" }}>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      ) : (
        <div className="card mb-3">
          <img
            src={post.image}
            className="full-post-card border border-light"
            alt="..."
          />
          <div className="full-post-card card-body border border-dark rounded">
            <h5 className="card-text d-flex justify-content-between">
              <Link
                to={
                  localStorage.getItem("userId") === post.postedByUserId
                    ? `/your-profile`
                    : `/profile/${post.postedBy}`
                }
              >
                {post.postedBy}
              </Link>
              <span className="fs-6 text-muted">
                {post.likes && post.likes.length} likes and{" "}
                {post.comments && post.comments.length} comments
              </span>
            </h5>

            {post && post.postedByUserId === localStorage.getItem("userId") ? (
              <button
                onClick={() => {
                  if (localStorage.getItem("isAuthenticated") === "true") {
                    handleDeletePost();
                  } else {
                    errorToast("You need to login to delete post");
                  }
                }}
                className="btn btn-danger p-1 my-2"
              >
                delete post
              </button>
            ) : (
              <></>
            )}
            <p className="card-text">{post.caption}</p>
            <p className="card-text m-0">
              <small className="text-muted">posted by {post.postedBy}</small>
              &nbsp;
              <small className="text-muted">
                on&nbsp;
                {post.createdAt &&
                  post.createdAt.slice(0, 10).split("-").reverse().join("-") +
                    " at " +
                    post.createdAt.slice(11, post.createdAt.length - 8)}
              </small>
            </p>
            {post.comments && post.comments.length === 0 ? (
              <p className="text-muted">no comments yet</p>
            ) : (
              post.comments &&
              post.comments.map((comment, i) => {
                return (
                  <div key={i} className="card border-light bg-light mt-4 mb-4">
                    <ol className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{comment.postedBy}</div>
                          {comment.body}
                        </div>
                        {comment.commentUserId ===
                        localStorage.getItem("userId") ? (
                          <button
                            className="btn badge bg-danger rounded-pill"
                            onClick={() => {
                              handleCommentDelete(
                                post.postId,
                                comment.commentId
                              );
                            }}
                          >
                            delete
                          </button>
                        ) : (
                          <></>
                        )}
                      </li>
                    </ol>
                  </div>
                );
              })
            )}
            <div className="input-group">
              <textarea
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                className="form-control"
                onBlur={(e) => {
                  e.target.value = "";
                }}
                aria-label="With textarea"
                placeholder="your comment goes here"
              ></textarea>
              <button
                onClick={() => {
                  if (comment.length > 0) {
                    if (localStorage.getItem("isAuthenticated") === "true") {
                      handleComment();
                      setComment("");
                    } else {
                      errorToast("Login to comment");
                    }
                  } else {
                    errorToast("Enter a comment");
                  }
                }}
                className="btn btn-primary px-2 rounded-end"
              >
                Add comment
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
        </div>
      )}
    </div>
  );
};

export default FullPostCard;
