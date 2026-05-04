import { useNavigate } from "react-router-dom";

export default function CheckoutCancel() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-slate-100 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto px-6 text-center">

                <div className="w-16 h-16 border border-red-500/40 bg-red-500/10 flex items-center justify-center mx-auto mb-8">
                    <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h1 className="text-3xl font-light mb-3">Pagament cancel·lat</h1>
                <p className="text-slate-400 font-light mb-8">
                    Has cancel·lat el procés de pagament. La teva cistella segueix intacta.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/checkout")}
                        className="w-full py-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 transition text-sm tracking-widest"
                    >
                        TORNAR AL CHECKOUT
                    </button>
                    <button
                        onClick={() => navigate("/catalog")}
                        className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition tracking-wider"
                    >
                        Continuar comprant
                    </button>
                </div>
            </div>
        </div>
    );
}
