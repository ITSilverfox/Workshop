import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteHandover } from "@/app/(app)/assignments/actions";
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
import type { Json } from "@/lib/supabase/database.types";

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

function fmtBool(value: boolean | null | undefined) {
  if (value == null) return "—";
  return value ? "Yes" : "No";
}

function jsonToText(value: Json | null | undefined) {
  if (value == null) return null;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? "—"}</span>
    </div>
  );
}

export default async function HandoverDetailPage(
  props: PageProps<"/assignments/handovers/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: handover } = await supabase
    .from("vehicle_handovers")
    .select(
      "*, vehicle:vehicles(reg_number, vehicle_name), driver:drivers(first_name, last_name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!handover) {
    notFound();
  }

  const driverName = handover.driver
    ? [handover.driver.first_name, handover.driver.last_name].filter(Boolean).join(" ")
    : null;

  const hasMedia =
    handover.front_image_path ||
    handover.rear_image_path ||
    handover.left_image_path ||
    handover.right_image_path ||
    handover.driver_signature_path ||
    handover.inspector_signature_path;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={handover.vehicle?.reg_number ?? "Handover"}
        description={`Handover on ${fmtDate(handover.handover_date)}`}
        actions={
          <>
            <Badge className="capitalize">{handover.status}</Badge>
            <Button variant="outline" asChild>
              <Link href={`/assignments/handovers/${handover.id}/edit`}>
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
                  <AlertDialogTitle>Delete this handover?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes this handover record. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteHandover.bind(null, handover.id)}>
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
          <CardTitle>Handover</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Vehicle" value={handover.vehicle?.reg_number} />
          <Detail label="Driver" value={driverName} />
          <Detail label="Handed over to" value={handover.handed_over_to} />
          <Detail label="Checked by" value={handover.checked_by} />
          <Detail label="Handover date" value={fmtDate(handover.handover_date)} />
          <Detail label="Odometer reading" value={handover.odometer_reading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condition Checklist</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Front condition" value={handover.front_condition} />
          <Detail label="Rear condition" value={handover.rear_condition} />
          <Detail label="Left condition" value={handover.left_condition} />
          <Detail label="Right condition" value={handover.right_condition} />
          <Detail label="Tools & spares OK" value={fmtBool(handover.tools_spares_ok)} />
          <Detail label="Keys OK" value={fmtBool(handover.keys_ok)} />
          <Detail
            label="Registration card available"
            value={fmtBool(handover.registration_card_available)}
          />
          <Detail label="Other issues" value={jsonToText(handover.other_issues)} />
        </CardContent>
      </Card>

      {handover.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{handover.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      {hasMedia ? (
        <Card>
          <CardHeader>
            <CardTitle>Photos &amp; Signatures</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Front photo" value={handover.front_image_path} />
            <Detail label="Rear photo" value={handover.rear_image_path} />
            <Detail label="Left photo" value={handover.left_image_path} />
            <Detail label="Right photo" value={handover.right_image_path} />
            <Detail label="Driver signature" value={handover.driver_signature_path} />
            <Detail
              label="Inspector signature"
              value={handover.inspector_signature_path}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
