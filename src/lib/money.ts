/** Formats a price the way the storefront shows it: "$24", "$4,50". */
export const money = (n: number) =>
	`$${Number(n).toLocaleString("es", {
		minimumFractionDigits: n % 1 ? 2 : 0,
		maximumFractionDigits: 2,
	})}`;
