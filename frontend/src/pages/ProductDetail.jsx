import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, apiGet } from "../context/AuthContext";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cart, addToCart, token } = useAuth();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            setLoading(true);
            try {
                const data = await apiGet(`/products/${id}`);
                if (data.status === "success") {
                    setGame(data.data);
                } else {
                    setError("Producte no trobat");
                }
            } catch {
                setError("Error carregant el producte");
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id]);

    const handleAddToCart = async () => {
        const ok = await addToCart(game);
        if (!ok) navigate("/login");
    };

    const inCart = game && cart.find(i => i._id === game._id);

    if (loading) {
        return (
            <div className="min-h-screen text-slate-100">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="animate-pulse">
                        <div className="h-4 bg-slate-800 rounded w-32 mb-12"></div>
                        <div className="grid md:grid-cols-2 gap-16">
                            <div className="h-96 bg-slate-900 border border-slate-800"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-slate-800 rounded w-2/3"></div>
                                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                                <div className="h-6 bg-slate-800 rounded w-1/3 mt-6"></div>
                                <div className="h-24 bg-slate-800 rounded mt-4"></div>
                                <div className="h-12 bg-slate-800 rounded mt-6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 text-lg mb-4">{error || "Producte no trobat"}</p>
                    <button
                        onClick={() => navigate("/catalog")}
                        className="text-emerald-400 hover:text-emerald-300 transition text-sm"
                    >
                        ← Tornar al catàleg
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Breadcrumb */}
                <button
                    onClick={() => navigate("/catalog")}
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition text-sm mb-12"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Catàleg
                </button>

                <div className="grid md:grid-cols-2 gap-16">

                    {/* Imatge */}
                    <div className="bg-slate-900 border border-slate-800">
                        {game.img ? (
                            <img
                                src={game.img}
                                alt={game.titol}
                                className="w-full h-96 object-cover opacity-80"
                            />
                        ) : (
                            <div className="h-96 flex items-center justify-center">
                                <div className="text-center px-8">
                                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rotate-45 mx-auto mb-4"></div>
                                    <p className="text-slate-400 font-light text-xl">{game.titol}</p>
                                    <p className="text-slate-600 text-sm mt-2">{game.categoria}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Detalls */}
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <span className="text-xs text-slate-500 uppercase tracking-widest">{game.categoria}</span>
                        </div>
                        <h1 className="text-4xl font-light text-slate-100 mb-6">{game.titol}</h1>

                        <div className="flex items-baseline gap-3 mb-8">
                            <span className="text-3xl font-light text-emerald-400">
                                {game.preu.toFixed(2).replace(".", ",")} €
                            </span>
                            {game.stock > 0 ? (
                                <span className="text-xs text-emerald-500/70 tracking-wider">
                                    {game.stock} en stock
                                </span>
                            ) : (
                                <span className="text-xs text-red-400/70 tracking-wider">Sense stock</span>
                            )}
                        </div>

                        {game.descripcio && (
                            <p className="text-slate-400 font-light leading-relaxed mb-8">
                                {game.descripcio}
                            </p>
                        )}

                        <div className="mt-auto space-y-3">
                            {game.stock > 0 ? (
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 transition text-sm tracking-widest flex items-center justify-center gap-3"
                                >
                                    {inCart ? (
                                        <>
                                            <span className="w-5 h-5 bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center rounded-full">{inCart.qty}</span>
                                            AFEGIR UN MÉS
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            AFEGIR A LA CISTELLA
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button disabled className="w-full py-4 border border-slate-800 text-slate-600 text-sm tracking-widest cursor-not-allowed">
                                    SENSE STOCK
                                </button>
                            )}

                            {!token && (
                                <p className="text-xs text-slate-600 text-center">
                                    Cal{" "}
                                    <button onClick={() => navigate("/login")} className="text-emerald-500/70 hover:text-emerald-400 transition">
                                        iniciar sessió
                                    </button>
                                    {" "}per afegir a la cistella
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
