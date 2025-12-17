import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      
      <nav className="border-b border-emerald-900/30 bg-slate-950/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/40 rotate-45"></div>
            <span className="text-xl font-light tracking-wider text-emerald-400">LA INICIATIVA</span>
          </Link>
          
          <div className="hidden md:flex gap-8 text-sm text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition">Inicio</Link>
            <Link to="/catalogo" className="hover:text-emerald-400 transition">Catálogo</Link>
            <Link to="/novedades" className="hover:text-emerald-400 transition">Novedades</Link>
            <Link to="/contacto" className="hover:text-emerald-400 transition">Contacto</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-slate-400 hover:text-emerald-400 transition text-sm"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition text-sm"
            >
              Registro
            </Link>
            <button className="text-slate-400 hover:text-emerald-400 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      
      <Outlet />
    </div>
  );
}