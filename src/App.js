import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Create from "./components/Create";
import FullPostCard from "./components/FullPostCard";
import Profile from "./components/Profile";
import UserProfile from "./components/UserProfile";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App container" style={{ minHeight: "100vh" }}>
      <Router>
        <Header />
        <Routes>
          <Route element={<Home />} default path="/"></Route>
          <Route element={<Signup />} path="/register"></Route>
          <Route element={<Login />} path="/login"></Route>
          <Route element={<Create />} path="/new"></Route>
          <Route element={<FullPostCard />} path="/post/:postId"></Route>
          <Route element={<Profile />} path="/profile/:user"></Route>
          <Route element={<UserProfile />} path="/your-profile"></Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
