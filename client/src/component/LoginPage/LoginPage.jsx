import { Navigate, NavLink, useNavigate } from "react-router-dom";
import classes from "../RegisterPage/RegisterPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { userSlice } from "../Layout/Layout";
import { useState } from "react";

function LoginPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [error, setError] = useState();
  if (user) {
    return <Navigate to="/" />;
  }

  async function onSubmit(e) {
    e.preventDefault();

    const user = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const req = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }
    );
    const data = await req.json();
    if (data.errorMessage) {
      swal(`${data.errorMessage}`, "", "error");
      setError(data.errorMessage);
    } else {
      await swal(`${data.message}`, "", "success");

      dispatch(userSlice.actions.onLogin(data));
      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem("expiryDate", expiryDate);
      setTimeout(() => {
        dispatch(userSlice.actions.autoLogout());
      }, remainingMilliseconds);
      navigate("/");
    }
  }

  return (
    <div className={classes.registerPage}>
      <img src="banner.jpg" alt="" />
      <form onSubmit={onSubmit} noValidate>
        <h1>Sign In</h1>
        {error && <label>{error}</label>}
        <input
          type="email"
          placeholder="Email"
          name="email"
          className={error && "error"}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className={error && "error"}
        />
        <button>SIGN IN</button>
        <span>
          Create an account? <NavLink to="/register">Sign Up</NavLink>
        </span>
      </form>
    </div>
  );
}

export default LoginPage;
