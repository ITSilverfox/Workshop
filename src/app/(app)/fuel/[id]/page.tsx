import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteFuelEntry } from "@/app/(app)/fuel/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function FuelEntryDetailPage(props: PageProps<"/fuel/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("fuel_entries")
    .select("*, vehicle:vehicles(reg_number, vehicle_name), vendor:vendors(name)")
    .eq("id", id)
    .maybeSingle();

  if (!entry) {
    notFound();
  }

  const vehicleLabel = entry.vehicle
    ? entry.vehicle.vehicle_name
      ? `${entry.vehicle.reg_number} — ${entry.vehicle.vehicle_name}`
      : entry.vehicle.reg_number
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Fuel Entry — ${fmtDate(entry.entry_date)}`}
        description={vehicleLabel}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/fuel/${entry.id}/edit`}>
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
                  <AlertDialogTitle>Delete this fuel entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes this fuel entry. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteFuelEntry.bind(null, entry.id)}>
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
          <CardTitle>Entry Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Vehicle" value={vehicleLabel} />
          <Detail label="Entry date" value={fmtDate(entry.entry_date)} />
          <Detail label="Odometer" value={`${entry.odometer_km} km`} />
          <Detail label="Partial fill" value={entry.partial_fill ? "Yes" : "No"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fuel &amp; Cost</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Price per unit" value={entry.price_per_unit} />
          <Detail label="Litres" value={entry.litres} />
          <Detail label="Total amount" value={entry.total_amount} />
          <Detail label="Vendor" value={entry.vendor?.name} />
          <Detail label="Invoice number" value={entry.invoice_number} />
        </CardContent>
      </Card>
    </div>
  );
}
