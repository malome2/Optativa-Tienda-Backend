import { useLocation, useNavigate } from "react-router-dom";

export default function CheckoutSuccess() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const pedido = state?.pedido;

    return (
        <div className="min-h-screen text-slate-100 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto px-6 text-center">

                <div className="w-16 h-16 border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center mx-auto mb-8">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-light mb-3">Comanda confirmada</h1>
                <p className="text-slate-400 font-light mb-8">
                    Gràcies! La teva comanda ha estat processada correctament.
                </p>

                {pedido && (
                    <div className="border border-slate-800 p-4 mb-8 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Núm. comanda</span>
                            <span className="text-slate-300 font-mono text-xs">{pedido._id?.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Total</span>
                            <span className="text-emerald-400">{pedido.total?.toFixed(2).replace(".", ",")} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Estat</span>
                            <span className="text-slate-300 capitalize">{pedido.estat}</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/catalog")}
                        className="w-full py-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 transition text-sm tracking-widest"
                    >
                        CONTINUAR COMPRANT
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition tracking-wider"
                    >
                        Tornar a l'inici
                    </button>
                </div>
            </div>
        </div>
    );
}
