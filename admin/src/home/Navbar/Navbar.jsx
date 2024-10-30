import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userSlice } from "../../redux/Redux";
import { useEffect, useState } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

function Navbar() {
  const dispatch = useDispatch();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [date, setDate] = useState();

  useEffect(() => {
    // clock time out
    const interVal = setInterval(() => {
      const expiryDate = localStorage.getItem("expiryDate");
      if (expiryDate) {
        const time = new Date(expiryDate).getTime() - new Date().getTime();
        setDate(time);
      } else {
        setDate();
      }
    }, 1000);

    return () => {
      clearInterval(interVal);
    };
  }, []);

  return (
    <div
      className={classes.navbar}
      style={
        date > 60000
          ? {
              "--fcc-background": "#000",
              "--fcc-label-color": "#000",
              "--fcc-separator-color": "#000",
            }
          : {
              "--fcc-background": "#ff0000",
              "--fcc-label-color": "#ff0000",
              "--fcc-separator-color": "#ff0000",
            }
      }
    >
      <h6>MAIN</h6>
      <NavLink to="/support" className={classes.icon}>
        <FontAwesomeIcon icon="fa-solid fa-headset" />
        <span>Support</span>
      </NavLink>
      {currentUser && currentUser.role == "admin" && (
        <>
          <NavLink to="/" className={classes.icon}>
            <FontAwesomeIcon icon="fa-solid fa-house" />
            <span>Dashboard</span>
          </NavLink>
          <h6>LISTS</h6>
          <NavLink to="/user" className={classes.icon}>
            <FontAwesomeIcon icon="fa-solid fa-user" />
            <span>User</span>
          </NavLink>
          <NavLink to="/product" className={classes.icon}>
            <FontAwesomeIcon icon="fa-solid fa-mobile-button" />
            <span>Product</span>
          </NavLink>
          <h6>NEW</h6>
          <NavLink to="/newProduct" className={classes.icon}>
            <FontAwesomeIcon icon="fa-solid fa-cart-plus" />
            <span>New Product</span>
          </NavLink>
        </>
      )}
      <h6>USER</h6>
      <NavLink
        onClick={() => dispatch(userSlice.actions.onLogout())}
        className={classes.icon}
      >
        <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
        <span>Logout</span>
      </NavLink>
      {date && (
        <div className={classes.clockOutTime}>
          <label
            style={date > 60000 ? { color: "#000" } : { color: "#ff0000" }}
          >
            Logout Later
          </label>
          <FlipClockCountdown
            renderMap={[false, false, true, true]}
            to={new Date().getTime() + date}
          />
        </div>
      )}
    </div>
  );
}

export default Navbar;
