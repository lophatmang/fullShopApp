import {
  Form,
  Navigate,
  NavLink,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import classes from "./CheckoutPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { format2 } from "../API";
import { cartSlice } from "../Layout/Layout";
import { useState } from "react";

function CheckoutPage() {
  const data = useLoaderData();
  const arrCart = data.product;
  const total = data.totalPrice;
  const [user, setUser] = useState(data.userId);

  const token = localStorage.getItem("token");
  if (!token) {
    swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
    return <Navigate to="/login" />;
  }

  return (
    <div className={classes.checkout}>
      <header>
        <h1>CHECKOUT</h1>
        <div>
          <NavLink to="/">HOME /</NavLink>
          <NavLink to="/cart">CART /</NavLink>
          <span>CHECKOUT</span>
        </div>
      </header>

      {arrCart.length == 0 ? (
        <img src="empty-cart.webp" alt="" />
      ) : (
        <>
          <h2>BILLING DETAILS</h2>
          <div className={classes.checkoutForm}>
            <Form method="POST">
              <label>
                <span>FULL NAME:</span>
              </label>
              <input
                value={user && user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                name="fullName"
                type="text"
                placeholder="Enter Your Full Name Here!"
              />
              <label>
                <span>EMAIL:</span>
              </label>
              <input
                value={user && user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                name="email"
                type="email"
                placeholder="Enter Your Email Here!"
              />
              <label>
                <span>PHONE NUMBER:</span>
              </label>
              <input
                value={user && user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                name="phone"
                type="number"
                placeholder="Enter Your Phone Number Here!"
              />
              <label>
                <span>ADDRESS:</span>
              </label>
              <input
                value={user && user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                name="address"
                type="text"
                placeholder="Enter Your Address Here!"
              />
              <button type="submit">Place order</button>
            </Form>
            <div className={classes.checkoutTotal}>
              <h2>YOUR ORDER</h2>
              {arrCart.map((e) => (
                <div key={e.productId._id}>
                  <p>{e.productId.name}</p>
                  <span>
                    {format2(e.productId.price)} vnd x {e.quantity}
                  </span>
                </div>
              ))}
              <div style={{ border: "none", marginBottom: "30px" }}>
                <h3>TOTAL</h3>
                <h3>{format2(total)} vnd</h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CheckoutPage;
