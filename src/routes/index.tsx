import { createFileRoute } from "@tanstack/react-router";
import { AureaApp } from "@/components/aurea/app";

export const Route = createFileRoute("/")({
  component: AureaApp,
});
