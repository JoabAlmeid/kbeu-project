import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    // 1. Check if token exists
    if (!accessToken) {
      return res.status(401).json({
        message: "Por favor, faça login primeiro",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // 3. Get user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado",
      });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Atualize a página e refaça seu login, por favor",
      });
    }

    return res.status(401).json({
      message: "Sem Permissão - Token inválido",
    });
  }
};

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Acesso negado - Apenas Admins",
    });
  }
};
