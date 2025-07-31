import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

//creates global state
export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  //productData is a json that comes from the admin
  createProduct: async (productData) => {
    set({ loading: true });

    try {
      //sends request (productData) to server at /products. Comes from admin
      const res = await axios.post("/products", productData);
      //updates the previous state of the array products above. Pushes the new data
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);

      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);

      // this will update the isFeatured prop of the product
      //bring all the products already in the 'products' json
      // if their id is the some one as the product in the db, then change it
      //or else, just leave it like that

      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
      console.log("Mudado 2");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
}));
