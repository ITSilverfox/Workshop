import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteDriver } from "@/app/(app)/drivers/actions";
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

type DriverAddress = { line?: string | null; city?: string | null; country?: string | null };

export default async function DriverDetailPage(props: PageProps<"/drivers/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: driver } = await supabase
    .from("drivers")
    .select("*, company:companies(name)")
    .eq("id", id)
    .maybeSingle();

  if (!driver) {
    notFound();
  }

  const { data: assignedVehicles } = await supabase
    .from("vehicles")
    .select("id, reg_number, vehicle_name, vehicle_status")
    .eq("current_driver_id", id);

  const fullName = [driver.prefix, driver.first_name, driver.last_name, driver.suffix]
    .filter(Boolean)
    .join(" ");
  const address = (driver.address ?? null) as DriverAddress | null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={fullName}
        description={driver.emp_id ? `Employee ID: ${driver.emp_id}` : undefined}
        actions={
          <>
            <Badge className="capitalize">{driver.user_status}</Badge>
            <Button variant="outline" asChild>
              <Link href={`/drivers/${driver.id}/edit`}>
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
                  <AlertDialogTitle>Delete this driver?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes {fullName} from the system. This cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteDriver.bind(null, driver.id)}>
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
          <Detail label="Email" value={driver.email} />
          <Detail label="Phone" value={driver.phone} />
          <Detail label="Date of birth" value={fmtDate(driver.date_of_birth)} />
          <Detail label="Company" value={driver.company?.name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="User type" value={driver.user_type?.replace(/_/g, " ")} />
          <Detail label="Category" value={driver.category?.replace(/_/g, " ")} />
          <Detail label="Driving type" value={driver.driving_type?.replace(/_/g, " ")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>License</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="License number" value={driver.license_number} />
          <Detail label="License class" value={driver.license_class} />
          <Detail label="Issuing state" value={driver.license_state} />
        </CardContent>
      </Card>

      {address && (address.line || address.city || address.country) ? (
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Address line" value={address.line} />
            <Detail label="City" value={address.city} />
            <Detail label="Country" value={address.country} />
          </CardContent>
        </Card>
      ) : null}

      {driver.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{driver.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Assigned Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          {assignedVehicles && assignedVehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reg Number</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Link href={`/vehicles/${vehicle.id}`} className="hover:underline">
                        {vehicle.reg_number}
                      </Link>
                    </TableCell>
                    <TableCell>{vehicle.vehicle_name ?? "—"}</TableCell>
                    <TableCell className="capitalize">{vehicle.vehicle_status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No vehicles currently assigned to this driver.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
