import {
  Form,
  Link,
  Navigate,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import classes from "./Product.module.css";
import { format2 } from "../../router/Router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Product() {
  const data = useLoaderData();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [search, setSearch] = useState();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return <Navigate to="/login" />;
  } else if (currentUser.role !== "admin") {
    return <Navigate to="/support" />;
  }
  let productList = [];
  useEffect(() => {
    if (page) {
      navigate(`/product?page=${page}`);
    }
  }, [page]);

  if (data) {
    productList = search
      ? data.results.filter((e) =>
          e.name.toLowerCase().includes(search.toLowerCase())
        )
      : data.results;
  }
  return (
    <div className={classes.product}>
      <h3>Product List</h3>
      <input
        type="text"
        placeholder="Enter Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {data && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Image</th>
                <th>Category</th>
                <th>Inventory</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((e) => (
                <tr key={e._id}>
                  <td>{e._id}</td>
                  <td>{e.name}</td>
                  <td>{format2(e.price)} VND</td>
                  <td style={{ width: "20%" }}>
                    <img src={e.img1} alt="" />
                  </td>
                  <td>{e.category}</td>
                  <td>{e.inventory}</td>
                  <td>
                    <Form method="POST">
                      <Link to={`/newProduct?edit=true&id=${e._id}`}>
                        <button
                          style={{
                            border: "1px solid green",
                            backgroundColor: "green",
                          }}
                        >
                          Update
                        </button>
                      </Link>
                      <input type="hidden" name="productId" value={e._id} />
                      <button type="submit">Delete</button>
                    </Form>
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
            <button style={{ cursor: "default" }}>{data.total_pages}</button>
            <button
              disabled={page == data.total_pages && "disabled"}
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

export default Product;
