import { Provider } from "react-redux";
import "./App.css";
import Login from "./login/Login";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { store } from "./redux/Redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout";
import PageNotFound from "./pageNotFound/PageNotFound";
import {
  actionAddProduct,
  actionDeleteProduct,
  loaderChat,
  loaderOrderDetail,
  loaderProduct,
  loaderTransaction,
} from "./router/Router";
import Home from "./home/homePage/Home";
import User from "./home/user/User";
import Product from "./home/product/Product";
import Support from "./home/support/Support";
import DetailOrder from "./home/detailOrder/DetailOrder";
import NewProduct from "./home/newProduct/NewProduct";
import Chat from "./home/support/Chat";

library.add(fas);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: loaderTransaction,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/product",
        element: <Product />,
        loader: loaderProduct,
        action: actionDeleteProduct,
      },
      {
        path: "/support",
        element: <Support />,
        loader: loaderChat,
        children: [
          {
            path: "/support/:userId",
            element: <Chat />,
            loader: loaderChat,
          },
        ],
      },
      {
        path: "/order/:orderId",
        element: <DetailOrder />,
        loader: loaderOrderDetail,
      },
      {
        path: "/newProduct",
        element: <NewProduct />,
        action: actionAddProduct,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
