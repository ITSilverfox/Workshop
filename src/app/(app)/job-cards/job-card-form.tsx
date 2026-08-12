"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createJobCard, updateJobCard, type JobCardFormState } from "./actions";
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
import type { Company, Driver, JobCard, Tables } from "@/lib/supabase/types";

type Technician = Tables<"technicians">;
type VehicleOption = { id: string; reg_number: string };

const TYPE_OF_SERVICE_OPTIONS = [
  "car_service",
  "car_service_repair",
  "car_repair",
  "car_inspection",
  "rta",
  "tool_repair",
  "pump_repair",
  "robot_repair",
  "heater_repair",
  "lights",
  "other",
];
const SERVICE_TYPE_KM_OPTIONS = ["5000", "7000", "10000"];
const JOB_CARD_STATUSES = [
  "pending",
  "under_inspection",
  "scheduled",
  "wip",
  "completed",
  "cancelled",
  "discarded",
  "returned_to_client",
];
const RTA_STATUSES = ["inspection", "rta_passing", "detailing", "close_the_jc"];
const RTA_PASSING_TYPES = ["update_color", "renewal"];
const ACCOUNTS_SUBMITTED_STATUSES = ["pending", "submitted", "approved", "rejected"];

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

function toDateTimeInput(value: string | null | undefined) {
  return value ? value.slice(0, 16) : "";
}

function label(value: string) {
  return value.replace(/_/g, " ");
}

