import Link from "next/link";
import { Plus } from "lucide-react";
import { format } from "date-fns";
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

const TRANSACTION_TYPES = [
  "purchase_external",
  "purchase_internal",
  "inter_company",
  "issue_to_job_card",
  "adjustment_in",
  "adjustment_out",
];

const TYPE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  purchase_external: "default",
  purchase_internal: "default",
  inter_company: "default",
  adjustment_in: "default",
  issue_to_job_card: "secondary",
  adjustment_out: "secondary",
};

function label(value: string) {
  return value.replace(/_/g, " ");
}

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

export default async function TransactionsPage(
  props: PageProps<"/inventory/transactions">
) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const type = typeof searchParams.type === "string" ? searchParams.type : "";

  const supabase = await createClient();
  let query = supabase
    .from("inventory_transactions")
    .select(
      "id, transaction_date, transaction_type, quantity, amount, reference_no, item:items(name), job_card:job_cards(job_card_no), vendor:vendors(name)"
    )
    .order("transaction_date", { ascending: false });

  if (q) {
    query = query.or(`reference_no.ilike.%${q}%,notes.ilike.%${q}%`);
  }
  if (type) {
    query = query.eq("transaction_type", type);
  }

  const { data: transactions, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Stock Transactions"
        description="Inbound and outbound movements of inventory items."
        actions={
          <Button asChild>
            <Link href="/inventory/transactions/new">
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
                placeholder="Reference no. or notes…"
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
                {TRANSACTION_TYPES.map((value) => (
                  <option key={value} value={value} className="capitalize">
                    {label(value)}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || type ? (
              <Button variant="ghost" asChild>
                <Link href="/inventory/transactions">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load transactions: {error.message}
            </p>
          ) : transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Related To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/inventory/transactions/${tx.id}`}
                        className="hover:underline"
                      >
                        {tx.item?.name ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell>{fmtDate(tx.transaction_date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={TYPE_VARIANT[tx.transaction_type] ?? "outline"}
                        className="capitalize"
                      >
                        {label(tx.transaction_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{tx.quantity}</TableCell>
                    <TableCell>{tx.amount ?? "—"}</TableCell>
                    <TableCell>{tx.reference_no ?? "—"}</TableCell>
                    <TableCell>
                      {tx.job_card?.job_card_no ?? tx.vendor?.name ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No stock transactions found{q || type ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
