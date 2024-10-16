import {
  Navigate,
  NavLink,
  useLoaderData,
  useNavigate,
  useRevalidator,
  Outlet,
  useParams,
} from "react-router-dom";
import classes from "./Support.module.css";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function Chat() {
  const data = useLoaderData();
  const params = useParams();
  const navigate = useNavigate();
  const userChat = params.userId;
  const listRef = useRef();
  const [messageList, setMessageList] = useState();
  const socket = useRef();
  if (data && data.length == 0 && userChat) return <Navigate to="/support" />;

  useEffect(() => {
    ///////////////////////////////////
    socket.current = io(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}`);
    socket.current.on("sendDataServer", (dataGot) => {
      console.log(userChat == dataGot.data.userId);
      if (userChat == dataGot.data.userId) {
        setMessageList((messageList) => [...messageList, dataGot.data]);
      }
    });
    socket.current.on("deleteRoom", (dataGot) => {
      if (userChat == dataGot.userId) {
        // location.replace("/support");
        navigate("/support");
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [params]);

  useEffect(() => {
    if (userChat) {
      const chat = data.find((e) => e.userId === userChat);
      if (chat) {
        setMessageList(chat.chatMessage);
      }
    }
  }, [userChat]);

  function sendMess(e) {
    e.preventDefault();
    if (e.target.message.value) {
      const msg = {
        message: e.target.message.value,
        userId: userChat,
        role: "admin",
      };
      socket.current.emit("sendDataClient", msg);
    }

    e.target.message.value = "";
    setTimeout(() => {
      if (listRef.current && listRef.current.lastElementChild) {
        listRef.current.lastElementChild.scrollIntoView();
      }
    }, 1);
  }
  return (
    <div className={classes.chatMessage}>
      {messageList && (
        <>
          <ul ref={listRef}>
            {messageList.map((e, i) => (
              <li
                className={
                  e.role === "admin" ? classes.support : classes.userChat
                }
                key={i}
              >
                {e.role !== "admin" && <img src="/User_icon.svg.png" alt="" />}
                {e.role === "admin"
                  ? `Cộng tác viên: ${e.message}`
                  : `Client: ${e.message}`}
              </li>
            ))}
          </ul>
          {/* //////////////////////////////////////////// */}
          <form onSubmit={sendMess}>
            <input type="text" name="message" placeholder="Type and Enter" />
            <button type="submit">
              <img src="/sendMessage.png" alt="" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Chat;
