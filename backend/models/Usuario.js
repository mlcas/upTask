import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Schema : es la estructura de una db

const usuarioSchema = mongoose.Schema(
  {
    // aca va toda la estructura de la tabla usuario
    nombre: {
      type: String,
      required: true, // hace que este campo sea obligatorio
      trim: true, // te quita los espacios de adelante y de atras
    },
    password: {
      type: String,
      required: true, // hace que este campo sea obligatorio
      trim: true,
    },
    email: {
      type: String,
      required: true, // hace que este campo sea obligatorio
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false, // una vez que se cree el usuario por defecto es false
    },
  },
  {
    timestamps: true, // crea 2 columnas, una de creado y otra de actualizado
  }
);

// middleware para hashear la contrasena
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // si no esta modificando el password al por ej cuando esta cambiando datos de su perfil, que siga
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparar la contraseña
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
