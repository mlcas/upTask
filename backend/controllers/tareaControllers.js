import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tareas.js";
import mongoose from "mongoose";
const agregarTarea = async (req, res) => {
  // Primero tenemos que comprobar que el proyecto al que le asignamos tareas exista
  const { proyecto } = req.body; // aca extramos la propiedad proyecto que viene desde el body que en este caso es el ID

  const existeProyecto = await Proyecto.findById(proyecto); // aca traemos el proyecto que tiene ese id

  if (!existeProyecto) {
    // si la persona no tiene el token correcto no puede crear esta tarea
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }
  // aca comprobamos que el creador del proyecto no sea distinto al que genera la tarea para ese proyecto
  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("NO tienes los permisos para anadir tareas");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto"); // .populate te cruza la info de la tarea con el proyecto al que se asigno la tarea

  if (!tarea) {
    // si la persona no tiene el token correcto no puede crear esta tarea
    const error = new Error("La tarea no existe");
    return res.status(404).json({ msg: error.message });
  }
  // aca si tratamos de ver una tarea que no hemos creado no tira el error
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  res.json(tarea);
  //console.log(tarea); te trae la tarea y el proyecto en un mismo objeto
};

const actualizarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto"); // .populate te cruza la info de la tarea con el proyecto al que se asigno la tarea

  if (!tarea) {
    // si la persona no tiene el token correcto no puede crear esta tarea
    const error = new Error("La tarea no existe");
    return res.status(404).json({ msg: error.message });
  }
  // aca si tratamos de ver una tarea que no hemos creado no tira el error
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.nombre = req.body.nombre || tarea.nombre; // aca le asginamos a la tarea lo que viene del body o si no estamos actualizando el nombre dejamos el que ya estaba en la db
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

  try {
    const almacenarTarea = await tarea.save();
    res.json(almacenarTarea);
  } catch (error) {
    console.log(error);
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("TAREA NO EXISTE");
    return res.status(404).json({ msg: error.message });
  }
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  try {
    await tarea.deleteOne(); // ponemos directamente el await porque no le asiganamos a un proyecto la eliminacion
    res.json({ msg: "Tarea eliminado" });
  } catch (error) {
    console.log(error);
  }
};

const cambiarEstado = async (req, res) => {};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
