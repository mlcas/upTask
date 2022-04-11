import Proyecto from "../models/Proyecto.js";
import mongoose from "mongoose";
import Tarea from "../models/Tareas.js";

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find().where("creador").equals(req.usuario); // aca estamos filtrando por creador que sea igual a el usuario que esta autenticado

  res.json(proyectos);
};
const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error("PROYECTO NO EXISTE");
    return res.status(404).json({ msg: error.message });
  }

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("PROYECTO NO EXISTE");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("PROYECTO NO PERTENCECE");
    return res.status(401).json({ msg: error.message });
  }
  // Obtner las tares de un proyecto
  const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);
  res.json({
    proyecto,
    tareas,
  });
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;

  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error("PROYECTO NO EXISTE");
    return res.status(404).json({ msg: error.message });
  }

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("PROYECTO NO EXISTE");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("PROYECTO NO PERTENCECE");
    return res.status(401).json({ msg: error.message });
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre; // aca le asginamos al proyecto lo que viene del body o si no estamos actualizando el nombre dejamos el que ya estaba en la db
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  const valid = mongoose.Types.ObjectId.isValid(id);

  if (!valid) {
    const error = new Error("PROYECTO NO EXISTE");
    return res.status(404).json({ msg: error.message });
  }

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("PROYECTO NO EXISTE");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("PROYECTO NO PERTENCECE");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne(); // ponemos directamente el await porque no le asiganamos a un proyecto la eliminacion
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
  }
};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
};
