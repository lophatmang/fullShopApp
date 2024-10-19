import {
  NavLink,
  useLoaderData,
  useNavigate,
  useParams,
  Outlet,
} from "react-router-dom";
import classes from "./Support.module.css";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function Support() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [search, setSearch] = useState();
  const [listChat, setListChat] = useState(data);
  const params = useParams();
  const userChat = params.userId;
  const socket = useRef();

  const expiryDate = localStorage.getItem("expiryDate");
  if (new Date(expiryDate).getTime() < new Date().getTime()) {
    swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
  }

  useEffect(() => {
    ///////////////////////////////////
    socket.current = io(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}`);

    socket.current.on("deleteRoom", (dataGot) => {
      setListChat(dataGot.userList);
      if (userChat == dataGot.userId) {
        swal(`Phiên chat đã đóng`, "Khách hàng đã thoát phiên chat", "warning");
        navigate("/support");
      }
    });
    socket.current.on("newRoom", (dataGot) => {
      swal(
        `Bạn có tin nhắn mới`,
        "Vui lòng kiểm tra mới của tin nhắn khách hàng",
        "warning"
      );
      setListChat(dataGot.userList);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [params]);

  useEffect(() => {
    if (search) {
      const arrChat = data.filter((e) => e.userId.includes(search));
      setListChat(arrChat);
    }
  }, [search]);

  return (
    <div className={classes.chat}>
      <h1>Chat</h1>
      <span style={{ color: "#00000055" }}>App / Chat</span>

      <div className={classes.formChat}>
        <div className={classes.navbar}>
          <div>
            <input
              type="text"
              placeholder="Search contact"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
          {listChat &&
            listChat.map((e) => (
              <NavLink
                style={{
                  backgroundColor: e.userId == userChat && "#48b0f7",
                  color: e.userId == userChat && "white",
                }}
                key={e._id}
                to={`/support/${e.userId}`}
              >
                <img src="/User_icon.svg.png" alt="" />
                {e.userId}
              </NavLink>
            ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Support;
