import { createFileRoute } from "@tanstack/react-router";
import { CustomTank } from "#/components/tienda/CustomTank";

export const Route = createFileRoute("/peceras-a-medida")({
	component: CustomTank,
});
