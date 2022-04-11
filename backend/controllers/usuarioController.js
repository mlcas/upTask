import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const registrar = async (req, res) => {
  // Evitar registros duplicados
  const { email } = req.body; // extramos lo que viene del body
  const existeUsuario = await Usuario.findOne({ email }); // findOne va a buscar el primero que coincida con el {email} y se va a fijar si ya existe

  if (existeUsuario) {
    // si existe el usuario te devulve el message
    const error = new Error("Usuario ya resgistrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    const usuario = new Usuario(req.body); // esto crea un objeto con la info del modelo
    usuario.token = generarId();
    // Las 3 lineas comentadas era como lo hizo antes, pero ahora quiere devolver un msg y usar ese msg en el Front para dar una alerta
    // const usuarioAlmacenado = await usuario.save(); // .save te permite tener un objeto nuevo, modificarlo y almacenarlo
    // le ponemos await x q esperamos que finalice de insertar el registro y cuando ya lo inserta retornamos  el usuario almacenado
    //res.json(usuarioAlmacenado);
    await usuario.save();

    // Enviar el email de confirmacion
    emailRegistro({
      // ejecutamos la funcion y le mandamos estos parametros
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    res.json({
      msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu Cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email: email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar su password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token }); // aca comprueba si el token de la db coincide con el de la url
  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.confirmado = true; // aca si pone bien el token lo pasamos de false a true
    usuarioConfirmar.token = ""; // una vez que uso el token el mismo se debe eliminar, ya que es un token por confirmacion para
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario Confirmado Correctamente" });
    //console.log(usuarioConfirmar);
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email: email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // si el usuario existe
  try {
    usuario.token = generarId(); // le generamos de nuevo un token ya que en la etapa de confirmar se lo habiamos borrado
    await usuario.save(); // lo guardamos en la db

    // Enviar el email
    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }
};
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    usuario.password = password; // entramos a la propiedad password y le asigamos lo que el usuario le manda desde el form
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;

  res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
