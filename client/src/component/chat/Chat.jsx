import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Chat.module.css";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { io } from "socket.io-client";

function Chat(props) {
  const listRef = useRef();
  const socket = useRef();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [messageList, setMessageList] = useState([]);
  const [timeOut, setTimeOut] = useState(60);
  const token = localStorage.getItem("token");

  const expiryDate = localStorage.getItem("expiryDate");
  if (new Date(expiryDate).getTime() < new Date().getTime()) {
    swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
    return <Navigate to="/login" />;
  }

  function exitRoom() {
    socket.current.emit("exit", { userId: currentUser.userId });
  }

  useEffect(() => {
    async function api() {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getChat`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await res.json();

      if (data.errorMessage && data.errorMessage !== "jwt expired") {
        await swal(`${data.errorMessage}`, "", "error");
      } else if (data.errorMessage === "jwt expired") {
        await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("expiryDate");
        localStorage.removeItem("currentUser");
        location.replace("/");
      } else {
        setMessageList(data.chatMessage);
      }
    }
    api();

    ///////////////////////////////////
    socket.current = io(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}`);
    socket.current.on("sendDataServer", (dataGot) => {
      setMessageList((messageList) => [...messageList, dataGot.data]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (timeOut == 0) {
      console.log("Time Out");
      setTimeOut(0);
      setMessageList([]);
      props.setShowPopup(false);
      exitRoom();
      return;
    }
    const interVal = setInterval(() => {
      setTimeOut(timeOut - 1);
    }, 1000);

    return () => {
      clearInterval(interVal);
    };
  }, [timeOut]);

  function sendMess(e) {
    e.preventDefault();
    if (e.target.message.value) {
      const msg = {
        message: e.target.message.value,
        userId: currentUser.userId,
        role: "user",
      };
      socket.current.emit("sendDataClient", msg);
      if (messageList.length == 0) {
        setMessageList((messageList) => [...messageList, msg]);
      }
    }

    e.target.message.value = "";
    setTimeOut(60);
    setTimeout(() => {
      if (listRef.current && listRef.current.lastElementChild) {
        listRef.current.lastElementChild.scrollIntoView();
      }
    }, 1);
  }

  return (
    <div className={classes.popup}>
      <div>
        <h4>Customes Support</h4>
        {timeOut !== 0 && <span>Time Over {timeOut}</span>}
        <button
          onClick={() => setTimeOut(0)}
          style={{
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "red",
            color: "white",
          }}
        >
          End Chat
        </button>
      </div>
      <ul ref={listRef}>
        {messageList &&
          messageList.map((e, i) => (
            <li
              className={
                e.role === "admin" ? classes.support : classes.userChat
              }
              key={i}
            >
              {e.role === "admin" && (
                <FontAwesomeIcon
                  style={{ color: "black" }}
                  icon="fa-solid fa-user-tie"
                />
              )}
              {e.role === "admin"
                ? `Cộng tác viên: ${e.message}`
                : `You: ${e.message}`}
            </li>
          ))}
      </ul>
      <form onSubmit={sendMess}>
        <FontAwesomeIcon icon="fa-solid fa-user-tie" />
        <input type="text" name="message" placeholder="Enter message!" />
        <button>
          <FontAwesomeIcon icon="fa-solid fa-paperclip" />
        </button>
        <button>
          <FontAwesomeIcon icon="fa-solid fa-face-smile" />
        </button>
        <button type="submit">
          <FontAwesomeIcon
            icon="fa-solid fa-paper-plane"
            style={{ color: "blue" }}
          />
        </button>
      </form>
    </div>
  );
}

export default Chat;
