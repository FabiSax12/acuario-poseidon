import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "#/components/tienda/Landing";

export const Route = createFileRoute("/")({ component: Landing });
