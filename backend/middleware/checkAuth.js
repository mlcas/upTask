import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // aca estamos leyendo el token y verificandolo
      req.usuario = await Usuario.findById(decoded.id).select(
        // el select y poniendo el - te permite que no traigas esa info de la db
        "-password -confirmado -token -createdAt -updatedAt"
      );

      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Hubo un error" });
    }
  }
  if (!token) {
    const error = new Error("Token no valido");
    return res.status(401).json({ msg: error.message });
  }
  next();
};

export default checkAuth;
