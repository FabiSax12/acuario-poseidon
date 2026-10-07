import { Button } from "#/components/ds/Button";
import { Dialog } from "#/components/ds/Dialog";
import { IconButton } from "#/components/ds/IconButton";
import { QuantityStepper } from "#/components/ds/QuantityStepper";
import { money } from "#/lib/money";
import { PhotoSlot } from "./PhotoSlot";
import { useStore } from "./StoreProvider";

export function CartDrawer() {
	const { cart, subtotal, cartOpen, closeCart, setQty, remove, checkout } =
		useStore();
	return (
		<Dialog
			open={cartOpen}
			onClose={closeCart}
			title="Tu carrito"
			side="right"
			width={460}
			footer={
				cart.length ? (
					<div
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							gap: 14,
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "baseline",
							}}
						>
							<span style={{ color: "var(--text-muted)" }}>Subtotal</span>
							<span
								style={{ font: "500 24px/1 var(--font-mono)", color: "#fff" }}
							>
								{money(subtotal)}
							</span>
						</div>
						<Button size="lg" full iconRight="arrow-right" onClick={checkout}>
							Finalizar compra
						</Button>
						<span
							style={{
								font: "400 13px/1.4 var(--font-sans)",
								color: "var(--text-muted)",
								textAlign: "center",
							}}
						>
							Coordinamos contigo la entrega o el retiro en tienda.
						</span>
					</div>
				) : null
			}
		>
			{cart.length === 0 ? (
				<div
					style={{
						padding: "48px 0",
						textAlign: "center",
						color: "var(--text-muted)",
					}}
				>
					Tu carrito está vacío.
					<div style={{ marginTop: 16 }}>
						<Button variant="glass" onClick={closeCart}>
							Seguir explorando
						</Button>
					</div>
				</div>
			) : (
				cart.map(({ product, qty }) => (
					<div
						key={product.id}
						// Grid so the controls can run under the line total on
						// narrow drawers instead of squeezing the product name.
						style={{
							display: "grid",
							gridTemplateColumns: "72px minmax(0,1fr) auto",
							columnGap: 14,
							padding: "14px 0",
							borderBottom: "1px solid var(--glass-stroke)",
						}}
					>
						<div
							className="self-start sm:self-center"
							style={{
								gridArea: "1 / 1 / span 2",
								position: "relative",
								width: 72,
								height: 72,
								borderRadius: 14,
								overflow: "hidden",
							}}
						>
							{product.image ? (
								<div
									style={{
										position: "absolute",
										inset: 0,
										background: `url("${product.image}") center/cover`,
									}}
								/>
							) : (
								<PhotoSlot icon={product.icon} label="" />
							)}
						</div>
						<div
							style={{
								gridArea: "1 / 2",
								alignSelf: "end",
								minWidth: 0,
								overflowWrap: "anywhere",
							}}
						>
							<div
								style={{ font: "600 15px/1.3 var(--font-sans)", color: "#fff" }}
							>
								{product.name}
							</div>
							<div
								style={{
									font: "500 14px/1.6 var(--font-mono)",
									color: "var(--text-muted)",
								}}
							>
								{money(product.price)}
							</div>
						</div>
						<div
							className="col-span-2 sm:col-span-1"
							style={{
								gridRowStart: 2,
								gridColumnStart: 2,
								alignSelf: "start",
								display: "flex",
								alignItems: "center",
								gap: 6,
								marginTop: 6,
							}}
						>
							<QuantityStepper
								size="sm"
								value={qty}
								onChange={(q) => setQty(product.id, q)}
							/>
							<IconButton
								icon="trash-2"
								label="Quitar"
								variant="ghost"
								size="sm"
								onClick={() => remove(product.id)}
							/>
						</div>
						<span
							className="row-start-1 self-start sm:row-end-[span_2] sm:self-center"
							style={{
								gridColumnStart: 3,
								font: "500 15px/1.3 var(--font-mono)",
								color: "#fff",
							}}
						>
							{money(product.price * qty)}
						</span>
					</div>
				))
			)}
		</Dialog>
	);
}
