import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPosts("all");
    if (localStorage.getItem("isAuthenticated") === "true") {
      getUserBookmarks();
      getUserData();
    }
  }, []);

  const successToast = (message) => {
    toast(message, { type: "success" });
  };

  const getPosts = async (value) => {
    try {
      const res = await axios.get(process.env.REACT_APP_API_URL + "post");
      if (res.data.status === 200) {
        if (value == "all") {
          setPosts(res.data.data.reverse());
          setIsLoading(false);
        } else if (value === "bookmarks") {
          const bookmarkedPosts = [];
          res.data.data.forEach((post) => {
            if (bookmarks.includes(post.postId)) {
              bookmarkedPosts.push(post);
            }
          });
          setPosts(bookmarkedPosts);
          setIsLoading(false);
        } else if (value === "following") {
          const followingPosts = [];
          res.data.data.forEach((post) => {
            if (userData.following.includes(post.postedBy)) {
              followingPosts.push(post);
            }
          });
          setPosts(followingPosts);
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserBookmarks = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_URL + "post/get/user/bookmarks",
        { headers: { authorization: localStorage.getItem("token") } }
      );
      if (res.data.status === 200) {
        setBookmarks(res.data.bookmarks);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserData = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_URL + "post/current/user",
        { headers: { authorization: localStorage.getItem("token") } }
      );
      if (res.data.status === 200) {
        setUserData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5" style={{ minHeight: "100vh" }}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {localStorage.getItem("isAuthenticated") === "true" ? (
            <div
              className="btn-group mb-5"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="button"
                className="btn btn-info"
                onClick={() => {
                  setIsLoading(true);
                  getPosts("all");
                }}
              >
                all
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  getPosts("bookmarks");
                }}
                type="button"
                className="btn btn-info"
              >
                bookmarked
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  getPosts("following");
                }}
                type="button"
                className="btn btn-info"
              >
                following
              </button>
            </div>
          ) : (
            <></>
          )}
          <div className="row row-cols-1 d-flex flex-column justify-content-between align-items-start">
            {posts === undefined ? (
              <></>
            ) : (
              posts.map((post) => {
                return (
                  <PostCard
                    key={post.postId}
                    func={getPosts}
                    func2={getUserBookmarks}
                    post={post}
                    bookmark={bookmarks.includes(post.postId) ? true : false}
                  />
                );
              })
            )}
          </div>
        </>
      )}
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
  );
};

export default Home;
