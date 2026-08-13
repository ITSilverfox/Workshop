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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  pending_with_hr: "outline",
  pending_with_accounts: "outline",
  pending_with_melwyn: "outline",
  jv_creation_pending: "secondary",
  jv_created: "default",
};

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

export default async function FuelClaimsPage(props: PageProps<"/fuel/claims">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const supabase = await createClient();
  let query = supabase
    .from("fuel_expense_claims")
    .select("id, claim_date, ref_no, vendor_name, status, journal_entry_number")
    .order("claim_date", { ascending: false });

  if (q) {
    query = query.or(
      `ref_no.ilike.%${q}%,vendor_name.ilike.%${q}%,journal_entry_number.ilike.%${q}%`
    );
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data: claims, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fuel Expense Claims"
        description="Fuel expense claims submitted for reimbursement or journal entry."
        actions={
          <Button asChild>
            <Link href="/fuel/claims/new">
              <Plus />
              Add Claim
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
                placeholder="Ref no, vendor or journal entry…"
                defaultValue={q}
                className="w-64"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All statuses</option>
                <option value="pending_with_hr">Pending with HR</option>
                <option value="pending_with_accounts">Pending with accounts</option>
                <option value="pending_with_melwyn">Pending with Melwyn</option>
                <option value="jv_creation_pending">JV creation pending</option>
                <option value="jv_created">JV created</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || status ? (
              <Button variant="ghost" asChild>
                <Link href="/fuel/claims">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load claims: {error.message}
            </p>
          ) : claims && claims.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim Date</TableHead>
                  <TableHead>Ref No</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Journal Entry No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">
                      <Link href={`/fuel/claims/${claim.id}`} className="hover:underline">
                        {fmtDate(claim.claim_date)}
                      </Link>
                    </TableCell>
                    <TableCell>{claim.ref_no ?? "—"}</TableCell>
                    <TableCell>{claim.vendor_name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[claim.status] ?? "outline"}
                        className="capitalize"
                      >
                        {claim.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{claim.journal_entry_number ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No claims found{q || status ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
