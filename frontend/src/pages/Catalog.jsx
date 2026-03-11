import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, apiGet } from "../context/AuthContext";

export default function Catalog() {
    const { token, cart, addToCart } = useAuth();
    const navigate = useNavigate();

    const [games, setGames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState("");
    const [selectedCat, setSelectedCat] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);
    const LIMIT = 9;

    const fetchGames = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: LIMIT });
            if (search) params.set("search", search);
            if (selectedCat) params.set("categoria", selectedCat);
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);

            const data = await apiGet(`/products?${params}`);
            if (data.status === "success") {
                setGames(data.data);
                setTotal(data.total);

                if (!selectedCat && !search && !minPrice && !maxPrice) {
                    const unique = [...new Set(data.data.map(g => g.categoria).filter(Boolean))];
                    setCategories(prev => [...new Set([...prev, ...unique])]);
                }
            }
        } finally {
            setLoading(false);
        }
    }, [search, selectedCat, minPrice, maxPrice, page]);

    useEffect(() => { fetchGames(); }, [fetchGames]);

    const handleAddToCart = async (game) => {
        const ok = await addToCart(game);
        if (!ok) navigate("/login");
    };

    const handleFilter = (e) => {
        e.preventDefault();
        setPage(1);
        fetchGames();
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedCat("");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);
    };

    const totalPages = Math.ceil(total / LIMIT);
    const hasFilters = search || selectedCat || minPrice || maxPrice;

    return (
        <div className="min-h-screen text-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Capçalera */}
                <div className="mb-12">
                    <h1 className="text-5xl font-light mb-3">Catàleg</h1>
                    <p className="text-slate-400 font-light">
                        {total} {total === 1 ? "producte" : "productes"} disponibles
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Panell de filtres */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <form onSubmit={handleFilter} className="space-y-6">

                            {/* Cerca */}
                            <div>
                                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Cerca</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Nom del joc..."
                                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none placeholder-slate-600 pr-8"
                                    />
                                    {search && (
                                        <button type="button" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Categoria */}
                            <div>
                                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Categoria</label>
                                <div className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedCat(""); setPage(1); }}
                                        className={`w-full text-left px-3 py-2 text-sm transition ${!selectedCat ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "text-slate-400 hover:text-slate-200 border border-transparent"}`}
                                    >
                                        Totes
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => { setSelectedCat(cat); setPage(1); }}
                                            className={`w-full text-left px-3 py-2 text-sm transition ${selectedCat === cat ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "text-slate-400 hover:text-slate-200 border border-transparent"}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rang de preu */}
                            <div>
                                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Preu (€)</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                        placeholder="Min"
                                        min="0"
                                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none placeholder-slate-600"
                                    />
                                    <span className="text-slate-600 text-xs">—</span>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                        placeholder="Max"
                                        min="0"
                                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none placeholder-slate-600"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition text-sm tracking-wider"
                            >
                                APLICAR
                            </button>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition tracking-wider"
                                >
                                    NETEJAR FILTRES
                                </button>
                            )}
                        </form>
                    </aside>

                    {/* Grid de productes */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(LIMIT)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-64 bg-slate-900 border border-slate-800 mb-3"></div>
                                        <div className="h-4 bg-slate-800 rounded w-2/3 mb-2"></div>
                                        <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : games.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="w-16 h-16 border border-slate-700 flex items-center justify-center mb-6 opacity-30">
                                    <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-slate-400 font-light text-lg mb-2">No s'han trobat productes</p>
                                {hasFilters && (
                                    <button onClick={clearFilters} className="text-emerald-400 text-sm hover:text-emerald-300 transition mt-2">
                                        Netejar filtres
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                                    {games.map(game => {
                                        const inCart = cart.find(i => i._id === game._id);
                                        return (
                                            <div key={game._id} className="group">
                                                <div
                                                    className="relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 mb-3 cursor-pointer"
                                                    onClick={() => navigate(`/product/${game._id}`)}
                                                >
                                                    {game.img ? (
                                                        <img src={game.img} alt={game.titol} className="h-64 w-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
                                                    ) : (
                                                        <div className="h-64 w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                                                            <div className="text-center px-4">
                                                                <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rotate-45 mx-auto mb-3"></div>
                                                                <p className="text-slate-400 font-light">{game.titol}</p>
                                                                <p className="text-slate-600 text-xs mt-1">{game.categoria}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {inCart && (
                                                        <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-xs font-semibold px-2 py-0.5">
                                                            {inCart.qty} a la cistella
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleAddToCart(game); }}
                                                        className="absolute top-3 right-3 w-10 h-10 bg-slate-950/80 backdrop-blur border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/70 flex items-center justify-center transition-all"
                                                    >
                                                        {inCart ? (
                                                            <span className="text-emerald-400 text-xs font-semibold">{inCart.qty}</span>
                                                        ) : (
                                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-start">
                                                    <div
                                                        className="cursor-pointer hover:text-emerald-400 transition"
                                                        onClick={() => navigate(`/product/${game._id}`)}
                                                    >
                                                        <h3 className="text-base font-light text-slate-200 mb-0.5">{game.titol}</h3>
                                                        <p className="text-xs text-slate-500">{game.categoria}</p>
                                                    </div>
                                                    <p className="text-emerald-400 font-light text-sm flex-shrink-0 ml-2">
                                                        {game.preu.toFixed(2).replace(".", ",")} €
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Paginació */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 border border-slate-800 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400 transition text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            ← Anterior
                                        </button>
                                        <span className="text-slate-500 text-sm px-4">
                                            {page} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="px-4 py-2 border border-slate-800 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400 transition text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            Següent →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
