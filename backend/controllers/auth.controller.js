import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

//in the parameter of set: bring the value to attention, call the actual value, calls experition date funcion, sets the seconds
//then the value itself
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 * 1000 //seven days
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  //creates cookie. First shows where it will be set and then what will be set
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevents XXS attacks, cross-site-scripting
    secure: process.env.NODE_ENV === "production", //only in prod these preventions occur
    sameSite: "strict", //prevents CSRF attacks, cross-site-request-forgery
    maxAge: 30 * 60 * 1000, //thirty minutes
  });

  //first parameter is the name of the token that is stored in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevents XXS attacks, cross-site-scripting
    secure: process.env.NODE_ENV === "production", //only in prod these preventions occur
    sameSite: "strict", //prevents CSRF attacks, cross-site-request-forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, //seven days
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    //authentication with JWT API and Redis database
    //we use _id because that's how mongodb stores it
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    //201 means "something was created"
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //brings user from mongodb
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Email ou Senha inválidos" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      //decrypts the token from database using the key from .env
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//this will refresh the access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    //check if token is still valid
    if (storedToken !== refreshToken) {
      res.status(401).json({ message: "No refresh token provided" });
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true, //prevents XXS attacks, cross-site-scripting
      secure: process.env.NODE_ENV === "production", //only in prod these preventions occur
      sameSite: "strict", //prevents CSRF attacks, cross-site-request-forgery
      maxAge: 15 * 60 * 1000, //fifteen minutes
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
