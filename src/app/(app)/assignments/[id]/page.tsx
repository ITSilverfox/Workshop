import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteAssignment } from "@/app/(app)/assignments/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default async function AssignmentDetailPage(
  props: PageProps<"/assignments/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("vehicle_assignments")
    .select(
      "*, vehicle:vehicles(reg_number, vehicle_name), driver:drivers(first_name, last_name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!assignment) {
    notFound();
  }

  const driverName = assignment.driver
    ? [assignment.driver.first_name, assignment.driver.last_name]
        .filter(Boolean)
        .join(" ")
    : null;

  const hasMedia =
    assignment.front_image_path ||
    assignment.rear_image_path ||
    assignment.left_image_path ||
    assignment.right_image_path ||
    assignment.signature_path;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={assignment.vehicle?.reg_number ?? "Assignment"}
        description={driverName ? `Assigned to ${driverName}` : undefined}
        actions={
          <>
            <Badge className="capitalize">{assignment.status}</Badge>
            <Button variant="outline" asChild>
              <Link href={`/assignments/${assignment.id}/edit`}>
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
                  <AlertDialogTitle>Delete this assignment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes this assignment record. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteAssignment.bind(null, assignment.id)}>
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
          <CardTitle>Assignment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Vehicle" value={assignment.vehicle?.reg_number} />
          <Detail label="Driver" value={driverName} />
          <Detail label="Assigned at" value={fmtDate(assignment.assigned_at)} />
          <Detail label="Unassigned at" value={fmtDate(assignment.unassigned_at)} />
          <Detail label="Assigned by" value={assignment.assigned_by} />
          <Detail label="Unassigned by" value={assignment.unassigned_by} />
          <Detail label="Reason" value={assignment.reason} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Odometer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Starting odometer" value={assignment.starting_odometer} />
          <Detail label="Ending odometer" value={assignment.ending_odometer} />
        </CardContent>
      </Card>

      {assignment.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{assignment.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      {hasMedia ? (
        <Card>
          <CardHeader>
            <CardTitle>Photos &amp; Signature</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Front photo" value={assignment.front_image_path} />
            <Detail label="Rear photo" value={assignment.rear_image_path} />
            <Detail label="Left photo" value={assignment.left_image_path} />
            <Detail label="Right photo" value={assignment.right_image_path} />
            <Detail label="Signature" value={assignment.signature_path} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
