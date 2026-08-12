import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteItem } from "@/app/(app)/inventory/items/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  purchase_external: "Purchase (external)",
  purchase_internal: "Purchase (internal)",
  inter_company: "Inter-company",
  issue_to_job_card: "Issue to job card",
  adjustment_in: "Adjustment in",
  adjustment_out: "Adjustment out",
};

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? "—"}</span>
    </div>
  );
}

export default async function ItemDetailPage(props: PageProps<"/inventory/items/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("items")
    .select("*, category:item_categories(name, purchase_type)")
    .eq("id", id)
    .maybeSingle();

  if (!item) {
    notFound();
  }

  const [{ data: stockLevel }, { data: transactions }] = await Promise.all([
    supabase
      .from("item_stock_levels")
      .select("quantity_on_hand")
      .eq("item_id", id)
      .maybeSingle(),
    supabase
      .from("inventory_transactions")
      .select(
        "id, transaction_date, transaction_type, quantity, rate, amount, reference_no, job_card:job_cards(job_card_no), vendor:vendors(name)"
      )
      .eq("item_id", id)
      .order("transaction_date", { ascending: false }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={item.name}
        description={item.item_code ?? undefined}
        actions={
          <>
            <Badge className="capitalize">{item.status}</Badge>
            <Button variant="outline" asChild>
              <Link href={`/inventory/items/${item.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes {item.name} from the inventory
                    list. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteItem.bind(null, item.id)}>
                    <AlertDialogAction
                      type="submit"
                      variant="destructive"
                      className="w-full"
                    >
                      Delete
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Item code" value={item.item_code} />
          <Detail label="Part number" value={item.part_number} />
          <Detail label="Category" value={item.category?.name} />
          <Detail label="Unit" value={item.unit} />
          <Detail label="Rate" value={item.rate} />
          <Detail
            label="Stock on hand"
            value={
              stockLevel
                ? `${stockLevel.quantity_on_hand} ${item.unit ?? ""}`.trim()
                : `0 ${item.unit ?? ""}`.trim()
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Job Card</TableHead>
                  <TableHead>Vendor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <Link
                        href={`/inventory/transactions/${tx.id}`}
                        className="hover:underline"
                      >
                        {fmtDate(tx.transaction_date)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {TRANSACTION_TYPE_LABEL[tx.transaction_type] ?? tx.transaction_type}
                    </TableCell>
                    <TableCell>{tx.quantity}</TableCell>
                    <TableCell>{tx.rate ?? "—"}</TableCell>
                    <TableCell>{tx.amount ?? "—"}</TableCell>
                    <TableCell>{tx.reference_no ?? "—"}</TableCell>
                    <TableCell>{tx.job_card?.job_card_no ?? "—"}</TableCell>
                    <TableCell>{tx.vendor?.name ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No stock transactions recorded for this item.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
