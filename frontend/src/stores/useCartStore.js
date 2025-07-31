import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals(); //makes the total/subtotals always update cart state
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  addToCart: async (product) => {
    try {
      //it sends the product to server, and it's ID must match with the one on the db
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState) => {
        //check if there's an item in the front and in the db which are the same
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        //if we have it, +1 on quantity. If not, create new product on cart and +1
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals(); //makes the total/subtotals always update cart state
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get(); //this "gets" the current state of cart
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total }); //updates current state of cart
  },
}));
