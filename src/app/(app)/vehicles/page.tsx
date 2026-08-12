import Link from "next/link";
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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  archived: "secondary",
};

const ASSIGNMENT_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  assigned: "default",
  unassigned: "outline",
  workshop: "secondary",
  staff_vehicle: "secondary",
  external: "outline",
};

export default async function VehiclesPage(props: PageProps<"/vehicles">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const supabase = await createClient();
  let query = supabase
    .from("vehicles")
    .select(
      "id, reg_number, vehicle_name, vehicle_status, assignment_status, vehicle_type:vehicle_types(name), current_driver:drivers(first_name, last_name), allocated_company:companies!vehicles_allocated_company_id_fkey(name)"
    )
    .order("reg_number", { ascending: true });

  if (q) {
    query = query.or(`reg_number.ilike.%${q}%,vehicle_name.ilike.%${q}%`);
  }
  if (status) {
    query = query.eq("vehicle_status", status);
  }

  const { data: vehicles, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vehicles"
        description="Fleet registry of all vehicles."
        actions={
          <Button asChild>
            <Link href="/vehicles/new">
              <Plus />
              Add Vehicle
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
                placeholder="Reg number or name…"
                defaultValue={q}
                className="w-56"
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
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || status ? (
              <Button variant="ghost" asChild>
                <Link href="/vehicles">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load vehicles: {error.message}
            </p>
          ) : vehicles && vehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reg Number</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/vehicles/${vehicle.id}`}
                        className="hover:underline"
                      >
                        {vehicle.reg_number}
                      </Link>
                    </TableCell>
                    <TableCell>{vehicle.vehicle_name ?? "—"}</TableCell>
                    <TableCell>{vehicle.vehicle_type?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[vehicle.vehicle_status] ?? "outline"}
                        className="capitalize"
                      >
                        {vehicle.vehicle_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ASSIGNMENT_VARIANT[vehicle.assignment_status] ?? "outline"
                        }
                        className="capitalize"
                      >
                        {vehicle.assignment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vehicle.current_driver
                        ? [
                            vehicle.current_driver.first_name,
                            vehicle.current_driver.last_name,
                          ]
                            .filter(Boolean)
                            .join(" ")
                        : "—"}
                    </TableCell>
                    <TableCell>{vehicle.allocated_company?.name ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No vehicles found{q || status ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
