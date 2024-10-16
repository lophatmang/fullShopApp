import { useLoaderData } from "react-router";
import classes from "./Order.module.css";
import { format2 } from "../API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Order() {
  function renderStatus(status) {
    switch (status) {
      case "paying":
        return "Waitting for pay";
      case "shipping":
        return "on delivery";
      case "completed":
        return "Order Delivered";
      case "canceled":
        return "Order has been cancelled";
      default:
        return "waiting for confirmation";
    }
  }
  const orderList = useLoaderData();
  return (
    <div className={classes.orderPage}>
      <header>
        <h1>Order</h1>
        <span>Order</span>
      </header>
      <div className={classes.table}>
        {orderList && orderList.length == 0 ? (
          <img src="noOrder.jpg" alt="" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID ORDER</th>
                <th>ID USER</th>
                <th>NAME</th>
                <th>PHONE</th>
                <th>ADDRESS</th>
                <th>TOTAL</th>
                <th>DELIVERY</th>
                <th>STATUS</th>
                <th>DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((e) => (
                <tr key={e._id}>
                  <th>
                    <p>{e._id.slice(0, 15)}...</p>
                  </th>
                  <th>
                    <p>{e.userId.slice(0, 15)}...</p>
                  </th>
                  <th>
                    <p>{e.fullName.split(" ").pop()}</p>
                  </th>
                  <th>
                    <p>{e.phone}</p>
                  </th>
                  <th>
                    <p>{e.address.slice(0, 10)}...</p>
                  </th>
                  <th>
                    <p>{format2(e.totalPrice)} VND</p>
                  </th>
                  <th>
                    <p>{renderStatus(e.status)}</p>
                  </th>
                  <th>
                    <p>{renderStatus(e.status)}</p>
                  </th>

                  <th>
                    <button>
                      <Link to={`/order/${e._id}`}>
                        <span>
                          View
                          <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
                        </span>
                      </Link>
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Order;
