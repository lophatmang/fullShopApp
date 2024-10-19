import { Navigate, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import classes from "./Layout.module.css";
import { useDispatch, useSelector } from "react-redux";
import { userSlice } from "../redux/Redux";
import { useEffect } from "react";
import Header from "../home/header/Header";
import Navbar from "../home/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Layout() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const messageChat = useLoaderData();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  useEffect(() => {
    dispatch(
      userSlice.actions.onLogin({
        userId: currentUser.userId,
        fullName: currentUser.fullName,
        role: currentUser.role,
        token: token,
      })
    );
  }, []);

  return (
    <div className={classes.layout}>
      <Header />
      <div
        style={{
          borderBottom: "2px solid #00000031",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {messageChat && messageChat.length > 0 && (
          <div
            onClick={() => navigate("/support")}
            style={{
              position: "relative",
              marginRight: "40px",
              cursor: "pointer",
            }}
          >
            <img style={{ width: "40px" }} src="/message.webp" />
            <span
              style={{
                marginLeft: "10px",
                backgroundColor: "red",
                padding: "5px 12px",
                color: "white",
                borderRadius: "50%",
                position: "absolute",
                right: "-10px",
                fontSize: "10px",
              }}
            >
              {messageChat.length}
            </span>
          </div>
        )}
      </div>
      <div className={classes.outlet}>
        <Navbar />
      </div>
      <Outlet />
    </div>
  );
}

export default Layout;
