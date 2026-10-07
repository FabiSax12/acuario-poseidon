import { useMatches, useNavigate } from "@tanstack/react-router";
import { NavBar } from "#/components/ds/NavBar";
import { Toast } from "#/components/ds/Toast";
import { VideoBackdrop } from "#/components/ds/VideoBackdrop";
import { imageUrl } from "#/data/catalog";
import type { FileRouteTypes } from "#/routeTree.gen";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { useStore } from "./StoreProvider";

const NAV_LINKS = ["Inicio", "Tienda", "Peceras a medida", "Contacto"] as const;
type NavLink = (typeof NAV_LINKS)[number];

const TANK_BACKDROP = {
	src: "https://assets.mixkit.co/videos/14490/14490-720.mp4",
	poster: imageUrl("tank-marine-flora"),
};

// Distance from the toast to the screen edges: 24px by design, less on phones.
const TOAST_GAP = "clamp(12px, 4vw, 24px)";

interface Screen {
	/** Nav link highlighted while this route is showing. */
	navLink: NavLink;
	/** Fixed, blurred video behind the whole page. */
	backdrop?: { src: string; poster: string };
}

const SCREENS: Partial<Record<FileRouteTypes["id"], Screen>> = {
	"/": { navLink: "Inicio" },
	"/tienda/": {
		navLink: "Tienda",
		backdrop: {
			src: "https://assets.mixkit.co/videos/45376/45376-720.mp4",
			poster: imageUrl("tropical-aquarium"),
		},
	},
	"/tienda/$productId": { navLink: "Tienda", backdrop: TANK_BACKDROP },
	"/peceras-a-medida": {
		navLink: "Peceras a medida",
		backdrop: TANK_BACKDROP,
	},
};

/** Fixed nav, per-route video backdrop, footer, cart drawer and toast. */
export function AppShell({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const routeId = useMatches({
		select: (matches) => matches[matches.length - 1]?.routeId,
	});
	const { count, openCart, toast, dismissToast } = useStore();
	const screen = routeId ? SCREENS[routeId] : undefined;
	const backdrop = screen?.backdrop;

	const onNavigate = (link: NavLink) => {
		switch (link) {
			case "Inicio":
				return navigate({ to: "/" });
			case "Tienda":
				return navigate({ to: "/tienda" });
			case "Peceras a medida":
				return navigate({ to: "/peceras-a-medida" });
			case "Contacto":
				// Not a page: scroll to the footer. The prototype used offsetTop, which
				// is 0 here because the footer's wrapper is positioned.
				document
					.getElementById("contacto")
					?.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<>
			{backdrop && (
				<VideoBackdrop
					key={routeId}
					fixed
					src={backdrop.src}
					poster={backdrop.poster}
					blur={22}
					dim={0.4}
					scrim="full"
				/>
			)}
			<div
				className="top-[env(safe-area-inset-top)] lg:top-4"
				style={{ position: "fixed", left: 0, right: 0, zIndex: 60 }}
			>
				<NavBar
					sticky={false}
					links={NAV_LINKS}
					active={screen?.navLink}
					onNavigate={onNavigate}
					onLogo={() => navigate({ to: "/" })}
					cartCount={count}
					onCart={openCart}
					onSearch={() => navigate({ to: "/tienda" })}
				/>
			</div>
			<main style={{ position: "relative", zIndex: 1 }}>{children}</main>
			<div style={{ position: "relative", zIndex: 1 }}>
				<Footer />
			</div>
			<CartDrawer />
			<div
				style={{
					position: "fixed",
					right: `max(${TOAST_GAP}, env(safe-area-inset-right))`,
					bottom: `max(${TOAST_GAP}, env(safe-area-inset-bottom))`,
					maxWidth: `calc(100vw - 2 * ${TOAST_GAP})`,
					zIndex: 120,
					transition: "all var(--dur-base) var(--ease-buoy)",
					opacity: toast ? 1 : 0,
					transform: toast ? "none" : "translateY(16px)",
					pointerEvents: toast ? "auto" : "none",
				}}
			>
				{toast && (
					<Toast
						{...toast}
						onAction={() => {
							openCart();
							dismissToast();
						}}
						onClose={dismissToast}
					/>
				)}
			</div>
		</>
	);
}