export function JobCardForm({
  jobCard,
  lookups,
}: {
  jobCard?: JobCard;
  lookups: {
    vehicles: VehicleOption[];
    companies: Company[];
    drivers: Driver[];
    technicians: Technician[];
  };
}) {
  const initialState: JobCardFormState = { error: null };
  const action = jobCard ? updateJobCard.bind(null, jobCard.id) : createJobCard;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="vehicle_id">Vehicle</FieldLabel>
            <Select name="vehicle_id" defaultValue={jobCard?.vehicle_id ?? undefined}>
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
            <FieldLabel htmlFor="company_id">Company</FieldLabel>
            <Select name="company_id" defaultValue={jobCard?.company_id ?? undefined}>
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
          <Field>
            <FieldLabel htmlFor="customer_name">Customer name</FieldLabel>
            <Input
              id="customer_name"
              name="customer_name"
              defaultValue={jobCard?.customer_name ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="type_of_service">Type of service</FieldLabel>
            <Select
              name="type_of_service"
              defaultValue={jobCard?.type_of_service ?? undefined}
            >
              <SelectTrigger id="type_of_service" className="w-full">
                <SelectValue placeholder="Select a service type" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OF_SERVICE_OPTIONS.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="service_type_km">Service interval (km)</FieldLabel>
            <Select
              name="service_type_km"
              defaultValue={jobCard?.service_type_km ?? undefined}
            >
              <SelectTrigger id="service_type_km" className="w-full">
                <SelectValue placeholder="Not applicable" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPE_KM_OPTIONS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="serial_number">Serial number</FieldLabel>
            <Input
              id="serial_number"
              name="serial_number"
              defaultValue={jobCard?.serial_number ?? ""}
            />
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="is_internal"
              name="is_internal"
              defaultChecked={jobCard?.is_internal ?? true}
            />
            <FieldLabel htmlFor="is_internal">Internal job</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="under_warranty"
              name="under_warranty"
              defaultChecked={jobCard?.under_warranty ?? false}
            />
            <FieldLabel htmlFor="under_warranty">Under warranty</FieldLabel>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>People</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="requested_by">Requested by (driver)</FieldLabel>
            <Select name="requested_by" defaultValue={jobCard?.requested_by ?? undefined}>
              <SelectTrigger id="requested_by" className="w-full">
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
            <FieldLabel htmlFor="driver_name_text">Driver name (free text)</FieldLabel>
            <Input
              id="driver_name_text"
              name="driver_name_text"
              defaultValue={jobCard?.driver_name_text ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="technician_received_id">Technician received</FieldLabel>
            <Select
              name="technician_received_id"
              defaultValue={jobCard?.technician_received_id ?? undefined}
            >
              <SelectTrigger id="technician_received_id" className="w-full">
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                {lookups.technicians.map((technician) => (
                  <SelectItem key={technician.id} value={technician.id}>
                    {technician.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="technician_inspected_id">Technician inspected</FieldLabel>
            <Select
              name="technician_inspected_id"
              defaultValue={jobCard?.technician_inspected_id ?? undefined}
            >
              <SelectTrigger id="technician_inspected_id" className="w-full">
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                {lookups.technicians.map((technician) => (
                  <SelectItem key={technician.id} value={technician.id}>
                    {technician.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status &amp; Workflow</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select name="status" defaultValue={jobCard?.status ?? "pending"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_CARD_STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="accounts_submitted">Accounts submitted</FieldLabel>
            <Select
              name="accounts_submitted"
              defaultValue={jobCard?.accounts_submitted ?? "pending"}
            >
              <SelectTrigger id="accounts_submitted" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNTS_SUBMITTED_STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="rta_status">RTA status</FieldLabel>
            <Select name="rta_status" defaultValue={jobCard?.rta_status ?? undefined}>
              <SelectTrigger id="rta_status" className="w-full">
                <SelectValue placeholder="Not applicable" />
              </SelectTrigger>
              <SelectContent>
                {RTA_STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="rta_passing_type">RTA passing type</FieldLabel>
            <Select
              name="rta_passing_type"
              defaultValue={jobCard?.rta_passing_type ?? undefined}
            >
              <SelectTrigger id="rta_passing_type" className="w-full">
                <SelectValue placeholder="Not applicable" />
              </SelectTrigger>
              <SelectContent>
                {RTA_PASSING_TYPES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field className="sm:col-span-2 lg:col-span-3">
            <FieldLabel htmlFor="cancellation_reason">Cancellation reason</FieldLabel>
            <Textarea
              id="cancellation_reason"
              name="cancellation_reason"
              defaultValue={jobCard?.cancellation_reason ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="service_req_date">Service requested date</FieldLabel>
            <Input
              id="service_req_date"
              name="service_req_date"
              type="date"
              defaultValue={toDateInput(jobCard?.service_req_date)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="scheduled_date">Scheduled date</FieldLabel>
            <Input
              id="scheduled_date"
              name="scheduled_date"
              type="date"
              defaultValue={toDateInput(jobCard?.scheduled_date)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="due_date">Due date</FieldLabel>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              defaultValue={toDateInput(jobCard?.due_date)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="time_in">Time in</FieldLabel>
            <Input
              id="time_in"
              name="time_in"
              type="datetime-local"
              defaultValue={toDateTimeInput(jobCard?.time_in)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="time_out">Time out</FieldLabel>
            <Input
              id="time_out"
              name="time_out"
              type="datetime-local"
              defaultValue={toDateTimeInput(jobCard?.time_out)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="completed_at">Completed at</FieldLabel>
            <Input
              id="completed_at"
              name="completed_at"
              type="datetime-local"
              defaultValue={toDateTimeInput(jobCard?.completed_at)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Odometer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="current_reading_km">Current reading (km)</FieldLabel>
            <Input
              id="current_reading_km"
              name="current_reading_km"
              type="number"
              defaultValue={jobCard?.current_reading_km ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="last_serviced_km">Last serviced (km)</FieldLabel>
            <Input
              id="last_serviced_km"
              name="last_serviced_km"
              type="number"
              defaultValue={jobCard?.last_serviced_km ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="next_service_km">Next service due (km)</FieldLabel>
            <Input
              id="next_service_km"
              name="next_service_km"
              type="number"
              defaultValue={jobCard?.next_service_km ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issue &amp; Remarks</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="issue_description">Issue description</FieldLabel>
            <Textarea
              id="issue_description"
              name="issue_description"
              defaultValue={jobCard?.issue_description ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="action_taken">Action taken</FieldLabel>
            <Textarea
              id="action_taken"
              name="action_taken"
              defaultValue={jobCard?.action_taken ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="further_remarks">Further remarks</FieldLabel>
            <Textarea
              id="further_remarks"
              name="further_remarks"
              defaultValue={jobCard?.further_remarks ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice &amp; Financials</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="invoice_number">Invoice number</FieldLabel>
            <Input
              id="invoice_number"
              name="invoice_number"
              defaultValue={jobCard?.invoice_number ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="invoice_date">Invoice date</FieldLabel>
            <Input
              id="invoice_date"
              name="invoice_date"
              type="date"
              defaultValue={toDateInput(jobCard?.invoice_date)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="labor_amount">Labor amount</FieldLabel>
            <Input
              id="labor_amount"
              name="labor_amount"
              type="number"
              step="0.01"
              defaultValue={jobCard?.labor_amount ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="parts_amount">Parts amount</FieldLabel>
            <Input
              id="parts_amount"
              name="parts_amount"
              type="number"
              step="0.01"
              defaultValue={jobCard?.parts_amount ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="tax_amount">Tax amount</FieldLabel>
            <Input
              id="tax_amount"
              name="tax_amount"
              type="number"
              step="0.01"
              defaultValue={jobCard?.tax_amount ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="total_amount">Total amount</FieldLabel>
            <Input
              id="total_amount"
              name="total_amount"
              type="number"
              step="0.01"
              defaultValue={jobCard?.total_amount ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={jobCard ? `/job-cards/${jobCard.id}` : "/job-cards"}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : jobCard ? "Save changes" : "Create job card"}
        </Button>
      </div>
    </form>
  );
}
