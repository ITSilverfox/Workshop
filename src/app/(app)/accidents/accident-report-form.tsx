"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createAccidentReport,
  updateAccidentReport,
  type AccidentReportFormState,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Company, Driver, Tables } from "@/lib/supabase/types";

type AccidentReport = Tables<"accident_reports">;
type VehicleOption = { id: string; reg_number: string };

const INCIDENT_TYPES = ["rta_fine", "accident_with_report", "accident_without_report"];
const INSPECTED_BY_OPTIONS = ["technician", "supervisor"];
const POLICE_REPORT_TYPES = ["faulty", "non_faulty"];
const STATUSES = ["pending", "approved"];

function toDateTimeInput(value: string | null | undefined) {
  return value ? value.slice(0, 16) : "";
}

function label(value: string) {
  return value.replace(/_/g, " ");
}

export function AccidentReportForm({
  accidentReport,
  lookups,
}: {
  accidentReport?: AccidentReport;
  lookups: { vehicles: VehicleOption[]; drivers: Driver[]; companies: Company[] };
}) {
  const initialState: AccidentReportFormState = { error: null };
  const action = accidentReport
    ? updateAccidentReport.bind(null, accidentReport.id)
    : createAccidentReport;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Incident</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="incident_type">Incident type</FieldLabel>
            <Select
              name="incident_type"
              defaultValue={accidentReport?.incident_type ?? undefined}
            >
              <SelectTrigger id="incident_type" className="w-full">
                <SelectValue placeholder="Select an incident type" />
              </SelectTrigger>
              <SelectContent>
                {INCIDENT_TYPES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="occurred_at">Occurred at</FieldLabel>
            <Input
              id="occurred_at"
              name="occurred_at"
              type="datetime-local"
              defaultValue={toDateTimeInput(accidentReport?.occurred_at)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              name="location"
              defaultValue={accidentReport?.location ?? ""}
              required
            />
          </Field>
          <Field className="sm:col-span-2 lg:col-span-3">
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              defaultValue={accidentReport?.description ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle &amp; Driver</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="vehicle_id">Vehicle</FieldLabel>
            <Select
              name="vehicle_id"
              defaultValue={accidentReport?.vehicle_id ?? undefined}
            >
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
            <Select name="driver_id" defaultValue={accidentReport?.driver_id ?? undefined}>
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
            <FieldLabel htmlFor="company_id">Company</FieldLabel>
            <Select
              name="company_id"
              defaultValue={accidentReport?.company_id ?? undefined}
            >
              <SelectTrigger id="company_id" className="w-full">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {lookups.companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inspection</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="inspected_by">Inspected by</FieldLabel>
            <Select
              name="inspected_by"
              defaultValue={accidentReport?.inspected_by ?? undefined}
            >
              <SelectTrigger id="inspected_by" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {INSPECTED_BY_OPTIONS.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Police Report</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field orientation="horizontal">
            <Switch
              id="police_report"
              name="police_report"
              defaultChecked={accidentReport?.police_report ?? false}
            />
            <FieldLabel htmlFor="police_report">Police report filed</FieldLabel>
          </Field>
          <Field>
            <FieldLabel htmlFor="police_report_type">Police report type</FieldLabel>
            <Select
              name="police_report_type"
              defaultValue={accidentReport?.police_report_type ?? undefined}
            >
              <SelectTrigger id="police_report_type" className="w-full">
                <SelectValue placeholder="Not applicable" />
              </SelectTrigger>
              <SelectContent>
                {POLICE_REPORT_TYPES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="total_fine">Total fine</FieldLabel>
            <Input
              id="total_fine"
              name="total_fine"
              type="number"
              step="0.01"
              defaultValue={accidentReport?.total_fine ?? ""}
            />
          </Field>
          <Field className="sm:col-span-2 lg:col-span-3">
            <FieldLabel htmlFor="fine_details">Fine details</FieldLabel>
            <Textarea
              id="fine_details"
              name="fine_details"
              defaultValue={accidentReport?.fine_details ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select name="status" defaultValue={accidentReport?.status ?? "pending"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={accidentReport ? `/accidents/${accidentReport.id}` : "/accidents"}>
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : accidentReport ? "Save changes" : "Create report"}
        </Button>
      </div>
    </form>
  );
}
