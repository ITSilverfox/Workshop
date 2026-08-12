import Link from "next/link";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { FuelSectionNav } from "@/app/(app)/fuel/fuel-nav";

function fmtDateTime(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy, HH:mm") : "—";
}

export default async function CardTransactionsPage(
  props: PageProps<"/fuel/card-transactions">
) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const vehicleId = typeof searchParams.vehicle === "string" ? searchParams.vehicle : "";

  const supabase = await createClient();

  let query = supabase
    .from("fuel_card_transactions")
    .select("id, transacted_at, amount, litres, source, bill_reference, vehicle:vehicles(reg_number, vehicle_name)")
    .order("transacted_at", { ascending: false });

  if (q) {
    query = query.or(`bill_reference.ilike.%${q}%,notes.ilike.%${q}%`);
  }
  if (vehicleId) {
    query = query.eq("vehicle_id", vehicleId);
  }

  const [{ data: transactions, error }, { data: vehicleOptions }] = await Promise.all([
    query,
    supabase.from("vehicles").select("id, reg_number").order("reg_number"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fuel Card Transactions"
        description="Fuel card feed transactions, matched to vehicles where known."
        actions={
          <Button asChild>
            <Link href="/fuel/card-transactions/new">
              <Plus />
              Add Transaction
            </Link>
          </Button>
        }
      />

      <FuelSectionNav active="card-transactions" />

      <Card>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3" method="get">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="q" className="text-sm font-medium">
                Search
              </label>
              <Input
                id="q"
                name="q"
                placeholder="Bill reference or notes…"
                defaultValue={q}
                className="w-56"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vehicle" className="text-sm font-medium">
                Vehicle
              </label>
              <select
                id="vehicle"
                name="vehicle"
                defaultValue={vehicleId}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All vehicles</option>
                {(vehicleOptions ?? []).map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.reg_number}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || vehicleId ? (
              <Button variant="ghost" asChild>
                <Link href="/fuel/card-transactions">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load card transactions: {error.message}
            </p>
          ) : transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Litres</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Bill Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/fuel/card-transactions/${transaction.id}`}
                        className="hover:underline"
                      >
                        {fmtDateTime(transaction.transacted_at)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {transaction.vehicle
                        ? transaction.vehicle.vehicle_name
                          ? `${transaction.vehicle.reg_number} — ${transaction.vehicle.vehicle_name}`
                          : transaction.vehicle.reg_number
                        : "—"}
                    </TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.litres ?? "—"}</TableCell>
                    <TableCell className="capitalize">{transaction.source}</TableCell>
                    <TableCell>{transaction.bill_reference ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No card transactions found{q || vehicleId ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
