import { useLoaderData, useNavigate } from "react-router";
import classes from "./ShopPage.module.css";
import { useSearchParams } from "react-router-dom";
import { format2 } from "../API";

const productList = [
  { tag: "All", active: false },
  { tag: "IPHONE & MAC", active: true },
  { tag: "Iphone", active: false },
  { tag: "Ipad", active: false },
  { tag: "Macbook", active: false },
  { tag: "WIRELESS", active: true },
  { tag: "Airpod", active: false },
  { tag: "Watch", active: false },
  { tag: "ORTHER", active: true },
  { tag: "Mouse", active: false },
  { tag: "Keybroad", active: false },
  { tag: "Other", active: false },
];

function ShopPage() {
  return (
    <div className={classes.shopPage}>
      <header>
        <h1>SHOP</h1>
        <span>SHOP</span>
      </header>
      <div className={classes.categories}>
        <ProductList />
        <Category />
      </div>
    </div>
  );
}

function ProductList() {
  const navigate = useNavigate();
  return (
    <div className={classes.productList}>
      <h1>CATEGORIES</h1>
      <div
        style={{
          backgroundColor: "black",
          color: "white",
        }}
      >
        <p style={{ padding: "20px 30px" }}>APPLE</p>
      </div>
      <ul>
        {productList.map((e, i) => (
          <li
            onClick={() => !e.active && navigate(`/shop?category=${e.tag}`)}
            key={i}
            className={e.active && classes.active}
          >
            {e.tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Category() {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const data = loaderData.filter(
    (e) =>
      e.category ==
      (category && category !== "All" ? category.toLowerCase() : e.category)
  );

  return (
    <div className={classes.category}>
      <input type="text" placeholder="Enter search here!!" />
      <ul key={category}>
        {data.map((e) => (
          <li
            onClick={() => {
              navigate(`/detail/${e._id}`);
              window.scrollTo(0, 0);
            }}
            key={e._id}
          >
            <img src={e.img1} alt="" />
            <p>{e.name}</p>
            <span>{format2(e.price)} VND</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShopPage;
