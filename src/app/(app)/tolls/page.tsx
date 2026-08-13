import Link from "next/link";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

function fmtDateTime(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy, HH:mm") : "—";
}

export default async function TollTransactionsPage(props: PageProps<"/tolls">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const type = typeof searchParams.type === "string" ? searchParams.type : "";

  const supabase = await createClient();
  let query = supabase
    .from("toll_transactions")
    .select(
      "id, occurred_at, amount, transaction_type, source, reference_no, vehicle:vehicles(reg_number, vehicle_name), toll_account:toll_accounts(account_name)"
    )
    .order("occurred_at", { ascending: false });

  if (q) {
    query = query.ilike("reference_no", `%${q}%`);
  }
  if (type) {
    query = query.eq("transaction_type", type);
  }

  const { data: transactions, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Toll Transactions"
        description="Toll trips, parking, and top-up transactions across the fleet."
        actions={
          <Button asChild>
            <Link href="/tolls/new">
              <Plus />
              Add Transaction
            </Link>
          </Button>
        }
      />

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
                placeholder="Reference number…"
                defaultValue={q}
                className="w-56"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="type"
                name="type"
                defaultValue={type}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All types</option>
                <option value="toll_trip">Toll trip</option>
                <option value="parking">Parking</option>
                <option value="topup">Top-up</option>
                <option value="deduction">Deduction</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || type ? (
              <Button variant="ghost" asChild>
                <Link href="/tolls">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load toll transactions: {error.message}
            </p>
          ) : transactions && transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Toll Account</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reference No</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        <Link href={`/tolls/${transaction.id}`} className="hover:underline">
                          {fmtDateTime(transaction.occurred_at)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {transaction.vehicle
                          ? transaction.vehicle.vehicle_name
                            ? `${transaction.vehicle.reg_number} — ${transaction.vehicle.vehicle_name}`
                            : transaction.vehicle.reg_number
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {transaction.transaction_type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{transaction.source}</TableCell>
                      <TableCell>{transaction.toll_account?.account_name ?? "—"}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.reference_no ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No toll transactions found{q || type ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
