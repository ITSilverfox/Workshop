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

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

export default async function FuelEntriesPage(props: PageProps<"/fuel">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const vehicleId = typeof searchParams.vehicle === "string" ? searchParams.vehicle : "";

  const supabase = await createClient();

  let query = supabase
    .from("fuel_entries")
    .select(
      "id, entry_date, odometer_km, litres, price_per_unit, total_amount, vehicle:vehicles(reg_number, vehicle_name), vendor:vendors(name)"
    )
    .order("entry_date", { ascending: false });

  if (q) {
    query = query.ilike("invoice_number", `%${q}%`);
  }
  if (vehicleId) {
    query = query.eq("vehicle_id", vehicleId);
  }

  const [{ data: entries, error }, { data: vehicleOptions }] = await Promise.all([
    query,
    supabase.from("vehicles").select("id, reg_number").order("reg_number"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fuel Entries"
        description="Fuel fill-up log for fleet vehicles."
        actions={
          <Button asChild>
            <Link href="/fuel/new">
              <Plus />
              Add Fuel Entry
            </Link>
          </Button>
        }
      />

      <FuelSectionNav active="entries" />

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
                placeholder="Invoice number…"
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
                <Link href="/fuel">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load fuel entries: {error.message}
            </p>
          ) : entries && entries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Odometer (km)</TableHead>
                  <TableHead>Litres</TableHead>
                  <TableHead>Price/Unit</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Vendor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      <Link href={`/fuel/${entry.id}`} className="hover:underline">
                        {fmtDate(entry.entry_date)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {entry.vehicle
                        ? entry.vehicle.vehicle_name
                          ? `${entry.vehicle.reg_number} — ${entry.vehicle.vehicle_name}`
                          : entry.vehicle.reg_number
                        : "—"}
                    </TableCell>
                    <TableCell>{entry.odometer_km}</TableCell>
                    <TableCell>{entry.litres ?? "—"}</TableCell>
                    <TableCell>{entry.price_per_unit}</TableCell>
                    <TableCell>{entry.total_amount ?? "—"}</TableCell>
                    <TableCell>{entry.vendor?.name ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No fuel entries found{q || vehicleId ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
