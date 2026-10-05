import { createFileRoute } from "@tanstack/react-router";
import { Shop } from "#/components/tienda/Shop";

export const Route = createFileRoute("/tienda/")({ component: Shop });
