import { useDispatch, useSelector } from "react-redux";
import classes from "./CartPage.module.css";
import { cartSlice } from "../Layout/Layout";
import { discount, format2 } from "../API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Form,
  Navigate,
  NavLink,
  useLoaderData,
  useRevalidator,
} from "react-router-dom";
import { useEffect, useState } from "react";

function CartPage() {
  const arrCart = useLoaderData();
  const reload = useRevalidator();
  const product = arrCart.product;
  const token = localStorage.getItem("token");
  if (!token) {
    swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
    return <Navigate to="/login" />;
  }

  async function onSubmit(e) {
    e.preventDefault();

    // const coupon = e.target.coupon.value.toLowerCase();

    // // dispatch(cartSlice.actions.total(discount[coupon] || 0));
    // if (Object.keys(discount).includes(coupon)) {
    //   dispatch(cartSlice.actions.total(discount[coupon]));
    //   await swal(
    //     "Áp mã thành công",
    //     `Mã ${coupon.toUpperCase()} được giảm ${discount[coupon]}%`,
    //     "success"
    //   );
    //   e.target.coupon.value = "";
    // } else {
    //   dispatch(cartSlice.actions.total(0));
    //   swal(
    //     "Mã coupon sai",
    //     `Mã ${coupon.toUpperCase()} không hợp lệ hoặc đã hết hạn `,
    //     "error"
    //   );
    // }
  }

  return (
    <div className={classes.cartPage}>
      <header>
        <h1>CART</h1>
        <span>CART</span>
      </header>
      <h2>SHOPPING CART</h2>
      <div className={classes.cart}>
        <div>
          {product && product.length == 0 ? (
            <img src="empty-cart.webp" alt="" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>PRODUCT</th>
                  <th>PRICE</th>
                  <th>QUANTITY</th>
                  <th>TOTAL</th>
                  <th>REMOVE</th>
                </tr>
              </thead>
              <tbody>
                {product.map((e) => (
                  <tr key={e.productId._id}>
                    <th>
                      <img src={e.productId.img1} alt="" />
                    </th>
                    <th>
                      <p>{e.productId.name}</p>
                    </th>
                    <th>
                      <span>{format2(e.productId.price)} VND</span>
                    </th>
                    <th>
                      <Form method="POST">
                        <input
                          type="hidden"
                          value={e.productId._id}
                          name="productId"
                        />
                        <button
                          onClick={() => reload.revalidate()}
                          disabled={e.quantity == 1 && true}
                          type="submit"
                          name="minus"
                          value={e.quantity}
                        >
                          ◀
                        </button>
                        <button
                          style={{ cursor: "initial", color: "black" }}
                          disabled
                        >
                          {e.quantity}
                        </button>
                        <button
                          onClick={() => reload.revalidate()}
                          type="submit"
                          name="plus"
                          value={e.quantity}
                        >
                          ▶
                        </button>
                      </Form>
                    </th>
                    <th>
                      <span>{format2(e.productId.price * e.quantity)} VND</span>
                    </th>
                    <th>
                      <Form method="POST">
                        <button
                          type="submit"
                          name="deleteCart"
                          value={e.productId._id}
                          onClick={() => reload.revalidate()}
                        >
                          <span>
                            <FontAwesomeIcon icon="fa-regular fa-trash-can" />
                          </span>
                        </button>
                      </Form>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className={classes.checkout}>
            <NavLink to="/shop">
              <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
              <span style={{ marginLeft: "10px" }}>Continue shoppping</span>
            </NavLink>
            {product.length !== 0 && (
              <NavLink to="/checkout">
                <span style={{ marginRight: "10px" }}>Proceed to checkout</span>
                <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
              </NavLink>
            )}
          </div>
        </div>
        <form onSubmit={onSubmit} className={classes.total}>
          <h1>CART TOTAL</h1>
          <div>
            <p>SUBTOTAL</p>
            <span>{format2(arrCart.totalPrice)} VND</span>
          </div>
          <div style={{ borderBottom: "1px solid #00000060" }}>
            {/* <p>discount (-{100 - (total / subTotal) * 100}%)</p> */}
            <p>discount (0%)</p>
            {/* <span>{format2(total - subTotal)} VND</span> */}
            <span>0 VND</span>
          </div>
          <div>
            <p>TOTAL</p>
            <p>{format2(arrCart.totalPrice)} VND</p>
          </div>
          <input name="coupon" type="text" placeholder="Email your coupon" />

          <button>
            <FontAwesomeIcon
              style={{ marginRight: "10px" }}
              icon="fa-solid fa-gift"
            />
            Apply coupon
          </button>
        </form>
      </div>
    </div>
  );
}

export default CartPage;
