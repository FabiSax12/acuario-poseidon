import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import type { ToastTone } from "#/components/ds/Toast";
import type { Product } from "#/data/catalog";
import {
	addToCart,
	type CartLine,
	cartItemCount,
	cartSubtotal,
	removeFromCart,
	setLineQuantity,
} from "#/lib/cart";

const TOAST_DURATION_MS = 3600;

export interface ToastMessage {
	tone?: ToastTone;
	title: string;
	message?: string;
	/** Label of the toast's action button, which opens the cart. */
	action?: string;
}

interface StoreValue {
	cart: CartLine[];
	count: number;
	subtotal: number;
	add: (product: Product, qty?: number) => void;
	setQty: (productId: string, qty: number) => void;
	remove: (productId: string) => void;
	checkout: () => void;
	cartOpen: boolean;
	openCart: () => void;
	closeCart: () => void;
	toast: ToastMessage | null;
	showToast: (toast: ToastMessage) => void;
	dismissToast: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

/** Cart and toast state for the storefront. The cart lives in memory only. */
export function StoreProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<CartLine[]>([]);
	const [cartOpen, setCartOpen] = useState(false);
	const [toast, setToast] = useState<ToastMessage | null>(null);
	const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	useEffect(() => () => clearTimeout(toastTimer.current), []);

	const showToast = useCallback((next: ToastMessage) => {
		setToast(next);
		clearTimeout(toastTimer.current);
		toastTimer.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
	}, []);
	const dismissToast = useCallback(() => setToast(null), []);

	const add = useCallback(
		(product: Product, qty = 1) => {
			setCart((current) => addToCart(current, product, qty));
			showToast({
				tone: "success",
				title: "Añadido al carrito",
				message: `${product.name} × ${qty}`,
				action: "Ver carrito",
			});
		},
		[showToast],
	);
	const setQty = useCallback(
		(productId: string, qty: number) =>
			setCart((current) => setLineQuantity(current, productId, qty)),
		[],
	);
	const remove = useCallback(
		(productId: string) =>
			setCart((current) => removeFromCart(current, productId)),
		[],
	);
	const openCart = useCallback(() => setCartOpen(true), []);
	const closeCart = useCallback(() => setCartOpen(false), []);
	const checkout = useCallback(() => {
		setCartOpen(false);
		setCart([]);
		showToast({
			tone: "success",
			title: "¡Pedido recibido!",
			message: "Te escribimos para coordinar la entrega.",
		});
	}, [showToast]);

	return (
		<StoreContext
			value={{
				cart,
				count: cartItemCount(cart),
				subtotal: cartSubtotal(cart),
				add,
				setQty,
				remove,
				checkout,
				cartOpen,
				openCart,
				closeCart,
				toast,
				showToast,
				dismissToast,
			}}
		>
			{children}
		</StoreContext>
	);
}

export function useStore() {
	const store = useContext(StoreContext);
	if (!store) throw new Error("useStore must be used inside <StoreProvider>");
	return store;
}
