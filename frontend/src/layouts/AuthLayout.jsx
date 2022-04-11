// Este archivo es del area publica que va a tener los form para registrarse
// Iniciar sesion, olvide mi password
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
        {/* Aca le damos el tamano que van a ocupar todos los elementos del Outler eje login, regstro */}
        <div className="md:w-2/3 lg:w-1/2 ">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
