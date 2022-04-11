//const express = require("express");
import express from "express";
import dotenv from "dotenv";
import conectarDb from "./config/db.js";
import cors from "cors";
import usuariosRouter from "./routes/usuariosRoutes.js";
import proyectosRouter from "./routes/proyectoRoutes.js";
import tareaRouter from "./routes/tareasRotes.js";

const app = express();
app.use(express.json()); // es para leer los datos del body

dotenv.config();

conectarDb();

// COnfigurar el Cors
const whiteList = [process.env.FRONTEND_URL];

const corsOption = {
  origin: function (origin, callback) {
    console.log(origin);
    if (whiteList.includes(origin)) {
      // Puede consulta la api
      callback(null, true);
    } else {
      callback(new Error("Error de Cors"));
    }
  },
};
app.use(cors(corsOption));

// Routing
app.use("/api/usuarios", usuariosRouter);
app.use("/api/proyectos", proyectosRouter);
app.use("/api/tareas", tareaRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
