import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, apiPost } from "../context/AuthContext";

export default function Checkout() {
    const { cart, token, clearCart } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        pais: "",
        carrer: "",
        pis: "",
        codiPostal: "",
        metode: "targeta"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const total = cart.reduce((s, i) => s + i.priceValue * i.qty, 0);
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const data = await apiPost("/pedidos/checkout", form, token);
            if (data.status === "success") {
                clearCart();
                navigate("/checkout/success", { state: { pedido: data.data } });
            } else {
                setError(data.message || "Error en finalitzar la comanda");
            }
        } catch {
            setError("Error de connexió");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        navigate("/login");
        return null;
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 text-lg mb-4">La cistella és buida</p>
                    <button
                        onClick={() => navigate("/catalog")}
                        className="text-emerald-400 hover:text-emerald-300 transition text-sm"
                    >
                        ← Anar al catàleg
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-slate-100">
            <div className="max-w-5xl mx-auto px-6 py-16">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition text-sm mb-12"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Tornar
                </button>

                <h1 className="text-4xl font-light mb-12">Finalitzar comanda</h1>

                <div className="grid lg:grid-cols-2 gap-16">

                    {/* Formulari */}
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Adreça */}
                        <div>
                            <h2 className="text-xs text-slate-500 uppercase tracking-widest mb-4">Adreça d'enviament</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">País *</label>
                                    <input
                                        type="text"
                                        name="pais"
                                        value={form.pais}
                                        onChange={handleChange}
                                        required
                                        placeholder="Espanya"
                                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none placeholder-slate-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Carrer *</label>
                                    <input
                                        type="text"
                                        name="carrer"
                                        value={form.carrer}
                                        onChange={handleChange}
                                        required
                                        placeholder="Carrer Major, 42"
                                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none placeholder-slate-600"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Pis / Porta</label>
                                        <input
                                            type="text"
                                            name="pis"
                                            value={form.pis}
                                            onChange={handleChange}
                                            placeholder="3r 2a"
                                            className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none placeholder-slate-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Codi postal *</label>
                                        <input
                                            type="text"
                                            name="codiPostal"
                                            value={form.codiPostal}
                                            onChange={handleChange}
                                            required
                                            placeholder="08001"
                                            className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none placeholder-slate-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mètode de pagament */}
                        <div>
                            <h2 className="text-xs text-slate-500 uppercase tracking-widest mb-4">Mètode de pagament</h2>
                            <div className="space-y-2">
                                {[
                                    { value: "targeta", label: "Targeta de crèdit / dèbit" },
                                    { value: "paypal", label: "PayPal" },
                                    { value: "transferencia", label: "Transferència bancària" }
                                ].map(opt => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition ${
                                            form.metode === opt.value
                                                ? "border-emerald-500/40 bg-emerald-500/5 text-slate-200"
                                                : "border-slate-800 text-slate-400 hover:border-slate-700"
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                            form.metode === opt.value ? "border-emerald-400" : "border-slate-600"
                                        }`}>
                                            {form.metode === opt.value && (
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name="metode"
                                            value={opt.value}
                                            checked={form.metode === opt.value}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-sm">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/5 px-4 py-3">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 transition text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "PROCESSANT..." : "CONFIRMAR COMANDA"}
                        </button>
                    </form>

                    {/* Resum de la comanda */}
                    <div>
                        <h2 className="text-xs text-slate-500 uppercase tracking-widest mb-4">Resum</h2>
                        <div className="border border-slate-800 divide-y divide-slate-800">
                            {cart.map(item => (
                                <div key={item._id} className="flex items-center justify-between px-4 py-3 gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-200 truncate">{item.name}</p>
                                        <p className="text-xs text-slate-500">× {item.qty}</p>
                                    </div>
                                    <p className="text-sm text-emerald-400 flex-shrink-0">
                                        {(item.priceValue * item.qty).toFixed(2).replace(".", ",")} €
                                    </p>
                                </div>
                            ))}

                            <div className="px-4 py-4 space-y-2">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>{totalItems} {totalItems === 1 ? "producte" : "productes"}</span>
                                    <span>{total.toFixed(2).replace(".", ",")} €</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Enviament</span>
                                    <span className={total >= 50 ? "text-emerald-500" : ""}>
                                        {total >= 50 ? "Gratuït" : "4,95 €"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-light pt-2 border-t border-slate-800">
                                    <span className="text-slate-300 tracking-wider">TOTAL</span>
                                    <span className="text-emerald-400 text-lg">
                                        {(total >= 50 ? total : total + 4.95).toFixed(2).replace(".", ",")} €
                                    </span>
                                </div>
                            </div>
                        </div>

                        {total >= 50 && (
                            <p className="text-xs text-emerald-500/70 flex items-center gap-2 mt-3">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block"></span>
                                Enviament gratuït aplicat
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
