import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function CartDrawer({ onClose }) {
    const { cart, cartLoading, updateQty, removeFromCart, clearCart } = useAuth();
    const navigate = useNavigate();

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart
        .reduce((s, i) => s + i.priceValue * i.qty, 0)
        .toFixed(2).replace(".", ",");

    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-md h-full bg-slate-900 border-l border-slate-800 flex flex-col" onClick={e => e.stopPropagation()}>

                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                    <div>
                        <h2 className="text-lg font-light tracking-wider text-slate-200">CISTELLA</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {cartLoading ? "Carregant..." :
                                totalItems === 0 ? "Cap producte afegit"
                                    : `${totalItems} ${totalItems === 1 ? "producte" : "productes"}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-slate-700 hover:border-emerald-500/40 hover:text-emerald-400 transition text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {cartLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-6 h-6 border border-emerald-500/40 border-t-emerald-400 rounded-full animate-spin"></div>
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                            <div className="w-16 h-16 border border-slate-700 flex items-center justify-center opacity-30">
                                <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.874-7.148a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                            </div>
                            <p className="text-slate-500 text-sm font-light">La cistella és buida.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item._id} className="flex gap-4 border border-slate-800 p-3 hover:border-slate-700 transition">
                                <div className="w-16 h-16 bg-slate-800 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs text-slate-500 text-center px-1 leading-tight">{item.name}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-sm font-light text-slate-200 truncate">{item.name}</h3>
                                        <button onClick={() => removeFromCart(item._id)} className="text-slate-600 hover:text-red-400 transition flex-shrink-0">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2">{item.categoria}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-slate-700">
                                            <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition flex items-center justify-center">−</button>
                                            <span className="w-8 text-center text-sm text-slate-300">{item.qty}</span>
                                            <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition flex items-center justify-center">+</button>
                                        </div>
                                        <p className="text-emerald-400 text-sm font-light">
                                            {(item.priceValue * item.qty).toFixed(2).replace(".", ",")} €
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t border-slate-800 px-6 py-5 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-light tracking-wider">TOTAL</span>
                            <span className="text-emerald-400 text-xl font-light">{totalPrice} €</span>
                        </div>
                        {parseFloat(totalPrice.replace(",", ".")) >= 50 && (
                            <p className="text-xs text-emerald-500/70 flex items-center gap-2">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block"></span>
                                Enviament gratuït aplicat
                            </p>
                        )}
                        <button
                            onClick={() => { onClose(); navigate("/checkout"); }}
                            className="w-full py-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 transition text-xs tracking-widest"
                        >
                            FINALITZAR COMANDA
                        </button>
                        <button onClick={clearCart} className="w-full py-2 text-xs text-slate-600 hover:text-slate-400 transition tracking-wider">
                            BUIDAR CISTELLA
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function App() {
    const { user, cart, token, logout } = useAuth();
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);

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
                        <Link to="/catalog" className="hover:text-emerald-400 transition">Catàleg</Link>
                        <Link to="/novedades" className="hover:text-emerald-400 transition">Novedades</Link>
                        <Link to="/contacto" className="hover:text-emerald-400 transition">Contacto</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-slate-400 hidden md:block">{user.nom}</span>
                                <button onClick={logout} className="text-slate-400 hover:text-red-400 transition text-sm">
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-400 hover:text-emerald-400 transition text-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition text-sm">
                                    Registro
                                </Link>
                            </>
                        )}

                        <button
                            onClick={() => token ? setCartOpen(true) : navigate("/login")}
                            className="relative text-slate-400 hover:text-emerald-400 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <Outlet />

            {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
        </div>
    );
}