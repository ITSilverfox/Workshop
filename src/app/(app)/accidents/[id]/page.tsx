import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteAccidentReport } from "@/app/(app)/accidents/actions";
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

function fmtDateTime(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy, HH:mm") : "—";
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? "—"}</span>
    </div>
  );
}

export default async function AccidentReportDetailPage(
  props: PageProps<"/accidents/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: accidentReport } = await supabase
    .from("accident_reports")
    .select(
      "*, vehicle:vehicles(reg_number, vehicle_name), driver:drivers(first_name, last_name), company:companies(name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!accidentReport) {
    notFound();
  }

  const driverName = accidentReport.driver
    ? [accidentReport.driver.first_name, accidentReport.driver.last_name]
        .filter(Boolean)
        .join(" ")
    : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={accidentReport.location}
        description={accidentReport.vehicle?.reg_number ?? undefined}
        actions={
          <>
            <Badge className="capitalize">{accidentReport.status}</Badge>
            <Button variant="outline" asChild>
              <Link href={`/accidents/${accidentReport.id}/edit`}>
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
                  <AlertDialogTitle>Delete this accident report?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes this accident report. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteAccidentReport.bind(null, accidentReport.id)}>
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
          <CardTitle>Incident</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail
            label="Incident type"
            value={accidentReport.incident_type.replace(/_/g, " ")}
          />
          <Detail label="Occurred at" value={fmtDateTime(accidentReport.occurred_at)} />
          <Detail label="Location" value={accidentReport.location} />
        </CardContent>
        {accidentReport.description ? (
          <CardContent className="pt-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Description</span>
              <span className="text-sm whitespace-pre-wrap">
                {accidentReport.description}
              </span>
            </div>
          </CardContent>
        ) : null}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle &amp; Driver</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Vehicle" value={accidentReport.vehicle?.reg_number} />
          <Detail label="Driver" value={driverName} />
          <Detail label="Company" value={accidentReport.company?.name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inspection</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Inspected by" value={accidentReport.inspected_by} />
          <Detail label="Inspector signature" value={accidentReport.inspector_signature_path} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Police Report</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail
            label="Police report filed"
            value={accidentReport.police_report ? "Yes" : "No"}
          />
          <Detail
            label="Police report type"
            value={accidentReport.police_report_type?.replace(/_/g, " ")}
          />
          <Detail label="Police report file" value={accidentReport.police_report_path} />
          <Detail label="Total fine" value={accidentReport.total_fine} />
        </CardContent>
        {accidentReport.fine_details ? (
          <CardContent className="pt-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Fine details</span>
              <span className="text-sm whitespace-pre-wrap">
                {accidentReport.fine_details}
              </span>
            </div>
          </CardContent>
        ) : null}
      </Card>

      {accidentReport.image_paths && accidentReport.image_paths.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 text-sm">
              {accidentReport.image_paths.map((path) => (
                <li key={path} className="break-all text-muted-foreground">
                  {path}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
