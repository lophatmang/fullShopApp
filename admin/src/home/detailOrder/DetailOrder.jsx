import { useLoaderData } from "react-router";
import classes from "./DetailOrder.module.css";
import { format2 } from "../../router/Router";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DetailOrder() {
  const order = useLoaderData();
  return (
    <div className={classes.detailOrder}>
      <button className={classes.backToHome}>
        <Link to="/">
          <FontAwesomeIcon icon="fa-solid fa-house" />
          BACK TO HOME
        </Link>
      </button>
      <div>
        <h1>INFORMATION ORDER</h1>
        <span>ID User: {order.userId}</span>
        <span>Full Name: {order.fullName}</span>
        <span>Phone: {order.phone}</span>
        <span>Address: {order.address}</span>
        <span>Total: {format2(order.totalPrice)} VND</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID PRODUCT</th>
            <th>IMAGE</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>COUNT</th>
          </tr>
        </thead>
        <tbody>
          {order &&
            order.product.map((e) => (
              <tr key={e.productId._id}>
                <th>
                  <p>{e.productId._id}</p>
                </th>
                <th style={{ width: "20%" }}>
                  <img src={e.productId.img1} alt="" />
                </th>
                <th>
                  <p>{e.productId.name}</p>
                </th>
                <th>
                  <p>{format2(e.productId.price)} VND</p>
                </th>
                <th>
                  <p>{e.quantity}</p>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetailOrder;
