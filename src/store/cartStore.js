import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isDrawerOpen: false,
      addToCart: (productData, qty, sizeSelected, colorHex, colorName) => {
        const { cartItems } = get();
        let variantPrice = productData.price || 0;
        let variantStock = productData.countInStock || 0;
        
        if (productData.variants && productData.variants.length > 0) {
          const matchingVariant = productData.variants.find(
            (v) =>
              v.size?.toLowerCase() === sizeSelected?.toLowerCase() &&
              (v.color === colorHex || v.color === colorName)
          );
          
          if (matchingVariant) {
            variantPrice = matchingVariant.price || productData.price || 0;
            variantStock = matchingVariant.stock || productData.countInStock || 0;
          } else if (productData.variants.length > 0) {
            variantPrice = productData.variants[0].price || productData.price || 0;
            variantStock = productData.variants[0].stock || productData.countInStock || 0;
          }
        }

        const normalizedSize = sizeSelected ? String(sizeSelected).toLowerCase() : "";
        const normalizedColor = colorName || colorHex || "";

        const productId = productData._id || productData.id || "";
        
        const newItem = {
          product: productId,
          name: productData.name || productData.productDisplayName || "Product",
          qty: Number(qty) || 1,
          sizeSelected: normalizedSize,
          colorSelected: normalizedColor,
          size: productData.size,
          color: productData.colors,
          images: productData.images || [],
          price: variantPrice,
          sale: productData.sale || 0,
          priceSale: variantPrice * (1 - (productData.sale || 0) / 100),
          countInStock: variantStock,
          selected: true, // Default to selected
        };

        const existItemIndex = cartItems.findIndex(
          (item) =>
            String(item.product) === String(newItem.product) &&
            String(item.sizeSelected).toLowerCase() === String(newItem.sizeSelected).toLowerCase() &&
            String(item.colorSelected) === String(newItem.colorSelected)
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

        set({ cartItems: updatedCartItems });
        return updatedCartItems;
      },

      // Remove item from cart
      removeFromCart: (productId, sizeSelected, colorSelected) => {
        const { cartItems } = get();
        const updatedCartItems = cartItems.filter(
          (item) =>
            !(
              String(item.product) === String(productId) &&
              String(item.sizeSelected).toLowerCase() === String(sizeSelected).toLowerCase() &&
              String(item.colorSelected) === String(colorSelected)
            )
        );
        set({ cartItems: updatedCartItems });
        return updatedCartItems;
      },

      // Update item quantity
      updateItemQty: (productId, sizeSelected, colorSelected, qty) => {
        const { cartItems } = get();
        const updatedCartItems = cartItems.map((item) => {
          if (
            String(item.product) === String(productId) &&
            String(item.sizeSelected).toLowerCase() === String(sizeSelected).toLowerCase() &&
            String(item.colorSelected) === String(colorSelected)
          ) {
            return { ...item, qty: Number(qty) || 1 };
          }
          return item;
        });
        set({ cartItems: updatedCartItems });
        return updatedCartItems;
      },

      // Update cart item (remove old and add new with different size/color/qty)
      updateCartItem: (oldItem, newProductData, qty, sizeSelected, colorHex, colorName) => {
        const { cartItems, removeFromCart, addToCart } = get();
        
        // Remove old item
        removeFromCart(oldItem.product, oldItem.sizeSelected, oldItem.colorSelected);
        
        // Add new item
        return addToCart(newProductData, qty, sizeSelected, colorHex, colorName);
      },

      // Toggle item selection
      toggleItemSelection: (productId) => {
        const { cartItems } = get();
        const updatedCartItems = cartItems.map((item) =>
          String(item.product) === String(productId)
            ? { ...item, selected: !item.selected }
            : item
        );
        set({ cartItems: updatedCartItems });
      },

      // Select all items
      selectAllItems: (selected) => {
        const { cartItems } = get();
        const updatedCartItems = cartItems.map((item) => ({
          ...item,
          selected: selected,
        }));
        set({ cartItems: updatedCartItems });
      },

      // Open/close cart drawer
      setDrawerOpen: (isOpen) => {
        set({ isDrawerOpen: isOpen });
      },

      // Clear cart
      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);

export default useCartStore;

