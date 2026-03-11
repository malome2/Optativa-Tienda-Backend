import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, apiGet } from "../context/AuthContext";

export default function Home() {
    const { token, cart, addToCart } = useAuth();
    const navigate = useNavigate();

    const [games, setGames] = useState([]);
    const [loadingGames, setLoadingGames] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            setLoadingGames(true);
            try {
                const data = await apiGet("/products?limit=6");
                if (data.status === "success") setGames(data.data);
            } catch {
                console.error("Error carregant jocs");
            } finally {
                setLoadingGames(false);
            }
        };
        fetchGames();
    }, []);

    const handleAddToCart = async (game) => {
        const ok = await addToCart(game);
        if (!ok) navigate("/login");
    };

    return (
        <div className="text-slate-100">

            {/* ── Hero ── */}
            <section className="max-w-7xl mx-auto px-6 py-32">
                <div className="max-w-2xl">
                    <h1 className="text-6xl md:text-7xl font-light mb-6 leading-tight">
                        Tu próxima
                        <span className="block text-emerald-400">campaña</span>
                        comienza aquí
                    </h1>
                    <p className="text-slate-400 text-lg mb-8 font-light">
                        Juegos de estrategia y rol para crear historias inolvidables
                    </p>
                    <button
                        onClick={() => navigate("/catalog")}
                        className="group relative px-8 py-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 transition group-hover:bg-emerald-500/20"></div>
                        <span className="relative text-emerald-400 text-sm tracking-wider">EXPLORAR COLECCIÓN</span>
                    </button>
                </div>
            </section>

            {/* ── Productes ── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-light text-slate-300">Colección destacada</h2>
                    <button
                        onClick={() => navigate("/catalog")}
                        className="px-6 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition text-sm tracking-wider"
                    >
                        VER CATÁLOGO COMPLETO
                    </button>
                </div>

                {loadingGames ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-80 bg-slate-900 border border-slate-800 mb-4"></div>
                                <div className="h-4 bg-slate-800 rounded w-2/3 mb-2"></div>
                                <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                ) : games.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-lg font-light mb-2">No hi ha jocs al catàleg encara.</p>
                        <p className="text-sm">Afegeix-ne via l'API per veure'ls aquí.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {games.map((game) => {
                            const inCart = cart.find(item => item._id === game._id);
                            return (
                                <div key={game._id} className="group cursor-pointer">
                                    <div className="relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 mb-4">
                                        {game.img ? (
                                            <img
                                                src={game.img}
                                                alt={game.titol}
                                                className="h-80 w-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                                            />
                                        ) : (
                                            <div className="h-80 w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                                                <div className="text-center px-6">
                                                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rotate-45 mx-auto mb-4"></div>
                                                    <p className="text-slate-400 font-light text-lg">{game.titol}</p>
                                                    <p className="text-slate-600 text-sm mt-1">{game.categoria}</p>
                                                </div>
                                            </div>
                                        )}

                                        {inCart && (
                                            <div className="absolute top-4 left-4 bg-emerald-500 text-slate-950 text-xs font-semibold px-2 py-1">
                                                {inCart.qty} a la cistella
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleAddToCart(game)}
                                            className="absolute top-4 right-4 w-12 h-12 bg-slate-950/80 backdrop-blur border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/70 flex items-center justify-center transition-all duration-200"
                                        >
                                            {inCart ? (
                                                <span className="text-emerald-400 text-xs font-semibold">{inCart.qty}</span>
                                            ) : (
                                                <svg className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            )}
                                        </button>

                                        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 border-t border-emerald-500/20 py-2.5 px-4 flex items-center justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <span className="text-xs text-slate-400 tracking-wider">
                                                {token ? "AFEGIR A LA CISTELLA" : "ENTRA PER AFEGIR"}
                                            </span>
                                            <button
                                                onClick={e => { e.stopPropagation(); handleAddToCart(game); }}
                                                className="w-7 h-7 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-light text-slate-200 mb-1">{game.titol}</h3>
                                            <p className="text-sm text-slate-500">{game.categoria}</p>
                                        </div>
                                        <p className="text-emerald-400 font-light">
                                            {game.preu.toFixed(2).replace(".", ",")} €
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ── About ── */}
            <section className="max-w-7xl mx-auto px-6 py-32">
                <div className="max-w-2xl">
                    <h2 className="text-4xl font-light mb-6 leading-tight">
                        Encuentra tu próxima
                        <span className="block text-emerald-400">aventura épica</span>
                    </h2>
                    <p className="text-slate-400 mb-6 font-light leading-relaxed">
                        Seleccionamos cuidadosamente cada juego de nuestro catálogo. Desde clásicos imperecederos
                        hasta las últimas novedades del mundo del rol y la estrategia. Envíos rápidos y seguros
                        para que empieces a jugar cuanto antes.
                    </p>
                    <div className="flex flex-col gap-3 mb-8">
                        {["Envío gratuito en pedidos +50€", "Catálogo actualizado cada semana", "Atención personalizada y recomendaciones"].map(text => (
                            <div key={text} className="flex items-center gap-3 text-slate-300">
                                <div className="w-1 h-1 bg-emerald-400"></div>
                                <span className="text-sm">{text}</span>
                            </div>
                        ))}
                    </div>
                    <button className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition text-sm tracking-wider">
                        EXPLORAR TODO
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-900 mt-20">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-emerald-500/20 border border-emerald-500/40 rotate-45"></div>
                            <span className="text-sm font-light tracking-wider text-slate-600">LA INICIATIVA</span>
                        </div>
                        <p className="text-slate-600 text-sm">© 2024 — Tu tienda de referencia en juegos de mesa</p>
                        <div className="flex gap-6 text-slate-600 text-sm">
                            <a href="#" className="hover:text-emerald-400 transition">Instagram</a>
                            <a href="#" className="hover:text-emerald-400 transition">Discord</a>
                            <a href="#" className="hover:text-emerald-400 transition">Newsletter</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}