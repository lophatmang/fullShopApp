import { Form, useActionData, useSearchParams } from "react-router-dom";
import classes from "./NewProduct.module.css";
import { useEffect, useState } from "react";
const categoryList = [
  "Iphone",
  "Ipad",
  "Macbook",
  "Airpod",
  "Watch",
  "Mouse",
  "Keybroad",
];

function NewProduct() {
  const message = useActionData();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    return <Navigate to="/login" />;
  } else if (currentUser.role !== "admin") {
    return <Navigate to="/support" />;
  }
  const [searchParams] = useSearchParams();
  const edit = searchParams.get("edit");
  const productId = searchParams.get("id");
  const [product, setProduct] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (edit) {
      async function api() {
        const res = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/admin/editProduct?id=${productId}`,
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
          setProduct(data);
        }
      }
      api();
    }
  }, []);

  return (
    <div className={classes.addProduct}>
      {message && message.validationErrors && <span>{message[0].msg}</span>}
      <Form method="POST" encType="multipart/form-data">
        <label>Product Name</label>
        <input
          className={
            message &&
            message.validationErrors &&
            message.validationErrors.find((e) => e.path === "name") &&
            "error"
          }
          type="text"
          name="name"
          placeholder="Enter Product Name"
          value={product && product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <label>Category</label>
        <select
          style={{ padding: "5px" }}
          className={
            message &&
            message.validationErrors &&
            message.validationErrors.find((e) => e.path === "category") &&
            "error"
          }
          name="category"
        >
          <option value="">Select Category</option>
          {categoryList.map((e, i) => (
            <option
              key={i}
              selected={product && product.category == e.toLowerCase()}
              value={e.toLowerCase()}
            >
              {e}
            </option>
          ))}
        </select>
        <label>Price</label>
        <input
          className={
            message &&
            message.validationErrors &&
            message.validationErrors.find((e) => e.path === "price") &&
            "error"
          }
          type="number"
          name="price"
          placeholder="Enter Price"
          value={product && product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <label>Short Description</label>
        <input
          className={
            message &&
            message.validationErrors &&
            message.validationErrors.find((e) => e.path === "short_desc") &&
            "error"
          }
          type="text"
          name="short_desc"
          placeholder="Enter Short Description"
          value={product && product.short_desc}
          onChange={(e) =>
            setProduct({ ...product, short_desc: e.target.value })
          }
        />
        <label>Inventory</label>
        <input
          className={
            message &&
            message.validationErrors &&
            message.validationErrors.find((e) => e.path === "inventory") &&
            "error"
          }
          type="number"
          name="inventory"
          placeholder="Enter inventory"
          value={product && product.inventory}
          onChange={(e) =>
            setProduct({ ...product, inventory: e.target.value })
          }
        />
        <label>Long Description</label>
        <textarea
          className={
            message &&
            message.validationErrors &&
            message.validationErrors.find((e) => e.path === "long_desc") &&
            "error"
          }
          name="long_desc"
          type="text"
          placeholder="Enter Long Description"
          rows="5"
          value={product && product.long_desc}
          onChange={(e) =>
            setProduct({ ...product, long_desc: e.target.value })
          }
        ></textarea>
        <label>Upload image (5 images)</label>
        <input name="file" type="file" multiple disabled={edit} />
        {product && (
          <input type="hidden" name="productId" value={product._id} />
        )}
        <button type="submit">SUBMIT</button>
      </Form>
    </div>
  );
}

export default NewProduct;
