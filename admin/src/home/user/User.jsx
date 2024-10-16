import { useEffect, useState } from "react";
import classes from "./User.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Navigate } from "react-router-dom";

function User() {
  const [page, setPage] = useState(1);
  const [userList, setUserList] = useState();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return <Navigate to="/login" />;
  } else if (currentUser.role !== "admin") {
    return <Navigate to="/support" />;
  }
  useEffect(() => {
    async function api() {
      const res = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/admin/userList?page=${page}`,
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
        setUserList(data);
      }
    }
    api();
  }, [page]);
  return (
    <div className={classes.user}>
      <h3>User List</h3>
      {userList && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>phoneNumber</th>
                <th>email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {userList.results.map((e, i) => (
                <tr key={e._id}>
                  <td>{e._id}</td>
                  <td>{e.fullName}</td>
                  <td>{e.phone}</td>
                  <td>{e.email}</td>
                  <td>
                    <p className={classes[e.role]}>{e.role}</p>
                  </td>
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
            <button style={{ cursor: "default" }}>
              {userList.total_pages}
            </button>
            <button
              disabled={page == userList.total_pages && "disabled"}
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

export default User;
