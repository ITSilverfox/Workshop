import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FuelSectionNav({ active }: { active: "entries" | "card-transactions" }) {
  return (
    <div className="flex gap-2">
      <Button variant={active === "entries" ? "default" : "outline"} size="sm" asChild>
        <Link href="/fuel">Fuel Entries</Link>
      </Button>
      <Button
        variant={active === "card-transactions" ? "default" : "outline"}
        size="sm"
        asChild
      >
        <Link href="/fuel/card-transactions">Card Transactions</Link>
      </Button>
    </div>
  );
}
