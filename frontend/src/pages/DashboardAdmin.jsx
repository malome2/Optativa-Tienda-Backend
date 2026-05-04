import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, apiGet, apiPost, apiPut, apiDelete } from "../context/AuthContext";

const ESTAT_COLORS = {
    pendent: "text-yellow-400",
    pagat: "text-emerald-400",
    enviat: "text-blue-400",
    arribat: "text-purple-400",
    "cancel·lat": "text-red-400",
};

const TABS = ["pedidos", "usuaris", "jocs"];

const Field = ({ label, children }) => (
    <div>
        <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50";

export default function DashboardAdmin() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [jocs, setJocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState("pedidos");
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        if (user?.rol !== "admin") { navigate("/"); return; }
        Promise.all([
            apiGet("/dashboard/admin", token),
            apiGet("/products?limit=200", token),
        ]).then(([dash, jocsRes]) => {
            if (dash.status === "success") setData(dash.data);
            else setError(dash.message);
            if (jocsRes.status === "success") setJocs(jocsRes.data);
        }).catch(() => setError("Error de connexió"))
          .finally(() => setLoading(false));
    }, [token, user]);

    const fetchJocs = () =>
        apiGet("/products?limit=200", token).then(r => { if (r.status === "success") setJocs(r.data); });

    const fetchDashboard = () =>
        apiGet("/dashboard/admin", token).then(r => { if (r.status === "success") setData(r.data); });

    const openModal = (type, item = {}) => { setModal({ type, item }); setForm({ ...item }); };
    const closeModal = () => { setModal(null); setForm({}); };
    const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSaveJoc = async () => {
        setSaving(true);
        const res = modal.type === "createJoc"
            ? await apiPost("/products", form, token)
            : await apiPut(`/products/${modal.item._id}`, form, token);
        setSaving(false);
        if (res.status === "success") { closeModal(); fetchJocs(); }
    };

    const handleDeleteJoc = async () => {
        setSaving(true);
        await apiDelete(`/products/${modal.item._id}`, token);
        setSaving(false);
        closeModal();
        fetchJocs();
    };

    const handleSaveUser = async () => {
        setSaving(true);
        const res = await apiPut(`/users/${modal.item._id}`, form, token);
        setSaving(false);
        if (res.status === "success") { closeModal(); fetchDashboard(); }
    };

    const handleDeleteUser = async () => {
        setSaving(true);
        await apiDelete(`/users/${modal.item._id}`, token);
        setSaving(false);
        closeModal();
        fetchDashboard();
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-6 h-6 border border-emerald-500/40 border-t-emerald-400 rounded-full animate-spin"></div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>
    );

    const { stats, usuaris, pedidos } = data;

    return (
        <div className="min-h-screen text-slate-100">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-light mb-12">Panel d'administració</h1>

                {/* Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    <div className="border border-slate-800 p-6">
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Usuaris</p>
                        <p className="text-3xl font-light text-slate-200">{stats.totalUsuaris}</p>
                    </div>
                    <div className="border border-slate-800 p-6">
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Comandes</p>
                        <p className="text-3xl font-light text-slate-200">{stats.totalPedidos}</p>
                    </div>
                    <div className="border border-emerald-500/20 bg-emerald-500/5 p-6">
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Vendes totals</p>
                        <p className="text-3xl font-light text-emerald-400">{stats.totalVendes.toFixed(2).replace(".", ",")} €</p>
                    </div>
                    <div className="border border-slate-800 p-6">
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Per estat</p>
                        <div className="space-y-1 mt-1">
                            {Object.entries(stats.pedidosPerEstat).map(([estat, count]) => (
                                <div key={estat} className="flex justify-between text-xs">
                                    <span className={ESTAT_COLORS[estat] || "text-slate-400"}>{estat}</span>
                                    <span className="text-slate-400">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 border-b border-slate-800">
                    {TABS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-5 py-2.5 text-xs uppercase tracking-widest transition ${
                                tab === t
                                    ? "text-emerald-400 border-b border-emerald-400 -mb-px"
                                    : "text-slate-500 hover:text-slate-300"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Pedidos */}
                {tab === "pedidos" && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                    <th className="text-left py-3 pr-4">ID</th>
                                    <th className="text-left py-3 pr-4">Usuari</th>
                                    <th className="text-left py-3 pr-4">Total</th>
                                    <th className="text-left py-3 pr-4">Estat</th>
                                    <th className="text-left py-3">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {pedidos.map(p => (
                                    <tr key={p._id} className="hover:bg-slate-900/50 transition">
                                        <td className="py-3 pr-4 font-mono text-xs text-slate-500">{p._id.slice(-8).toUpperCase()}</td>
                                        <td className="py-3 pr-4 text-slate-300">{p.usuari?.nom || "—"}</td>
                                        <td className="py-3 pr-4 text-emerald-400">{p.total.toFixed(2).replace(".", ",")} €</td>
                                        <td className="py-3 pr-4">
                                            <span className={`text-xs ${ESTAT_COLORS[p.estat] || "text-slate-400"}`}>{p.estat}</span>
                                        </td>
                                        <td className="py-3 text-slate-500 text-xs">{new Date(p.createdAt).toLocaleDateString("ca-ES")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Usuaris */}
                {tab === "usuaris" && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                    <th className="text-left py-3 pr-4">Nom</th>
                                    <th className="text-left py-3 pr-4">Email</th>
                                    <th className="text-left py-3 pr-4">Rol</th>
                                    <th className="text-left py-3 pr-4">Registrat</th>
                                    <th className="text-left py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {usuaris.map(u => (
                                    <tr key={u._id} className="hover:bg-slate-900/50 transition">
                                        <td className="py-3 pr-4 text-slate-200">{u.nom}</td>
                                        <td className="py-3 pr-4 text-slate-400 text-xs">{u.email}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`text-xs ${u.rol === "admin" ? "text-emerald-400" : "text-slate-500"}`}>
                                                {u.rol}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString("ca-ES")}</td>
                                        <td className="py-3">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => openModal("editUser", u)}
                                                    className="text-xs text-slate-400 hover:text-emerald-400 transition"
                                                >
                                                    editar
                                                </button>
                                                <button
                                                    onClick={() => openModal("deleteUser", u)}
                                                    className="text-xs text-slate-400 hover:text-red-400 transition"
                                                >
                                                    eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Jocs */}
                {tab === "jocs" && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => openModal("createJoc", { titol: "", descripcio: "", preu: "", stock: 0, categoria: "" })}
                                className="text-xs px-4 py-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition"
                            >
                                + Nou joc
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                        <th className="text-left py-3 pr-4">Títol</th>
                                        <th className="text-left py-3 pr-4">Categoria</th>
                                        <th className="text-left py-3 pr-4">Preu</th>
                                        <th className="text-left py-3 pr-4">Stock</th>
                                        <th className="text-left py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {jocs.map(j => (
                                        <tr key={j._id} className="hover:bg-slate-900/50 transition">
                                            <td className="py-3 pr-4 text-slate-200">{j.titol}</td>
                                            <td className="py-3 pr-4 text-slate-400 text-xs">{j.categoria}</td>
                                            <td className="py-3 pr-4 text-emerald-400">{Number(j.preu).toFixed(2).replace(".", ",")} €</td>
                                            <td className="py-3 pr-4 text-slate-400">{j.stock}</td>
                                            <td className="py-3">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => openModal("editJoc", j)}
                                                        className="text-xs text-slate-400 hover:text-emerald-400 transition"
                                                    >
                                                        editar
                                                    </button>
                                                    <button
                                                        onClick={() => openModal("deleteJoc", j)}
                                                        className="text-xs text-slate-400 hover:text-red-400 transition"
                                                    >
                                                        eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal overlay */}
            {modal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>

                        {/* Delete joc */}
                        {modal.type === "deleteJoc" && (
                            <>
                                <h2 className="text-lg font-light mb-4">Eliminar joc</h2>
                                <p className="text-slate-400 mb-6">
                                    Segur que vols eliminar <span className="text-slate-200">{modal.item.titol}</span>?
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button onClick={closeModal} className="text-xs px-4 py-2 text-slate-400 hover:text-slate-200 transition">Cancel·lar</button>
                                    <button onClick={handleDeleteJoc} disabled={saving} className="text-xs px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition">
                                        {saving ? "Eliminant..." : "Eliminar"}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Delete user */}
                        {modal.type === "deleteUser" && (
                            <>
                                <h2 className="text-lg font-light mb-4">Eliminar usuari</h2>
                                <p className="text-slate-400 mb-6">
                                    Segur que vols eliminar <span className="text-slate-200">{modal.item.nom}</span>?
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button onClick={closeModal} className="text-xs px-4 py-2 text-slate-400 hover:text-slate-200 transition">Cancel·lar</button>
                                    <button onClick={handleDeleteUser} disabled={saving} className="text-xs px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition">
                                        {saving ? "Eliminant..." : "Eliminar"}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Create / edit joc */}
                        {(modal.type === "createJoc" || modal.type === "editJoc") && (
                            <>
                                <h2 className="text-lg font-light mb-6">
                                    {modal.type === "createJoc" ? "Nou joc" : "Editar joc"}
                                </h2>
                                <div className="space-y-4">
                                    <Field label="Títol">
                                        <input type="text" value={form.titol ?? ""} onChange={e => field("titol", e.target.value)} className={inputCls} />
                                    </Field>
                                    <Field label="Categoria">
                                        <input type="text" value={form.categoria ?? ""} onChange={e => field("categoria", e.target.value)} className={inputCls} />
                                    </Field>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Preu (€)">
                                            <input type="number" min="0" step="0.01" value={form.preu ?? ""} onChange={e => field("preu", e.target.value)} className={inputCls} />
                                        </Field>
                                        <Field label="Stock">
                                            <input type="number" min="0" value={form.stock ?? 0} onChange={e => field("stock", e.target.value)} className={inputCls} />
                                        </Field>
                                    </div>
                                    <Field label="Descripció">
                                        <textarea rows={3} value={form.descripcio ?? ""} onChange={e => field("descripcio", e.target.value)} className={inputCls + " resize-none"} />
                                    </Field>
                                </div>
                                <div className="flex gap-3 justify-end mt-6">
                                    <button onClick={closeModal} className="text-xs px-4 py-2 text-slate-400 hover:text-slate-200 transition">Cancel·lar</button>
                                    <button onClick={handleSaveJoc} disabled={saving} className="text-xs px-4 py-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition">
                                        {saving ? "Guardant..." : "Guardar"}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Edit user */}
                        {modal.type === "editUser" && (
                            <>
                                <h2 className="text-lg font-light mb-6">Editar usuari</h2>
                                <div className="space-y-4">
                                    <Field label="Nom">
                                        <input type="text" value={form.nom ?? ""} onChange={e => field("nom", e.target.value)} className={inputCls} />
                                    </Field>
                                    <Field label="Email">
                                        <input type="email" value={form.email ?? ""} onChange={e => field("email", e.target.value)} className={inputCls} />
                                    </Field>
                                    <Field label="Rol">
                                        <select value={form.rol ?? "usuari"} onChange={e => field("rol", e.target.value)} className={inputCls}>
                                            <option value="usuari">usuari</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </Field>
                                </div>
                                <div className="flex gap-3 justify-end mt-6">
                                    <button onClick={closeModal} className="text-xs px-4 py-2 text-slate-400 hover:text-slate-200 transition">Cancel·lar</button>
                                    <button onClick={handleSaveUser} disabled={saving} className="text-xs px-4 py-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition">
                                        {saving ? "Guardant..." : "Guardar"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
