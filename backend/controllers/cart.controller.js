import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    //inside user there is (FK)user.product: only has ID. It takes id from Product model
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    //add quantity for each product, associating each cartItem with existing productId
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === productId
      );
      //returns a new object(bc map) combining the product data with updated quantity
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    //this uses protectRoute param in the route, which has decoded(db) req.user = user
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);

    //this happens when pressing the + in the frontend. If no item, put item in cart
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    //if no product, just empties cart anyway. If product exists, filter it out of cart
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id === productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in removeAllFromCart controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; //the route has /:id on it. We take from there
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      //if there is an item, but the quantity goes to zero, remove it
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id === productId);
        await user.save();
        return res.json(user.cartItems);
      }
      //just updates to the quantity sent from frontend
      existingItem.quantity = quantity;
      await user.save();
      return res.json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Product not found in the cart" });
    }
  } catch (error) {
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
