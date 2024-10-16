import { Form, NavLink, useActionData } from "react-router-dom";
import classes from "./RegisterPage.module.css";

function RegisterPage() {
  const message = useActionData();
  // console.log(message.find((e) => e.path == "email"));

  return (
    <div className={classes.registerPage}>
      <img src="banner.jpg" alt="" />
      <Form method="post" noValidate>
        <h1>Sign Up</h1>
        {message && <label>{message[0].msg}</label>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={
            message && message.find((e) => e.path === "email") && "error"
          }
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={
            message && message.find((e) => e.path === "password") && "error"
          }
        />
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className={
            message && message.find((e) => e.path === "fullName") && "error"
          }
        />
        <input
          type="number"
          name="phone"
          placeholder="Phone"
          className={
            message && message.find((e) => e.path === "phone") && "error"
          }
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className={
            message && message.find((e) => e.path === "address") && "error"
          }
        />
        <button>SIGN UP</button>
        <span>
          Login? <NavLink to="/login">Click</NavLink>
        </span>
      </Form>
    </div>
  );
}

export default RegisterPage;
