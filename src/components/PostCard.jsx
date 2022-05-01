import React, { useEffect, useState } from "react";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heartFilled.png";
import chat from "../assets/chat.png";
import bookmarkBorder from "../assets/bookmarkBorder.png";
import bookmarkFilled from "../assets/bookmarkFilled.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post, bookmark, func2 }) => {
  const [like, setLike] = useState(false);
  const navigate = useNavigate();

  let [likeCount, setLikeCount] = useState(post.likes.length);

  const handleBookmarkClick = async (value, postId) => {
    try {
      const res = await axios.put(
        process.env.REACT_APP_API_URL + `post/bookmark`,
        { value, postId },
        { headers: { authorization: localStorage.getItem("token") } }
      );
      if (res.data.status === 201) {
        //call getUserBookmarks when clicked on bookmark btn
        func2();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const errorToast = (message) => {
    toast(message, { type: "error" });
  };

  const handleLike = async (postId, value) => {
    try {
      const res = await axios.put(
        process.env.REACT_APP_API_URL + `post/${postId}/like`,
        { value },
        { headers: { authorization: localStorage.getItem("token") } }
      );
      if (res.data.status === 201) {
        setLike((prev) => !prev);
      } else {
        errorToast(res.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="col mb-5">
      <div className="card" style={{ maxWidth: "650px" }}>
        <img
          src={post.image}
          className="card-img-top"
          style={{ maxHeight: "auto", maxWidth: "650px" }}
          alt="..."
        />
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <p
              className="text-muted link"
              onClick={() => {
                if (localStorage.getItem("userId") === post.postedByUserId) {
                  navigate("your-profile");
                } else {
                  navigate("/profile/" + post.postedBy);
                }
              }}
            >
              <i>
                posted by&nbsp;<b>{post.postedBy}</b>
              </i>
            </p>
            <small className="text-muted">
              on&nbsp;
              {post.createdAt
                .slice(0, 10)
                .split("-")
                .reverse()
                .join("-")} at{" "}
              {post.createdAt.slice(11, post.createdAt.length - 8)}
            </small>
          </div>
          <p className="card-text">{post.caption}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center card-footer">
          <div>
            <img
              src={
                post.likes.includes(localStorage.getItem("userId"))
                  ? heartFilled
                  : heart
              }
              onClick={() => {
                if (localStorage.getItem("isAuthenticated") === "true") {
                  if (post.likes.includes(localStorage.getItem("userId"))) {
                    setLikeCount(likeCount - 1);
                    post.likes.splice(
                      post.likes.indexOf(localStorage.getItem("userId")),
                      1
                    );
                    handleLike(post.postId, 0);
                  } else {
                    setLikeCount(likeCount + 1);
                    post.likes.push(localStorage.getItem("userId"));
                    handleLike(post.postId, 1);
                  }
                } else {
                  errorToast("Login to like");
                }
              }}
              className="card-img-top link"
              style={{
                height: "28px",
                width: "28px",
              }}
              alt="..."
            />
            <span> {likeCount} </span>
          </div>
          <div>
            <img
              src={chat}
              className="card-img-top link"
              style={{
                height: "30px",
                width: "30px",
              }}
              onClick={() => {
                navigate("/post/" + post.postId, {
                  state: { post },
                });
              }}
              alt="..."
            />
            <span> {post.comments.length} </span>
          </div>
          <div>
            <img
              src={bookmark ? bookmarkFilled : bookmarkBorder}
              className="card-img-top link"
              style={{
                height: "30px",
                width: "30px",
              }}
              onClick={() => {
                if (localStorage.getItem("isAuthenticated") === "true") {
                  if (bookmark) {
                    handleBookmarkClick(0, post.postId);
                  } else {
                    handleBookmarkClick(1, post.postId);
                  }
                } else {
                  errorToast("Login to bookmark");
                }
              }}
              alt="..."
            />
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
    </div>
  );
};

export default PostCard;
