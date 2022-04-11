import express from "express";
const router = express.Router();
import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

// Creacion, registro y confirmacion de usuarios
router.post("/", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePassword);
// cuando tenes distinto metodos de http que apuntan a la misma ruta lo podes definir asi
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword); // la ruta por get te devulve el form para resetear el password

// ruta que tiene el middleware
router.get("/perfil", checkAuth, perfil);
export default router;
