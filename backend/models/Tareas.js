import mongoose from "mongoose";

const tareaSchema = mongoose.Schema(
  {
    // aca va toda la estructura de la tabla usuario
    nombre: {
      type: String,
      required: true, // hace que este campo sea obligatorio
      trim: true, // te quita los espacios de adelante y de atras
    },
    descripcion: {
      type: String,
      trim: true,
      required: true, // hace que este campo sea obligatorio
    },
    estado: {
      type: Boolean, // si es true o false
      default: false, // por defecto no esta completa
    },
    fechaEntrega: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    prioridad: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    proyecto: {
      // el creador de esta tarea tiene que tener un proyecto asociado
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto", // el proyecto sale de la fila 41 del modelo proyecto
    },
  },
  {
    timestamps: true, // crea 2 columnas, una de creado y otra de actualizado
  }
);

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;
