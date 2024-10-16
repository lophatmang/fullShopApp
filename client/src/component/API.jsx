import { redirect, replace } from "react-router";
import swal from "sweetalert";

export const discount = {
  member: 10,
  vip: 20,
  svip: 30,
  ssvip: 50,
  lophatmang: 100,
};

export function format2(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export async function loaderHomePage() {
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/products`
  );
  const data = await res.json();
  return data;
}

export async function loaderProductDetail({ params }) {
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/product/${params.productId}`
  );
  const data = await res.json();
  return data;
}

export async function actionRegister({ request }) {
  const formData = await request.formData();

  const user = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  };

  const req = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/regiseter`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }
  );
  const message = await req.json();
  if (message.errorMessage) {
    swal(`${message.errorMessage}`, "", "error");
    return message.validationErrors;
  } else {
    swal(`${message.message}`, "", "success");
    return redirect("/login");
  }
}

export async function actionAddCart({ request }) {
  const formData = await request.formData();
  const token = formData.get("token");

  const data = {
    amount: formData.get("amount"),
    productId: formData.get("productId"),
  };

  if (!token) {
    await swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập để mua hàng", "error");
    return redirect("/login");
  }
  const req = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/addCart`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    }
  );
  const message = await req.json();

  if (message.errorMessage && message.errorMessage !== "jwt expired") {
    swal(`${message.errorMessage}`, "", "error");
    return message.errorMessage;
  } else if (message.errorMessage === "jwt expired") {
    await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("currentUser");
    location.replace("/");
    return message;
  } else {
    await swal(`${message.message}`, "", "success");
    return redirect("/cart");
  }
}

export async function loaderCart() {
  const token = localStorage.getItem("token");
  if (!token) {
    await swal(
      `Bạn chưa đăng nhập`,
      "Vui lòng đăng nhập để xem giỏ hàng",
      "error"
    );
    return redirect("/login");
  }
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/cart`,
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
    location.replace("/");
    return data;
  } else {
    return data;
  }
}

export async function actionChangeCart({ request }) {
  const formData = await request.formData();
  const data = {
    minus: formData.get("minus"),
    plus: formData.get("plus"),
    productId: formData.get("productId"),
  };
  const deleteCart = formData.get("deleteCart");

  const token = localStorage.getItem("token");
  if (!token) {
    await swal(`Bạn chưa đăng nhập`, "Vui lòng đăng nhập", "error");
    return redirect("/login");
  }

  if (deleteCart) {
    const req = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/delelecart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ productId: deleteCart }),
      }
    );
    const message = await req.json();
    if (data.errorMessage && data.errorMessage !== "jwt expired") {
      swal(`${message.errorMessage}`, "", "error");
      return message.validationErrors;
    } else if (data.errorMessage === "jwt expired") {
      await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("currentUser");
      location.replace("/");
      return message;
    } else {
      await swal(`${message.message}`, "", "success");
      return redirect("/cart");
    }
  } else {
    const req = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/addCart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          productId: data.productId,
          amount: data.minus ? -1 : 1,
        }),
      }
    );
    const message = await req.json();
    if (message.errorMessage && message.errorMessage !== "jwt expired") {
      await swal(`${message.errorMessage}`, "", "error");
      return message.errorMessage;
    } else if (message.errorMessage === "jwt expired") {
      await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("currentUser");
      location.replace("/");
      return message;
    }
    return redirect("/cart");
  }
}

export async function loaderOrder() {
  const token = localStorage.getItem("token");
  if (!token) {
    await swal(
      `Bạn chưa đăng nhập`,
      "Vui lòng đăng nhập tiếp tục thanh toán",
      "error"
    );
    return redirect("/login");
  }
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/order`,
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
    location.replace("/");
    return data;
  } else {
    return data;
  }
}

export async function actionOrder({ request }) {
  const formData = await request.formData();
  const token = localStorage.getItem("token");
  if (!token) {
    await swal(
      `Bạn chưa đăng nhập`,
      "Vui lòng đăng nhập tiếp tục thanh toán",
      "error"
    );
    return redirect("/login");
  }

  const data = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  };

  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/addOrder`,
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
    await swal(`${message.errorMessage}`, "", "error");
    return redirect("/shop");
  } else if (message.errorMessage === "jwt expired") {
    await swal(`Phiên đăng nhập đã hết hạn`, "", "error");
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("currentUser");
    location.replace("/");
    return message;
  } else {
    await swal(`${message.message}`, "", "success");
    return redirect("/order");
  }
}

export async function loaderAllOrder() {
  const token = localStorage.getItem("token");
  if (!token) {
    await swal(
      `Bạn chưa đăng nhập`,
      "Vui lòng đăng nhập để xem giỏ hàng",
      "error"
    );
    return redirect("/login");
  }
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/allOrder`,
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
    location.replace("/");
    return data;
  } else {
    return data;
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
    location.replace("/");
    return data;
  } else {
    return data;
  }
}
