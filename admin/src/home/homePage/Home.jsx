import {
  Link,
  Navigate,
  Outlet,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import classes from "./Home.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { format2 } from "../../router/Router";

function Home() {
  const data = useLoaderData();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [order, setOrder] = useState();
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");

  if (!currentUser) {
    return <Navigate to="/login" />;
  } else if (currentUser.role !== "admin") {
    return <Navigate to="/support" />;
  }
  function changTime(date) {
    const day = new Date(date.slice(0, 10));
    return day.getTime();
  }

  const earning = data.transaction
    .filter((e) => e.status == "completed")
    .reduce((cur, e) => cur + e.totalPrice, 0);

  function balance() {
    const sort = data.transaction
      .sort((a, b) => changTime(b.orderTime) - changTime(a.orderTime))
      .filter((e) => e.status == "completed");

    if (sort.length !== 0) {
      const count =
        sort[0].orderTime.slice(8, 10) -
        sort[sort.length - 1].orderTime.slice(8, 10) +
        1;

      const balanceTotal = sort.reduce((cur, e) => cur + e.totalPrice, 0);
      return balanceTotal / count;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    async function api() {
      const res = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/admin/order?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await res.json();

      if (data.errorMessage && data.errorMessage !== "jwt expired") {
        await swal(`${data.errorMessage}`, "", "error");
        return redirect("/");
      } else if (data.errorMessage === "jwt expired") {
        await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("expiryDate");
        localStorage.removeItem("currentUser");
        return location.replace("/login");
      } else {
        setOrder(data);
      }
    }
    api();
  }, [page]);

  function renderStatus(status) {
    switch (status) {
      case "paying":
        return "Chờ thành toán";
      case "shipping":
        return "Đang giao hàng";
      case "completed":
        return "Đã giao hàng";
      case "canceled":
        return "Đơn hàng đã bị hủy";
      default:
        return "Chờ xác nhận";
    }
  }

  return (
    <div className={classes.home}>
      {data && (
        <div className={classes.quantity}>
          <div>
            <span>USERS</span>
            <h3>{data.user.length}</h3>
            <FontAwesomeIcon
              style={{ color: "red", backgroundColor: "#ff00002f" }}
              icon="fa-solid fa-user"
            />
          </div>
          <div>
            <span>ORDERS</span>
            <h3>{data.transaction.length}</h3>
            <FontAwesomeIcon
              style={{ color: "gold", backgroundColor: "#ffd9004e" }}
              icon="fa-solid fa-cart-shopping"
            />
          </div>
          <div>
            <span>EARNINGS</span>
            <h3>{`$ ${earning}`}</h3>
            <FontAwesomeIcon
              style={{ color: "green", backgroundColor: "#0080003e" }}
              icon="fa-solid fa-dollar-sign"
            />
          </div>
          <div>
            <span>BALANCE</span>
            <h3>{`$ ${balance()}`}</h3>
            <FontAwesomeIcon
              style={{ color: "purple", backgroundColor: "#80008037" }}
              icon="fa-solid fa-wallet"
            />
          </div>
        </div>
      )}
      {order && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID User</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total</th>
                <th>DELIVERY</th>
                <th>STATUS</th>
                <th>DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {order.results.map((e) => (
                <tr key={e._id}>
                  <td>
                    <p>{e.userId.slice(0, 15)}...</p>
                  </td>
                  <td>
                    <p>{e.fullName.split(" ").pop()}</p>
                  </td>
                  <td>
                    <p>{e.phone}</p>
                  </td>
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
                        <span>View</span>
                      </Link>
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={classes.buttonPage}>
            <button
              disabled={page == 1 && "disabled"}
              onClick={() => setPage(page - 1)}
            >
              <FontAwesomeIcon icon="fa-solid fa-caret-left" />
            </button>
            <button style={{ cursor: "default" }}>{page}</button>
            <button style={{ cursor: "default" }}>{` / `}</button>
            <button style={{ cursor: "default" }}>{order.total_pages}</button>
            <button
              disabled={page == order.total_pages && "disabled"}
              onClick={() => setPage(page + 1)}
            >
              <FontAwesomeIcon icon="fa-solid fa-caret-right" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
