import { useLoaderData, useNavigate } from "react-router";
import classes from "./HomePage.module.css";
import popup from "./Popup.module.css";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format2 } from "../API";
import { popupSlice } from "../Layout/Layout";
import { OrbitProgress } from "react-loading-indicators";

const listProduct = [
  { img: "product_1.png", tag: "iphone" },
  { img: "product_2.png", tag: "macbook" },
  { img: "product_3.png", tag: "ipad" },
  { img: "product_4.png", tag: "watch" },
  { img: "product_5.png", tag: "airpod" },
];

function HomePage() {
  const navigate = useNavigate();
  const dataLoader = useLoaderData();
  const data = dataLoader.slice(0, 8);

  return (
    <div className={classes.home}>
      <div className={classes.banner}>
        <img src="/banner1.jpg" alt="banner" />
        <div className={classes.detaiBanner}>
          <span>NEW INSPIRATION 2020</span>
          <h1>20% OFF ON NEW SEASON</h1>
          <button onClick={() => navigate("/shop")}>Browse collections</button>
        </div>
      </div>
      <div className={classes.category}>
        <span>CAREFULLY CREATED COLLECTIONS</span>
        <h1>BROWSE OUR CATEGORIES</h1>
        <ul>
          {listProduct.map((e, i) => (
            <li className={classes[`img${i + 1}`]} key={i}>
              <img
                onClick={() => navigate(`/shop?category=${e.tag}`)}
                src={e.img}
                alt={`product${i}`}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className={classes.trending}>
        <span>MADE THE HARD WAY</span>
        <h1>TOP TRENDING PRODUCTS</h1>
        <ul>
          {data.map((e) => (
            <Product key={e._id} e={e} />
          ))}
        </ul>
      </div>
      <div className={classes.service}>
        <div>
          <h3>FREE SHIPPING</h3>
          <span>Free shipping worlwide</span>
        </div>
        <div>
          <h3>24 X 7 SERVICE</h3>
          <span>Free shipping worlwide</span>
        </div>
        <div>
          <h3>FESTIVAL OFFER</h3>
          <span>Free shipping worlwide</span>
        </div>
      </div>
      <div className={classes.subscribe}>
        <div style={{ width: "100%" }}>
          <h2>LET'S BE FRIENDS!</h2>
          <span>Nisi nisi tempor consequat laboris nisi.</span>
        </div>
        <div style={{ width: "100%", textAlign: "right" }}>
          <input type="text" placeholder="Enter your email address" />
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  );
}

function Product(prop) {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.popUp.show);

  return (
    <>
      <li>
        <img
          onClick={() => dispatch(popupSlice.actions.showPopup(prop.e))}
          src={prop.e.img1}
          alt=""
        />
        <p>{prop.e.name}</p>
        <span>{format2(prop.e.price)} VND</span>
        {show && <PopUp />}
      </li>
    </>
  );
}

function PopUp() {
  const product = useSelector((state) => state.popUp.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <div className={popup.modal}>
        <div className={popup["modal-content"]}>
          <span
            onClick={() => dispatch(popupSlice.actions.hidePopup())}
            className={popup.close}
          >
            &times;
          </span>
          <div className={popup.product}>
            <img src={product.img1} alt="" />
            <div className={popup.detail}>
              <h1>{product.name}</h1>
              <span>{format2(product.price)} VND</span>
              <p>{product.short_desc.slice(0, 600)}</p>
              <button
                onClick={() => {
                  navigate(`/detail/${product._id}`);
                  dispatch(popupSlice.actions.hidePopup());
                  window.scrollTo(0, 0);
                }}
              >
                <FontAwesomeIcon
                  style={{ margin: "0 5px", color: "white" }}
                  icon="fa-solid fa-cart-shopping"
                />
                View Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
