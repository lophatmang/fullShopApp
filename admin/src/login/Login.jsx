import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import swal from "sweetalert";
import "./Login.css";
import { useDispatch } from "react-redux";
import { userSlice } from "../redux/Redux";
import { Navigate, redirect, useNavigate } from "react-router-dom";

export default function Login() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [showPassword, setShowPassword] = useState(false);
  const [checkLock, setCheckLock] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (currentUser) {
    return <Navigate to="/" />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const user = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const req = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/admin/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }
    );
    const message = await req.json();

    //đăng nhập thất bại
    if (message.errorMessage && message.errorMessage !== "jwt expired") {
      await swal(`${message.errorMessage}`, "", "error");
      return redirect("/shop");
    } else if (message.errorMessage === "jwt expired") {
      await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("currentUser");
      return location.replace("/");
    } else {
      swal(
        `${message.message}`,
        `Chào mừng ${message.fullName}`,
        "success"
      ).then(() => {
        setCheckLock(false);

        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate);
        setTimeout(() => {
          dispatch(userSlice.actions.onLogin(message));
          if (message.role == "admin") {
            navigate("/");
          } else {
            navigate("/support");
          }
        }, 1500);

        setTimeout(() => {
          dispatch(userSlice.actions.autoLogout());
          navigate("/login");
        }, remainingMilliseconds);
      });
    }
  }

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form
            onSubmit={onSubmit}
            className="login100-form validate-form"
            noValidate
          >
            <span className="login100-form-title p-b-26"> Welcome </span>
            <span className="login100-form-title p-b-120">
              {/* <FontAwesomeIcon icon="fa-solid fa-lock" /> */}
              <input
                id="inpLock"
                onChange={(e) => setCheckLock(e.target.checked)}
                checked={checkLock}
                name="unlock"
                type="checkbox"
              />
              <label className="btn-lock" htmlFor="inpLock">
                <svg width="36" height="40" viewBox="0 0 36 40">
                  <path
                    className="lockb"
                    d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z"
                  ></path>
                  <path
                    className="lock"
                    d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"
                  ></path>
                  {/* <path className="bling" d="M29 20L31 22"></path>
                  <path className="bling" d="M31.5 15H34.5"></path>
                  <path className="bling" d="M29 10L31 8"></path> */}
                </svg>
              </label>
            </span>

            <div className="wrap-input100 validate-input">
              <input className="input100" type="email" name="email" />
              <span className="focus-input18"></span>
              <span className="focus-input100" data-placeholder="Email"></span>
            </div>

            <div className="wrap-input100 validate-input">
              <span className="btn-show-pass">
                {showPassword ? (
                  <FontAwesomeIcon
                    onClick={() => setShowPassword(!showPassword)}
                    icon="fa-solid fa-eye-slash"
                  />
                ) : (
                  <FontAwesomeIcon
                    onClick={() => setShowPassword(!showPassword)}
                    icon="fa-solid fa-eye"
                  />
                )}
              </span>
              <input
                className="input100"
                type={showPassword ? "text" : "password"}
                name="password"
              />
              <span className="focus-input18"></span>
              <span
                className="focus-input100"
                data-placeholder="Password"
              ></span>
            </div>

            <div className="container-login100-form-btn">
              <div className="wrap-login100-form-btn">
                <div className="login100-form-bgbtn"></div>
                <button className="login100-form-btn">Login</button>
              </div>
            </div>

            <div className="text-center p-t-115"></div>
          </form>
        </div>
      </div>
    </div>
  );
}
