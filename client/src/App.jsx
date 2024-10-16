import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "./component/HomePage/HomePage";
import ShopPage from "./component/ShopPage/ShopPage";
import DetailPage from "./component/DetailPage/DetailPage";
import CartPage from "./component/CartPage/CartPage";
import CheckoutPage from "./component/CheckoutPage/CheckoutPage";
import LoginPage from "./component/LoginPage/LoginPage";
import RegisterPage from "./component/RegisterPage/RegisterPage";
import Layout from "./component/Layout/Layout";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(fas, far);

import {
  actionAddCart,
  actionChangeCart,
  actionOrder,
  actionRegister,
  loaderAllOrder,
  loaderCart,
  loaderHomePage,
  loaderOrder,
  loaderOrderDetail,
  loaderProductDetail,
} from "./component/API";
import NotFound from "./component/NotFound/NotFound";
import Order from "./component/order/Order";
import DetailOrder from "./component/detailOrder/DetailOrder";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: loaderHomePage,
      },
      {
        path: "/shop",
        element: <ShopPage />,
        loader: loaderHomePage,
      },
      {
        path: "/detail/:productId",
        element: <DetailPage />,
        loader: loaderProductDetail,
        action: actionAddCart,
      },
      {
        path: "/cart",
        element: <CartPage />,
        loader: loaderCart,
        action: actionChangeCart,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
        loader: loaderOrder,
        action: actionOrder,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
        action: actionRegister,
      },
      {
        path: "/order",
        element: <Order />,
        loader: loaderAllOrder,
      },
      {
        path: "/order/:orderId",
        element: <DetailOrder />,
        loader: loaderOrderDetail,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
