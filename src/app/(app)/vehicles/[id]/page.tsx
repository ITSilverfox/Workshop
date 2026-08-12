import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteVehicle } from "@/app/(app)/vehicles/actions";
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

export default async function VehicleDetailPage(
  props: PageProps<"/vehicles/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select(
      "*, vehicle_type:vehicle_types(name), vehicle_group:vehicle_groups(name), current_driver:drivers(first_name, last_name), allocated_company:companies!vehicles_allocated_company_id_fkey(name), owned_company:companies!vehicles_owned_company_id_fkey(name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!vehicle) {
    notFound();
  }

  const { data: documents } = await supabase
    .from("vehicle_documents")
    .select("id, doc_type, issued_date, expiry_date, notes")
    .eq("vehicle_id", id)
    .order("expiry_date", { ascending: true });

  const driverName = vehicle.current_driver
    ? [vehicle.current_driver.first_name, vehicle.current_driver.last_name]
        .filter(Boolean)
        .join(" ")
    : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={vehicle.reg_number}
        description={vehicle.vehicle_name ?? undefined}
        actions={
          <>
            <Badge className="capitalize">{vehicle.vehicle_status}</Badge>
            <Badge variant="outline" className="capitalize">
              {vehicle.assignment_status}
            </Badge>
            <Button variant="outline" asChild>
              <Link href={`/vehicles/${vehicle.id}/edit`}>
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
                  <AlertDialogTitle>Delete this vehicle?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes {vehicle.reg_number} from the fleet
                    registry. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteVehicle.bind(null, vehicle.id)}>
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
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Type" value={vehicle.vehicle_type?.name} />
          <Detail label="Group" value={vehicle.vehicle_group?.name} />
          <Detail label="Color" value={vehicle.color} />
          <Detail label="Year of manufacture" value={vehicle.year_of_manufacture} />
          <Detail label="Chassis number" value={vehicle.chassis_number} />
          <Detail label="Engine number" value={vehicle.engine_number} />
          <Detail label="Capacity" value={vehicle.capacity} />
          <Detail label="Fuel type" value={vehicle.fuel_type} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status &amp; Assignment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Current driver" value={driverName} />
          <Detail label="Allocated company" value={vehicle.allocated_company?.name} />
          <Detail label="Owned by company" value={vehicle.owned_company?.name} />
          <Detail label="User type" value={vehicle.user_type} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registration &amp; Insurance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Registration expiry" value={fmtDate(vehicle.reg_expiry)} />
          <Detail label="Advertising permit no." value={vehicle.adv_permit_no} />
          <Detail
            label="Permit issue date"
            value={fmtDate(vehicle.adv_permit_issue_date)}
          />
          <Detail label="Permit expiry" value={fmtDate(vehicle.adv_permit_expiry)} />
          <Detail label="Insurance company" value={vehicle.insurance_company} />
          <Detail label="Insurance policy no." value={vehicle.insurance_policy_no} />
          <Detail
            label="Insurance issue date"
            value={fmtDate(vehicle.insurance_issue_date)}
          />
          <Detail label="Insurance expiry" value={fmtDate(vehicle.insurance_expiry)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Odometer &amp; Service</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail
            label="Starting odometer"
            value={
              vehicle.starting_odometer != null
                ? `${vehicle.starting_odometer} ${vehicle.odometer_unit}`
                : null
            }
          />
          <Detail
            label="Last updated reading"
            value={
              vehicle.last_updated_km != null
                ? `${vehicle.last_updated_km} ${vehicle.odometer_unit}`
                : null
            }
          />
          <Detail label="Service interval" value={vehicle.service_interval_km} />
          <Detail label="Next service due" value={vehicle.next_service_km} />
          <Detail label="Last serviced on" value={fmtDate(vehicle.last_service_at)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Purchase date" value={fmtDate(vehicle.purchase_date)} />
          <Detail label="Purchase value" value={vehicle.purchase_value} />
          <Detail label="Net book value" value={vehicle.net_book_value} />
          <Detail label="Depreciation %" value={vehicle.depreciation_pct} />
          <Detail label="Batch number" value={vehicle.batch_number} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keys, GPS &amp; Tags</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="GPS required" value={vehicle.gps_required ? "Yes" : "No"} />
          <Detail
            label="Spare keys available"
            value={vehicle.spare_keys_available ? "Yes" : "No"}
          />
          <Detail label="Number of spare keys" value={vehicle.number_of_spare_keys} />
          <Detail label="Salik tag number" value={vehicle.salik_tag_number} />
        </CardContent>
      </Card>

      {vehicle.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{vehicle.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents && documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="capitalize">{doc.doc_type}</TableCell>
                    <TableCell>{fmtDate(doc.issued_date)}</TableCell>
                    <TableCell>{fmtDate(doc.expiry_date)}</TableCell>
                    <TableCell>{doc.notes ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No documents on file for this vehicle.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
