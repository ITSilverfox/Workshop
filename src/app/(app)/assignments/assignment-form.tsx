"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createAssignment, updateAssignment, type AssignmentFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VehicleAssignment, AssignmentLookups } from "./lookups";

const ASSIGNMENT_STATUSES = ["active", "ended"];

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function AssignmentForm({
  assignment,
  lookups,
}: {
  assignment?: VehicleAssignment;
  lookups: AssignmentLookups;
}) {
  const initialState: AssignmentFormState = { error: null };
  const action = assignment
    ? updateAssignment.bind(null, assignment.id)
    : createAssignment;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Assignment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="vehicle_id">Vehicle</FieldLabel>
            <Select name="vehicle_id" defaultValue={assignment?.vehicle_id ?? undefined}>
              <SelectTrigger id="vehicle_id" className="w-full">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {lookups.vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.reg_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="driver_id">Driver</FieldLabel>
            <Select name="driver_id" defaultValue={assignment?.driver_id ?? undefined}>
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
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select name="status" defaultValue={assignment?.status ?? "active"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNMENT_STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="assigned_at">Assigned at</FieldLabel>
            <Input
              id="assigned_at"
              name="assigned_at"
              type="date"
              defaultValue={toDateInput(assignment?.assigned_at) || today()}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="unassigned_at">Unassigned at</FieldLabel>
            <Input
              id="unassigned_at"
              name="unassigned_at"
              type="date"
              defaultValue={toDateInput(assignment?.unassigned_at)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="assigned_by">Assigned by</FieldLabel>
            <Input
              id="assigned_by"
              name="assigned_by"
              defaultValue={assignment?.assigned_by ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="unassigned_by">Unassigned by</FieldLabel>
            <Input
              id="unassigned_by"
              name="unassigned_by"
              defaultValue={assignment?.unassigned_by ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="reason">Reason</FieldLabel>
            <Input id="reason" name="reason" defaultValue={assignment?.reason ?? ""} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Odometer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="starting_odometer">Starting odometer</FieldLabel>
            <Input
              id="starting_odometer"
              name="starting_odometer"
              type="number"
              defaultValue={assignment?.starting_odometer ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="ending_odometer">Ending odometer</FieldLabel>
            <Input
              id="ending_odometer"
              name="ending_odometer"
              type="number"
              defaultValue={assignment?.ending_odometer ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Textarea
                name="notes"
                placeholder="Additional notes about this assignment…"
                defaultValue={assignment?.notes ?? ""}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={assignment ? `/assignments/${assignment.id}` : "/assignments"}>
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : assignment ? "Save changes" : "Create assignment"}
        </Button>
      </div>
    </form>
  );
}
