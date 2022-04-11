import { useEffect, useState, createContext } from "react"; // aca estoy creando la funcion de context
import clienteAxios from "../config/clienteAxios";
const AuthContext = createContext(); // esta var va a tener al context

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({}); // cuando retornamos un usuario desde el back viene como un objeto
  // vamos a comprobar si existe el token
  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await clienteAxios("/usuarios/perfil", config);
        setAuth(data);
      } catch (error) {}
    };
    autenticarUsuario();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
