import { NavLink, Outlet, redirect, useNavigate } from "react-router-dom";
import classes from "./Layout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { useEffect, useRef, useState } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import Chat from "../chat/Chat";

const listFooter = [
  [
    "CUSTOMER SERVICES",
    "Help & Contact Us",
    "Returns & Refunds",
    "Online Stores",
    "Terms & Conditions",
  ],
  ["COMPANY", " What We Do", "Available Services", "Latest Posts", "FAQS"],
  ["SOCIAL MEDIA", "Twitter", "Instagram", "Facebook", "Pinterest"],
];

//////////////// STORE /////////////////////////////////////

export const popupSlice = createSlice({
  name: "popupProduct",
  initialState: { show: false, product: {} },
  reducers: {
    showPopup(state, action) {
      state.show = true;
      state.product = action.payload;
    },
    hidePopup(state) {
      state.show = false;
      state.product = {};
    },
  },
});
export const userSlice = createSlice({
  name: "user",
  initialState: { user: "" },
  reducers: {
    onLogin(state, action) {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            userId: action.payload.userId,
            fullName: action.payload.fullName,
            role: action.payload.role,
          })
        );
      }
    },
    autoLogout(state) {
      swal("Phiên đăng nhập đã hết hạn", "Vui lòng đăng nhập lại", "warning");
      state.user = "";
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("currentUser");
    },
    onLogout(state) {
      swal("Đăng xuất thành công", "Bạn đã đăng xuất tài khoản", "success");
      state.user = "";
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("currentUser");
    },
  },
});
export const cartSlice = createSlice({
  name: "cart",
  initialState: { listCart: [], subTotal: 0, total: 0 },
  reducers: {
    LoadData(state, action) {
      state.listCart = action.payload;
      /////////////////cập nhật local/////////////////////////////////////////////
      localStorage.setItem("listCart", JSON.stringify(state.listCart));
    },
    addCart(state, action) {
      const index = state.listCart.findIndex(
        (e) => e._id == action.payload._id
      );
      if (index == -1) {
        state.listCart.push(action.payload);
        /////////////////cập nhật local/////////////////////////////////////////////
        localStorage.setItem("listCart", JSON.stringify(state.listCart));
      } else {
        state.listCart[index].amount += action.payload.amount;
        /////////////////cập nhật local/////////////////////////////////////////////
        localStorage.setItem("listCart", JSON.stringify(state.listCart));
      }
    },
    deleteCart(state, action) {
      state.listCart = state.listCart.filter((e) => e._id !== action.payload);
      /////////////////cập nhật local/////////////////////////////////////////////
      localStorage.setItem("listCart", JSON.stringify(state.listCart));
    },
    changeAmount(state, action) {
      const index = state.listCart.findIndex((e) => e._id == action.payload.id);
      state.listCart[index].amount += action.payload.number;
      /////////////////cập nhật local/////////////////////////////////////////////
      localStorage.setItem("listCart", JSON.stringify(state.listCart));
    },
    subTotal(state) {
      state.subTotal = state.listCart.reduce(
        (cur, e) => cur + e.price * e.amount,
        0
      );
      /////////////////cập nhật local/////////////////////////////////////////////
      localStorage.setItem("listCart", JSON.stringify(state.listCart));
    },
    total(state, action) {
      state.total = state.subTotal - state.subTotal * (action.payload / 100);
      /////////////////cập nhật local/////////////////////////////////////////////
      localStorage.setItem("listCart", JSON.stringify(state.listCart));
    },
  },
});

export const detailSlice = createSlice({
  name: "detail",
  initialState: { amount: 1, showImg: "" },
  reducers: {
    setAmount(state, action) {
      state.amount = action.payload;
    },
    setShowImg(state, action) {
      state.showImg = action.payload;
    },
  },
});

const chatslice = createSlice({
  name: "chat",
  initialState: { messageList: [] },
  reducers: {
    userChat(state, action) {
      state.messageList.push(action.payload);
    },
    SupportAuto(state, action) {
      const message = `Chào bạn ${action.payload}!!`;
      state.messageList.push({ message: message, active: true });
      state.messageList.push({
        message: " chúng tôi có thể hổ trợ gì cho bạn?",
        active: true,
      });
    },
  },
});

