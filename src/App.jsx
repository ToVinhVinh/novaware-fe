import React, { useRef, useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import LottieLoading from "./components/LottieLoading"; 
// Import Layout
import UserLayout from "./components/Layouts/UserLayout.jsx";
import AdminLayout from "./components/Layouts/AdminLayout.jsx";
// import user
const HomeScreen = React.lazy(() => import("./screens/user/HomeScreen"));
const ShopScreen = React.lazy(() => import("./screens/user/ShopScreen"));
const ProductScreen = React.lazy(() => import("./screens/user/ProductScreen"));
const CartScreen = React.lazy(() => import("./screens/user/CartScreen"));
const ProfileScreen = React.lazy(() => import("./screens/user/ProfileScreen"));
const ShippingScreen = React.lazy(() => import("./screens/user/ShippingScreen"));
const PaymentScreen = React.lazy(() => import("./screens/user/PaymentScreen"));
const PlaceOrderScreen = React.lazy(() => import("./screens/user/PlaceOrderScreen"));
const OrderScreen = React.lazy(() => import("./screens/user/OrderScreen"));
const AboutUs = React.lazy(() => import("./screens/user/AboutUs"));
// import admin
const AdminOrderScreen = React.lazy(() => import("./screens/admin/AdminOrderScreen"));
const BrandListScreen = React.lazy(() => import("./screens/admin/BrandListScreen"));
const CategoryListScreen = React.lazy(() => import("./screens/admin/CategoryListScreen"));
const OrderListScreen = React.lazy(() => import("./screens/admin/OrderListScreen"));
const ProductCreateScreen = React.lazy(() => import("./screens/admin/ProductCreateScreen"));
const ProductEditScreen = React.lazy(() => import("./screens/admin/ProductEditScreen"));
const ProductListScreen = React.lazy(() => import("./screens/admin/ProductListScreen"));
const UserListScreen = React.lazy(() => import("./screens/admin/UserListScreen"));
const StatisticsScreen = React.lazy(() => import("./screens/admin/StatisticsScreen"));
const AdminChatScreen = React.lazy(() => import("./screens/admin/AdminChatScreen"));
const HomeContentEditScreen = React.lazy(() => import("./screens/admin/HomeContentEditScreen"));
// import 404
const NotFoundScreen = React.lazy(() => import("./screens/NotFoundScreen"));

const App = () => {
  const setHasNewMessageRef = useRef(null);
  const hasNewMessageRef = useRef(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (hasNewMessageRef.current) {
      setHasNewMessage(true);
      hasNewMessageRef.current = false;
    }
  }, [hasNewMessageRef]);

  useEffect(() => {
    if (hasNewMessage) {
      setHasNewMessage(false);
    }
  }, [hasNewMessage]);

  return (
    <Router>
      <Suspense fallback={<LottieLoading />}>
        {/* Admin Routes */}
        {userInfo && userInfo.isAdmin && (
          <Switch>
            <Route path="/admin">
              <AdminLayout>
                <Switch>
                  <Route path="/admin/orderlist" component={OrderListScreen} />
                  <Route path="/admin/product/create" component={ProductCreateScreen} />
                  <Route path="/admin/product/:id" component={ProductEditScreen} />
                  <Route path="/admin/productlist" component={ProductListScreen} />
                  <Route path="/admin/categorylist" component={CategoryListScreen} />
                  <Route path="/admin/home-content" component={HomeContentEditScreen} />
                  <Route path="/admin/order/:id" component={AdminOrderScreen} />
                  <Route path="/admin/brandlist" component={BrandListScreen} />
                  <Route path="/admin/userlist" component={UserListScreen} />
                  <Route path="/admin/orderstats" component={StatisticsScreen} exact />
                  <Route
                    path="/admin/chat"
                    render={(props) => (
                      <AdminChatScreen {...props} setHasNewMessageRef={hasNewMessageRef} />
                    )}
                  />
                  <Redirect to="/admin/orderstats" />
                </Switch>
              </AdminLayout>
            </Route>
            <Route render={() => <Redirect to="/admin/orderstats" />} />
          </Switch>
        )}

        {/* User Routes */}
        {!userInfo?.isAdmin && (
          <Route>
            <UserLayout setHasNewMessageRef={setHasNewMessageRef}>
              <Switch>
                <Route path="/shop" component={ShopScreen} />
                <Route path="/about-us" component={AboutUs} />
                <Route path="/product/:id" component={ProductScreen} />
                <Route path="/cart/:id?" component={CartScreen} />
                <Route path="/profile" component={ProfileScreen} />
                <Route path="/shipping" component={ShippingScreen} />
                <Route path="/payment" component={PaymentScreen} />
                <Route path="/placeorder" component={PlaceOrderScreen} />
                <Route path="/order/:id" component={OrderScreen} /> 
                <Route path="/search" component={HomeScreen} exact />
                <Route path="/" component={HomeScreen} exact />
                <Route component={NotFoundScreen} />
              </Switch>
            </UserLayout>
          </Route>
        )}
      </Suspense>
    </Router>
  );
};

export default App;

