import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_OPEN_DRAWER_PREVIEW,
} from "../constants/cartConstants";

// Thêm sản phẩm vào giỏ hàng
export const addToCart =
  (id, qty, sizeSelected, colorHex, colorName) =>
  async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`);

    // const newItem = {
    //   product: data._id,
    //   name: data.name,
    //   qty,
    //   sizeSelected: sizeSelected.toLowerCase(), // ✅ normalize
    //   colorSelected: colorName,
    //   size: data.size,
    //   color: data.colors,
    //   images: data.images,
    //   price: data.price,
    //   sale: data.sale,
    //   priceSale: data.price * (1 - data.sale / 100),
    //   countInStock: data.countInStock,
    // };

    const newItem = {
      product: data._id,
      name: data.name,
      qty,
      sizeSelected: sizeSelected.toLowerCase(), // ✅ normalize
      colorSelected: colorName,
      size: data.size,
      color: data.colors,
      images: data.images,
      price: data.price,
      sale: data.sale,
      priceSale: data.price * (1 - data.sale / 100),
      countInStock: data.countInStock,
    };

    const {
      cart: { cartItems },
    } = getState();

    const existItemIndex = cartItems.findIndex(
      (item) =>
        item.product === newItem.product &&
        item.sizeSelected === newItem.sizeSelected &&
        item.colorSelected === newItem.colorSelected
    );

    let updatedCartItems;

    if (existItemIndex !== -1) {
      updatedCartItems = [...cartItems];
      updatedCartItems[existItemIndex] = {
        ...updatedCartItems[existItemIndex],
        qty: updatedCartItems[existItemIndex].qty + newItem.qty,
      };
    } else {
      updatedCartItems = [...cartItems, newItem];
    }

    dispatch({
      type: CART_ADD_ITEM,
      payload: updatedCartItems,
    });

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart =
  (id, sizeSelected, colorSelected) => (dispatch, getState) => {
    const {
      cart: { cartItems },
    } = getState();

    const updatedCartItems = cartItems.filter(
      (item) =>
        !(
          item.product === id &&
          item.sizeSelected === sizeSelected &&
          item.colorSelected === colorSelected
        )
    );

    dispatch({
      type: CART_REMOVE_ITEM,
      payload: updatedCartItems,
    });

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

// Lưu địa chỉ giao hàng
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

// Lưu phương thức thanh toán
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

// Mở hoặc đóng cửa sổ xem trước giỏ hàng
export const setOpenCartDrawer = (isOpen) => {
  return { type: CART_OPEN_DRAWER_PREVIEW, payload: isOpen };
};

// Cập nhật các sản phẩm được chọn
export const setSelectedCartItems = (selectedKeys) => (dispatch) => {
  dispatch({
    type: "SET_SELECTED_CART_ITEMS",
    payload: selectedKeys, // mảng các key định danh "productId-size-color"
  });
};
