export default function Home() {
    const games = [
        {
            name: "Catan",
            price: "39,99 €",
            img: "https://images.unsplash.com/photo-1606813907291-61c44d39d8f5",
        },
        {
            name: "Carcassonne",
            price: "24,99 €",
            img: "https://images.unsplash.com/photo-1589578527966-fdac0f5a2361",
        },
        {
            name: "Dixit",
            price: "29,99 €",
            img: "https://images.unsplash.com/photo-1618172193622-f45ee2a67bbd",
        },
        {
            name: "Gloomhaven",
            price: "89,99 €",
            img: "https://images.unsplash.com/photo-1633532325009-2ac0f5fe8d49",
        },
        {
            name: "Munchkin",
            price: "19,99 €",
            img: "https://images.unsplash.com/photo-1605559424843-9e4b78b86651",
        },
        {
            name: "Arkham Horror",
            price: "44,99 €",
            img: "https://images.unsplash.com/photo-1590602847861-a8f3c7d5c402",
        },
    ];

    return (
        <div className="min-h-screen bg-[#2e3b24] text-green-100 font-serif">
            {/* Hero */}
            <section className="bg-[url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4')] bg-[#3a2d1f]over bg-[#3a2d1f]enter py-24 px-6 text-center shadow-inner border-b border-green-900">
                <div className="backdrop-brightness-50 bg-green-900/40 p-10 rounded-xl inline-block shadow-xl border border-[#a84539]/40">
                    <h1 className="text-6xl font-bold mb-4 text-green-200 drop-shadow-xl">
                        Tienda de Juegos de Mesa
                    </h1>
                    <p className="text-lg opacity-90 max-w-xl mx-auto">
                        Bienvenido a la taberna, viajero. ¡Descansa y elige tu próximo juego para la aventura!
                    </p>
                    <button className="mt-6 bg-green-800 text-green-100 px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md">
                        Ver catálogo
                    </button>
                </div>
            </section>

            {/* Grid de productos */}
            <section className="py-20 px-8 max-w-6xl mx-auto">
                <h2 className="text-4xl font-semibold mb-10 text-green-100">Más populares</h2>

                <div className="grid md:grid-cols-3 gap-10">
                    {games.map((game, index) => (
                        <div
                            key={index}
                            className="bg-[#4c2f23] shadow-xl rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[#a84539]/40 transition border border-green-900/40"
                        >
                            <img
                                src={game.img}
                                alt={game.name}
                                className="h-56 w-full object-cover opacity-95"
                            />
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-green-100 drop-shadow">
                                    {game.name}
                                </h3>
                                <p className="text-[#f2cbbf] mt-2">{game.price}</p>
                                <button className="mt-4 w-full bg-green-800 text-green-100 py-2 rounded-lg hover:bg-green-700 transition font-bold">
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#2a1a15] text-green-100 text-center py-8 border-t border-[#5c3a2e]">
                <p>© {new Date().getFullYear()} Tienda de Juegos de Mesa · Siempre hay una mesa libre en la taberna</p>
            </footer>
        </div>
    );
}
