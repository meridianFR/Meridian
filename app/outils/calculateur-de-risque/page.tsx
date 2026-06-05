import { redirect } from "next/navigation";

export const metadata = {
  title: "Meridian Risk — Calculateur de risque",
  alternates: { canonical: "/outils/calculateur-position" },
};

export default function Page() {
  redirect("/outils/calculateur-position");
}
