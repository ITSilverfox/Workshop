import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteClaim, deleteClaimLine, addClaimLine } from "@/app/(app)/fuel/claims/actions";
import { getClaimLineFormLookups } from "@/app/(app)/fuel/claims/lookups";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  pending_with_hr: "outline",
  pending_with_accounts: "outline",
  pending_with_melwyn: "outline",
  jv_creation_pending: "secondary",
  jv_created: "default",
};

const FUEL_TYPES = ["diesel", "petrol"];

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

export default async function ClaimDetailPage(props: PageProps<"/fuel/claims/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: claim }, { data: lines }, lookups] = await Promise.all([
    supabase.from("fuel_expense_claims").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("fuel_expense_claim_lines")
      .select(
        "*, account:chart_of_accounts(account_name), company:companies(name), driver:drivers(first_name, last_name)"
      )
      .eq("claim_id", id),
    getClaimLineFormLookups(),
  ]);

  if (!claim) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={claim.ref_no ? `Claim ${claim.ref_no}` : `Claim — ${fmtDate(claim.claim_date)}`}
        description={claim.vendor_name ?? undefined}
        actions={
          <>
            <Badge variant={STATUS_VARIANT[claim.status] ?? "outline"} className="capitalize">
              {claim.status.replace(/_/g, " ")}
            </Badge>
            <Button variant="outline" asChild>
              <Link href={`/fuel/claims/${claim.id}/edit`}>
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
                  <AlertDialogTitle>Delete this claim?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes this claim and its line items. This cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteClaim.bind(null, claim.id)}>
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
          <CardTitle>Claim Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Claim date" value={fmtDate(claim.claim_date)} />
          <Detail label="Reference number" value={claim.ref_no} />
          <Detail label="Vendor name" value={claim.vendor_name} />
          <Detail label="Journal entry number" value={claim.journal_entry_number} />
          <Detail label="Journal ID" value={claim.journal_id} />
          <Detail
            label="Books JV link"
            value={
              claim.books_jv_link ? (
                <a
                  href={claim.books_jv_link}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {claim.books_jv_link}
                </a>
              ) : null
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {lines && lines.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Excl. VAT</TableHead>
                    <TableHead>VAT</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>{line.plate_number_text ?? "—"}</TableCell>
                      <TableCell>
                        {line.driver
                          ? [line.driver.first_name, line.driver.last_name]
                              .filter(Boolean)
                              .join(" ")
                          : "—"}
                      </TableCell>
                      <TableCell>{line.company?.name ?? "—"}</TableCell>
                      <TableCell className="capitalize">{line.fuel_type ?? "—"}</TableCell>
                      <TableCell>{line.unit_price ?? "—"}</TableCell>
                      <TableCell>{line.amount_excl_vat ?? "—"}</TableCell>
                      <TableCell>{line.vat_amount ?? "—"}</TableCell>
                      <TableCell>{line.total_amount ?? "—"}</TableCell>
                      <TableCell>{line.account?.account_name ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <form action={deleteClaimLine.bind(null, claim.id, line.id)}>
                          <Button type="submit" variant="ghost" size="icon" aria-label="Remove line">
                            <Trash2 className="size-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No line items yet.</p>
          )}

          <form
            action={addClaimLine.bind(null, claim.id)}
            className="grid gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Field>
              <FieldLabel htmlFor="plate_number_text">Plate number</FieldLabel>
              <Input id="plate_number_text" name="plate_number_text" />
            </Field>
            <Field>
              <FieldLabel htmlFor="driver_id">Driver</FieldLabel>
              <Select name="driver_id">
                <SelectTrigger id="driver_id" className="w-full">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {[driver.first_name, driver.last_name].filter(Boolean).join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="company_id">Company</FieldLabel>
              <Select name="company_id">
                <SelectTrigger id="company_id" className="w-full">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="fuel_type">Fuel type</FieldLabel>
              <Select name="fuel_type">
                <SelectTrigger id="fuel_type" className="w-full">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((value) => (
                    <SelectItem key={value} value={value} className="capitalize">
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="unit_price">Unit price</FieldLabel>
              <Input id="unit_price" name="unit_price" type="number" step="0.01" />
            </Field>
            <Field>
              <FieldLabel htmlFor="amount_excl_vat">Amount excl. VAT</FieldLabel>
              <Input id="amount_excl_vat" name="amount_excl_vat" type="number" step="0.01" />
            </Field>
            <Field>
              <FieldLabel htmlFor="vat_amount">VAT amount</FieldLabel>
              <Input id="vat_amount" name="vat_amount" type="number" step="0.01" />
            </Field>
            <Field>
              <FieldLabel htmlFor="total_amount">Total amount</FieldLabel>
              <Input id="total_amount" name="total_amount" type="number" step="0.01" />
            </Field>
            <Field>
              <FieldLabel htmlFor="account_id">Chart of accounts</FieldLabel>
              <Select name="account_id">
                <SelectTrigger id="account_id" className="w-full">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Input id="notes" name="notes" />
            </Field>
            <div className="flex items-end">
              <Button type="submit" variant="outline" className="w-full">
                Add line
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
