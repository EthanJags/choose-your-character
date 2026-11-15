import type { Metadata } from "next";
import EthanNotFound from "./components/EthanNotFound";

export const metadata: Metadata = {
  title: "404 · Ethan not found",
};

export default function NotFound() {
  return <EthanNotFound />;
}
