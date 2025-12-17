export default function Home() {
    const games = [
        {
            name: "Catan",
            price: "39,99 €",
            img: "https://images.unsplash.com/photo-1606813907291-61c44d39d8f5",
            players: "3-4"
        },
        {
            name: "Carcassonne",
            price: "24,99 €",
            img: "https://images.unsplash.com/photo-1589578527966-fdac0f5a2361",
            players: "2-5"
        },
        {
            name: "Dixit",
            price: "29,99 €",
            img: "https://images.unsplash.com/photo-1618172193622-f45ee2a67bbd",
            players: "3-6"
        },
        {
            name: "Gloomhaven",
            price: "89,99 €",
            img: "https://images.unsplash.com/photo-1633532325009-2ac0f5fe8d49",
            players: "1-4"
        },
        {
            name: "Munchkin",
            price: "19,99 €",
            img: "https://images.unsplash.com/photo-1605559424843-9e4b78b86651",
            players: "3-6"
        },
        {
            name: "Arkham Horror",
            price: "44,99 €",
            img: "https://images.unsplash.com/photo-1590602847861-a8f3c7d5c402",
            players: "1-4"
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">

            
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
                    <button className="group relative px-8 py-3 overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 transition group-hover:bg-emerald-500/20"></div>
                        <span className="relative text-emerald-400 text-sm tracking-wider">EXPLORAR COLECCIÓN</span>
                    </button>
                </div>
            </section>

            
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-light text-slate-300">Colección destacada</h2>
                    <button className="px-6 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition text-sm tracking-wider">
                        VER CATÁLOGO COMPLETO
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {games.map((game, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 mb-4">
                                <img
                                    src={game.img}
                                    alt={game.name}
                                    className="h-80 w-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute top-4 right-4 w-12 h-12 bg-slate-950/80 backdrop-blur border border-emerald-500/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-light text-slate-200 mb-1">
                                        {game.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">{game.players} jugadores</p>
                                </div>
                                <p className="text-emerald-400 font-light">{game.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            
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
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-1 h-1 bg-emerald-400"></div>
                            <span className="text-sm">Envío gratuito en pedidos +50€</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-1 h-1 bg-emerald-400"></div>
                            <span className="text-sm">Catálogo actualizado cada semana</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-1 h-1 bg-emerald-400"></div>
                            <span className="text-sm">Atención personalizada y recomendaciones</span>
                        </div>
                    </div>
                    <button className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition text-sm tracking-wider">
                        EXPLORAR TODO
                    </button>
                </div>
            </section>

            
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