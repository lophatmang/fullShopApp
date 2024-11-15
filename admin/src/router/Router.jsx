import { redirect } from "react-router-dom";
import swal from "sweetalert";

export function format2(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export async function loaderTransaction() {
  const resUser = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/admin/user`
  );
  const resTransaction = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/admin/transaction`
  );
  const user = await resUser.json();
  const transaction = await resTransaction.json();
  return { user: user, transaction: transaction };
}

export async function loaderProduct({ params, request }) {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page");
  const token = localStorage.getItem("token");
  if (!token) {
    await swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
    return redirect("/login");
  }
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/admin/product?page=${
      page || 1
    }`,
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
    location.replace("/login");
    return data;
  } else {
    return data;
  }
}

export async function actionDeleteProduct({ request }) {
  const formData = await request.formData();
  const productId = formData.get("productId");
  const token = localStorage.getItem("token");
  if (!token) {
    await swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
    return redirect("/login");
  }
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/admin/deleteProduct`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ productId: productId }),
    }
  );
  const message = await res.json();
  if (message.errorMessage && message.errorMessage !== "jwt expired") {
    await swal(`${message.errorMessage}`, "", "error");
    return redirect("/");
  } else if (message.errorMessage === "jwt expired") {
    await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("currentUser");
    location.replace("/login");
    return message;
  } else {
    await swal(`${message.message}`, "", "success");
    location.replace("/product");
    return message;
  }
}

export async function loaderOrderDetail({ params }) {
  const token = localStorage.getItem("token");
  if (!token) {
    await swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
    return redirect("/login");
  }
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/detailOrder/${
      params.orderId
    }`,
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
    return redirect("/shop");
  } else if (data.errorMessage === "jwt expired") {
    await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("currentUser");
    location.replace("/login");
    return data;
  } else {
    return data;
  }
}

export async function actionAddProduct({ request }) {
  const formData = await request.formData();
  const files = formData.getAll("file");
  const token = localStorage.getItem("token");
  const productId = formData.get("productId");
  let image = [];
  if (!token) {
    await swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
    return redirect("/login");
  }
  if (!productId) {
    if (files.length !== 5) {
      swal(`Chưa đủ 5 tắm hình`, "Bạn phải up 5 tấm hình", "error");
      return FormData;
    }

    swal(`Loading`, "Đang upload hình ảnh", "warning", {
      buttons: false,
    });
    for (let i = 0; i < files.length; i++) {
      formData.append(`file${i + 1}`, files[i]);
    }
    const resImg = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Custom-Header": "value",
      },
      body: formData,
    });
    const dataImg = await resImg.json();
    image = [
      dataImg.files.file1,
      dataImg.files.file2,
      dataImg.files.file3,
      dataImg.files.file4,
      dataImg.files.file5,
    ];
  }

  const data = {
    productId: productId,
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
    long_desc: formData.get("long_desc"),
    short_desc: formData.get("short_desc"),
    image: image,
  };

  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/admin/addProduct`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    }
  );
  const message = await res.json();
  if (message.errorMessage && message.errorMessage !== "jwt expired") {
    swal(`${message.errorMessage}`, "", "error");
    return message || message.errorMessage;
  } else if (message.errorMessage === "jwt expired") {
    await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("currentUser");
    location.replace("/login");
    return message;
  } else {
    await swal(`${message.message}`, "", "success");
    location.replace("/product");
    return message;
  }
}

export async function loaderChat() {
  const token = localStorage.getItem("token");
  if (!token) {
    await swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
    return redirect("/login");
  }
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getChat`,
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
    return redirect("/shop");
  } else if (data.errorMessage === "jwt expired") {
    await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("currentUser");
    location.replace("/login");
    return data;
  } else {
    return data;
  }
}