const store = configureStore({
  reducer: {
    popUp: popupSlice.reducer,
    user: userSlice.reducer,
    cart: cartSlice.reducer,
    detail: detailSlice.reducer,
    chat: chatslice.reducer,
  },
});

////////////////// LAYOUT ///////////////////////////////////////////
function Layout(props) {
  return (
    <Provider store={store}>
      <div className={classes.layout}>
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </Provider>
  );
}

function Navbar() {
  const user = useSelector(
    (state) => state.user.user && state.user.user.fullName
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (currentUser) {
      dispatch(
        userSlice.actions.onLogin({
          userId: currentUser.userId,
          fullName: currentUser.fullName,
          role: currentUser.role,
          token: token,
        })
      );
    }
  }, []);

  return (
    <div className={classes.navbar}>
      <div className={classes.navlink}>
        <NavLink
          className={({ isActive }) => (isActive ? classes.active : "")}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? classes.active : "")}
          to="/shop"
        >
          Shop
        </NavLink>
      </div>

      <h1>BOUTIQUE</h1>
      <div className={classes.navlink}>
        <NavLink
          className={({ isActive }) => (isActive ? classes.active : "")}
          to="/cart"
        >
          <FontAwesomeIcon
            style={{ marginRight: "5px", color: "#00000059" }}
            icon="fa-solid fa-cart-shopping"
          />
          Cart
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? classes.active : "")}
          to={currentUser ? "/order" : "/login"}
        >
          <FontAwesomeIcon
            style={{ marginRight: "5px", color: "#00000059" }}
            icon="fa-solid fa-user"
          />
          {currentUser ? `${currentUser.fullName.split(" ").pop()}▾` : "Login"}
        </NavLink>
        {user && (
          <a
            onClick={() => {
              dispatch(userSlice.actions.onLogout());
              navigate("/");
            }}
          >
            ( logout )
          </a>
        )}
      </div>
    </div>
  );
}

function Footer() {
  const [showPopup, setShowPopup] = useState(false);
  const ref = useRef();
  const refImg = useRef();
  const [date, setDate] = useState();

  useEffect(() => {
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") setShowPopup(false);
      },
      false
    );
    document.addEventListener(
      "click",
      (e) => {
        if (
          ref.current &&
          !ref.current.contains(e.target) &&
          !refImg.current.contains(e.target)
        )
          setShowPopup(false);
      },
      false
    );

    // clock time out
    const interVal = setInterval(() => {
      const expiryDate = localStorage.getItem("expiryDate");
      if (expiryDate) {
        const time = new Date(expiryDate).getTime() - new Date().getTime();
        setDate(time);
      } else {
        setDate();
      }
    }, 1000);

    return () => {
      clearInterval(interVal);
    };
  }, []);

  return (
    <>
      <div
        className={classes.footer}
        style={
          date > 60000
            ? {
                "--fcc-background": "#4bd44b",
                "--fcc-label-color": "#4bd44b",
                "--fcc-separator-color": "#4bd44b",
              }
            : {
                "--fcc-background": "#ff0000",
                "--fcc-label-color": "#ff0000",
                "--fcc-separator-color": "#ff0000",
              }
        }
      >
        {date && (
          <div className={classes.clockOutTime}>
            <label
              style={date > 60000 ? { color: "#4bd44b" } : { color: "#ff0000" }}
            >
              Logout Later
            </label>
            <FlipClockCountdown
              renderMap={[false, false, true, true]}
              to={new Date().getTime() + date}
            />
          </div>
        )}
        <img
          ref={refImg}
          onClick={() => setShowPopup(!showPopup)}
          src="message.webp"
        />
        <div className={classes.layout}>
          {listFooter.map((e, i) => (
            <ul key={i}>
              {e.map((e, i) => (
                <li key={i}>
                  <NavLink to="#">{e}</NavLink>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div ref={ref}>{showPopup && <Chat setShowPopup={setShowPopup} />}</div>
    </>
  );
}
export default Layout;
