import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      {/* Navbar estilo taberna */}
      <nav className="p-4 bg-green-900 text-green-100 flex justify-between border-b border-green-700 shadow-md">
        <h1 className="text-xl font-bold">Tienda</h1>

        <div className="flex gap-4">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/login" className="hover:text-white transition">Login</Link>
          <Link to="/register" className="hover:text-white transition">Register</Link>
        </div>
      </nav>

      {/* Aquí se dibujan las páginas */}
      <Outlet />
    </div>
  );
}
