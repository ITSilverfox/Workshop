"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createHandover, updateHandover, type HandoverFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Json } from "@/lib/supabase/database.types";
import type { VehicleHandover, AssignmentLookups } from "./lookups";

const HANDOVER_STATUSES = ["pending", "approved"];

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function jsonToText(value: Json | null | undefined) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export function HandoverForm({
  handover,
  lookups,
}: {
  handover?: VehicleHandover;
  lookups: AssignmentLookups;
}) {
  const initialState: HandoverFormState = { error: null };
  const action = handover ? updateHandover.bind(null, handover.id) : createHandover;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Handover</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="vehicle_id">Vehicle</FieldLabel>
            <Select name="vehicle_id" defaultValue={handover?.vehicle_id ?? undefined}>
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
            <Select name="driver_id" defaultValue={handover?.driver_id ?? undefined}>
              <SelectTrigger id="driver_id" className="w-full">
                <SelectValue placeholder="None" />
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
            <Select name="status" defaultValue={handover?.status ?? "pending"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HANDOVER_STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="handover_date">Handover date</FieldLabel>
            <Input
              id="handover_date"
              name="handover_date"
              type="date"
              defaultValue={toDateInput(handover?.handover_date) || today()}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="handed_over_to">Handed over to</FieldLabel>
            <Input
              id="handed_over_to"
              name="handed_over_to"
              defaultValue={handover?.handed_over_to ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="checked_by">Checked by</FieldLabel>
            <Input
              id="checked_by"
              name="checked_by"
              defaultValue={handover?.checked_by ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="odometer_reading">Odometer reading</FieldLabel>
            <Input
              id="odometer_reading"
              name="odometer_reading"
              type="number"
              defaultValue={handover?.odometer_reading ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condition Checklist</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="front_condition">Front condition</FieldLabel>
            <Input
              id="front_condition"
              name="front_condition"
              defaultValue={handover?.front_condition ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="rear_condition">Rear condition</FieldLabel>
            <Input
              id="rear_condition"
              name="rear_condition"
              defaultValue={handover?.rear_condition ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="left_condition">Left condition</FieldLabel>
            <Input
              id="left_condition"
              name="left_condition"
              defaultValue={handover?.left_condition ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="right_condition">Right condition</FieldLabel>
            <Input
              id="right_condition"
              name="right_condition"
              defaultValue={handover?.right_condition ?? ""}
            />
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="tools_spares_ok"
              name="tools_spares_ok"
              defaultChecked={handover?.tools_spares_ok ?? false}
            />
            <FieldLabel htmlFor="tools_spares_ok">Tools &amp; spares OK</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="keys_ok"
              name="keys_ok"
              defaultChecked={handover?.keys_ok ?? false}
            />
            <FieldLabel htmlFor="keys_ok">Keys OK</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="registration_card_available"
              name="registration_card_available"
              defaultChecked={handover?.registration_card_available ?? false}
            />
            <FieldLabel htmlFor="registration_card_available">
              Registration card available
            </FieldLabel>
          </Field>
          <Field className="sm:col-span-2 lg:col-span-3">
            <FieldLabel htmlFor="other_issues">Other issues</FieldLabel>
            <Textarea
              id="other_issues"
              name="other_issues"
              placeholder="Any other issues noted during the handover…"
              defaultValue={jsonToText(handover?.other_issues)}
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
                placeholder="Additional notes about this handover…"
                defaultValue={handover?.notes ?? ""}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link
            href={
              handover ? `/assignments/handovers/${handover.id}` : "/assignments?tab=handovers"
            }
          >
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : handover ? "Save changes" : "Create handover"}
        </Button>
      </div>
    </form>
  );
}
