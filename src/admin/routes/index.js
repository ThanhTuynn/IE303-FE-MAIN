import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import Dashboard from "../pages/DashboardPage/DashboardPage";
import Chatting from "../pages/ChattingPage/ChattingPage";
import OrderProduct from "../pages/OrderProductPage/OrderProductPage";
import FoodManagement from "../pages/FoodManagementPage/FoodManagementPage";
import PromotionManagement from "../pages/PromotionManagementPage/PromotionManagementPage";
import StoreInfo from "../pages/StoreInfoPage/StoreInfoPage";
import AccountInfo from "../pages/AccountInfoPage/AccountInfoPage";

const routes = [
  {
    path: "/admin",
    page: Dashboard,
    isShowHeader: true,
  },
  {
    path: "/admin/chatting",
    page: Chatting,
    isShowHeader: true,
  },
  {
    path: "/admin/list-order-product",
    page: OrderProduct,
    isShowHeader: true,
  },
  {
    path: "/admin/food-management",
    page: FoodManagement,
    isShowHeader: true,
  },
  {
    path: "/admin/promotion-management",
    page: PromotionManagement,
    isShowHeader: true,
  },
  {
    path: "/admin/store-info",
    page: StoreInfo,
    isShowHeader: true,
  },
  {
    path: "/admin/account-info",
    page: AccountInfo,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];

export default routes;
