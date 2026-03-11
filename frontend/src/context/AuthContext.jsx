import { createContext, useContext, useState, useEffect } from "react";

const API = "http://localhost:3000/api";

// ── Helpers fetch ─────────────────────────────────────────────────────────────
export const apiPost = async (path, body, token) => {
    const res = await fetch(`${API}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
    });
    return res.json();
};

export const apiGet = async (path, token) => {
    const res = await fetch(`${API}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
};

export const apiPut = async (path, body, token) => {
    const res = await fetch(`${API}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
    });
    return res.json();
};

export const apiDelete = async (path, token) => {
    const res = await fetch(`${API}${path}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
};

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("accessToken") || null);
    const [user, setUser] = useState(() => {
        const u = localStorage.getItem("user");
        return u ? JSON.parse(u) : null;
    });
    const [cart, setCart] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);

    // Normalitza el format del backend → frontend
    const normalizeCart = (jocs = []) =>
        jocs.map(item => ({
            _id: item.joc._id,
            name: item.joc.titol,
            priceValue: item.joc.preu,
            qty: item.quantitat,
            categoria: item.joc.categoria
        }));

    // Carrega la cistella quan l'usuari s'autentica
    useEffect(() => {
        if (!token) { setCart([]); return; }
        const fetchCart = async () => {
            setCartLoading(true);
            try {
                const data = await apiGet("/carrito", token);
                if (data.status === "success") setCart(normalizeCart(data.data.jocs));
            } finally {
                setCartLoading(false);
            }
        };
        fetchCart();
    }, [token]);

    const saveAuth = (data) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.accessToken);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setCart([]);
    };

    // ── Operacions cistella ───────────────────────────────────────────────────
    const addToCart = async (game) => {
        if (!token) return false; // indica que cal login
        const data = await apiPost("/carrito", { jocId: game._id, quantitat: 1 }, token);
        if (data.status === "success") setCart(normalizeCart(data.data.jocs));
        return true;
    };

    const updateQty = async (gameId, newQty) => {
        if (newQty <= 0) {
            const data = await apiDelete(`/carrito/${gameId}`, token);
            if (data.status === "success") setCart(normalizeCart(data.data.jocs));
        } else {
            const data = await apiPut(`/carrito/${gameId}`, { quantitat: newQty }, token);
            if (data.status === "success") setCart(normalizeCart(data.data.jocs));
        }
    };

    const removeFromCart = async (gameId) => {
        const data = await apiDelete(`/carrito/${gameId}`, token);
        if (data.status === "success") setCart(normalizeCart(data.data.jocs));
    };

    const clearCart = async () => {
        await apiDelete("/carrito/clear", token);
        setCart([]);
    };

    return (
        <AuthContext.Provider value={{
            token, user, cart, cartLoading,
            saveAuth, logout,
            addToCart, updateQty, removeFromCart, clearCart
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);