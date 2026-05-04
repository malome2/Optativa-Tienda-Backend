import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, apiGet, apiPut } from "../context/AuthContext";

const ESTAT_COLORS = {
    pendent: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
    pagat: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
    enviat: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    arribat: "text-purple-400 border-purple-400/30 bg-purple-400/5",
    "cancel·lat": "text-red-400 border-red-400/30 bg-red-400/5",
};

export default function DashboardUsuari() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        apiGet("/dashboard/usuari", token)
            .then(res => {
                if (res.status === "success") setData(res.data);
                else setError(res.message);
            })
            .catch(() => setError("Error de connexió"))
            .finally(() => setLoading(false));
    }, [token]);

    const openEdit = () => {
        setEditForm({ nom: data.usuari.nom, email: data.usuari.email });
        setSaveError(null);
        setEditing(true);
    };

    const saveProfile = async () => {
        setSaving(true);
        setSaveError(null);
        const res = await apiPut("/users/me", editForm, token);
        setSaving(false);
        if (res.status === "success") {
            setData(d => ({ ...d, usuari: res.data }));
            setEditing(false);
        } else {
            setSaveError(res.message || "Error en guardar");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-6 h-6 border border-emerald-500/40 border-t-emerald-400 rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>
    );

    const { usuari, pedidos, totalGastat } = data;

    return (
        <div className="min-h-screen text-slate-100">
            <div className="max-w-5xl mx-auto px-6 py-16">

                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-light">El meu compte</h1>
                    {!editing && (
                        <button
                            onClick={openEdit}
                            className="text-xs px-4 py-2 border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition"
                        >
                            Editar perfil
                        </button>
                    )}
                </div>

                {/* Perfil — vista */}
                {!editing && (
                    <div className="grid sm:grid-cols-3 gap-4 mb-12">
                        <div className="border border-slate-800 p-6">
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Nom</p>
                            <p className="text-slate-200 font-light">{usuari.nom}</p>
                        </div>
                        <div className="border border-slate-800 p-6">
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Email</p>
                            <p className="text-slate-200 font-light text-sm">{usuari.email}</p>
                        </div>
                        <div className="border border-emerald-500/20 bg-emerald-500/5 p-6">
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total gastat</p>
                            <p className="text-emerald-400 text-2xl font-light">{totalGastat.toFixed(2).replace(".", ",")} €</p>
                        </div>
                    </div>
                )}

                {/* Perfil — edició */}
                {editing && (
                    <div className="border border-slate-800 p-6 mb-12">
                        <h2 className="text-xs text-slate-500 uppercase tracking-widest mb-6">Editar perfil</h2>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Nom</label>
                                <input
                                    type="text"
                                    value={editForm.nom ?? ""}
                                    onChange={e => setEditForm(f => ({ ...f, nom: e.target.value }))}
                                    className="w-full bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email ?? ""}
                                    onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                                />
                            </div>
                        </div>
                        {saveError && <p className="text-xs text-red-400 mb-4">{saveError}</p>}
                        <div className="flex gap-3">
                            <button
                                onClick={saveProfile}
                                disabled={saving}
                                className="text-xs px-4 py-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition"
                            >
                                {saving ? "Guardant..." : "Guardar canvis"}
                            </button>
                            <button
                                onClick={() => setEditing(false)}
                                className="text-xs px-4 py-2 text-slate-400 hover:text-slate-200 transition"
                            >
                                Cancel·lar
                            </button>
                        </div>
                    </div>
                )}

                {/* Historial de comandes */}
                <h2 className="text-xs text-slate-500 uppercase tracking-widest mb-4">Historial de comandes</h2>

                {pedidos.length === 0 ? (
                    <div className="border border-slate-800 p-12 text-center text-slate-500 font-light">
                        Encara no has fet cap comanda.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pedidos.map(pedido => (
                            <div key={pedido._id} className="border border-slate-800 hover:border-slate-700 transition">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                                    <div>
                                        <p className="text-xs text-slate-500 font-mono"># {pedido._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-slate-600 mt-0.5">
                                            {new Date(pedido.createdAt).toLocaleDateString("ca-ES")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs px-2 py-1 border ${ESTAT_COLORS[pedido.estat] || "text-slate-400 border-slate-700"}`}>
                                            {pedido.estat}
                                        </span>
                                        <span className="text-emerald-400 font-light">
                                            {pedido.total.toFixed(2).replace(".", ",")} €
                                        </span>
                                    </div>
                                </div>
                                <div className="px-5 py-3 divide-y divide-slate-800/50">
                                    {pedido.jocs.map((item, i) => (
                                        <div key={i} className="flex justify-between py-2 text-sm">
                                            <span className="text-slate-300">{item.joc.titol}</span>
                                            <span className="text-slate-500">× {item.quantitat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
