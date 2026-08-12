"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createVehicle, updateVehicle, type VehicleFormState } from "./actions";
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
import type {
  Vehicle,
  VehicleType,
  VehicleGroup,
  Company,
  Driver,
} from "@/lib/supabase/types";

const VEHICLE_STATUSES = ["active", "archived"];
const ASSIGNMENT_STATUSES = [
  "assigned",
  "unassigned",
  "workshop",
  "staff_vehicle",
  "external",
];
const FUEL_TYPES = ["diesel", "petrol"];
const ODOMETER_UNITS = ["kms", "mi"];
const USER_TYPES = ["management", "staff_personal", "fleet"];
const SOLD_STATUSES = ["sold", "unregistered"];

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

export function VehicleForm({
  vehicle,
  lookups,
}: {
  vehicle?: Vehicle;
  lookups: {
    vehicleTypes: VehicleType[];
    vehicleGroups: VehicleGroup[];
    companies: Company[];
    drivers: Driver[];
  };
}) {
  const initialState: VehicleFormState = { error: null };
  const action = vehicle
    ? updateVehicle.bind(null, vehicle.id)
    : createVehicle;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="reg_number">Registration number</FieldLabel>
            <Input
              id="reg_number"
              name="reg_number"
              defaultValue={vehicle?.reg_number ?? ""}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="vehicle_name">Vehicle name</FieldLabel>
            <Input
              id="vehicle_name"
              name="vehicle_name"
              defaultValue={vehicle?.vehicle_name ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="vehicle_type_id">Type</FieldLabel>
            <Select
              name="vehicle_type_id"
              defaultValue={vehicle?.vehicle_type_id ?? undefined}
            >
              <SelectTrigger id="vehicle_type_id" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {lookups.vehicleTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="vehicle_group_id">Group</FieldLabel>
            <Select
              name="vehicle_group_id"
              defaultValue={vehicle?.vehicle_group_id ?? undefined}
            >
              <SelectTrigger id="vehicle_group_id" className="w-full">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {lookups.vehicleGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="color">Color</FieldLabel>
            <Input id="color" name="color" defaultValue={vehicle?.color ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="year_of_manufacture">Year of manufacture</FieldLabel>
            <Input
              id="year_of_manufacture"
              name="year_of_manufacture"
              type="number"
              defaultValue={vehicle?.year_of_manufacture ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="chassis_number">Chassis number</FieldLabel>
            <Input
              id="chassis_number"
              name="chassis_number"
              defaultValue={vehicle?.chassis_number ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="engine_number">Engine number</FieldLabel>
            <Input
              id="engine_number"
              name="engine_number"
              defaultValue={vehicle?.engine_number ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              step="0.01"
              defaultValue={vehicle?.capacity ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fuel_type">Fuel type</FieldLabel>
            <Select name="fuel_type" defaultValue={vehicle?.fuel_type ?? undefined}>
              <SelectTrigger id="fuel_type" className="w-full">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                {FUEL_TYPES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="odometer_unit">Odometer unit</FieldLabel>
            <Select
              name="odometer_unit"
              defaultValue={vehicle?.odometer_unit ?? "kms"}
            >
              <SelectTrigger id="odometer_unit" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ODOMETER_UNITS.map((value) => (
                  <SelectItem key={value} value={value}>
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
          <CardTitle>Status &amp; Assignment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="vehicle_status">Vehicle status</FieldLabel>
            <Select
              name="vehicle_status"
              defaultValue={vehicle?.vehicle_status ?? "active"}
            >
              <SelectTrigger id="vehicle_status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="assignment_status">Assignment status</FieldLabel>
            <Select
              name="assignment_status"
              defaultValue={vehicle?.assignment_status ?? "unassigned"}
            >
              <SelectTrigger id="assignment_status" className="w-full">
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
            <FieldLabel htmlFor="current_driver_id">Current driver</FieldLabel>
            <Select
              name="current_driver_id"
              defaultValue={vehicle?.current_driver_id ?? undefined}
            >
              <SelectTrigger id="current_driver_id" className="w-full">
                <SelectValue placeholder="Unassigned" />
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
            <FieldLabel htmlFor="allocated_company_id">Allocated company</FieldLabel>
            <Select
              name="allocated_company_id"
              defaultValue={vehicle?.allocated_company_id ?? undefined}
            >
              <SelectTrigger id="allocated_company_id" className="w-full">
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
            <FieldLabel htmlFor="owned_company_id">Owned by company</FieldLabel>
            <Select
              name="owned_company_id"
              defaultValue={vehicle?.owned_company_id ?? undefined}
            >
              <SelectTrigger id="owned_company_id" className="w-full">
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
            <FieldLabel htmlFor="user_type">User type</FieldLabel>
            <Select name="user_type" defaultValue={vehicle?.user_type ?? undefined}>
              <SelectTrigger id="user_type" className="w-full">
                <SelectValue placeholder="Select a user type" />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="sold_status">Sold status</FieldLabel>
            <Select name="sold_status" defaultValue={vehicle?.sold_status ?? undefined}>
              <SelectTrigger id="sold_status" className="w-full">
                <SelectValue placeholder="Not applicable" />
              </SelectTrigger>
              <SelectContent>
                {SOLD_STATUSES.map((value) => (
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
          <CardTitle>Registration &amp; Insurance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="reg_expiry">Registration expiry</FieldLabel>
            <Input
              id="reg_expiry"
              name="reg_expiry"
              type="date"
              defaultValue={toDateInput(vehicle?.reg_expiry)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="adv_permit_no">Advertising permit no.</FieldLabel>
            <Input
              id="adv_permit_no"
              name="adv_permit_no"
              defaultValue={vehicle?.adv_permit_no ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="adv_permit_issue_date">Permit issue date</FieldLabel>
            <Input
              id="adv_permit_issue_date"
              name="adv_permit_issue_date"
              type="date"
              defaultValue={toDateInput(vehicle?.adv_permit_issue_date)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="adv_permit_expiry">Permit expiry</FieldLabel>
            <Input
              id="adv_permit_expiry"
              name="adv_permit_expiry"
              type="date"
              defaultValue={toDateInput(vehicle?.adv_permit_expiry)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="insurance_company">Insurance company</FieldLabel>
            <Input
              id="insurance_company"
              name="insurance_company"
              defaultValue={vehicle?.insurance_company ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="insurance_policy_no">Insurance policy no.</FieldLabel>
            <Input
              id="insurance_policy_no"
              name="insurance_policy_no"
              defaultValue={vehicle?.insurance_policy_no ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="insurance_issue_date">Insurance issue date</FieldLabel>
            <Input
              id="insurance_issue_date"
              name="insurance_issue_date"
              type="date"
              defaultValue={toDateInput(vehicle?.insurance_issue_date)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="insurance_expiry">Insurance expiry</FieldLabel>
            <Input
              id="insurance_expiry"
              name="insurance_expiry"
              type="date"
              defaultValue={toDateInput(vehicle?.insurance_expiry)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Odometer &amp; Service</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="starting_odometer">Starting odometer</FieldLabel>
            <Input
              id="starting_odometer"
              name="starting_odometer"
              type="number"
              defaultValue={vehicle?.starting_odometer ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="last_updated_km">Last updated reading</FieldLabel>
            <Input
              id="last_updated_km"
              name="last_updated_km"
              type="number"
              defaultValue={vehicle?.last_updated_km ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="service_interval_km">Service interval</FieldLabel>
            <Input
              id="service_interval_km"
              name="service_interval_km"
              type="number"
              defaultValue={vehicle?.service_interval_km ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="next_service_km">Next service due (odometer)</FieldLabel>
            <Input
              id="next_service_km"
              name="next_service_km"
              type="number"
              defaultValue={vehicle?.next_service_km ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="last_service_at">Last serviced on</FieldLabel>
            <Input
              id="last_service_at"
              name="last_service_at"
              type="date"
              defaultValue={toDateInput(vehicle?.last_service_at)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="purchase_date">Purchase date</FieldLabel>
            <Input
              id="purchase_date"
              name="purchase_date"
              type="date"
              defaultValue={toDateInput(vehicle?.purchase_date)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="purchase_value">Purchase value</FieldLabel>
            <Input
              id="purchase_value"
              name="purchase_value"
              type="number"
              step="0.01"
              defaultValue={vehicle?.purchase_value ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="net_book_value">Net book value</FieldLabel>
            <Input
              id="net_book_value"
              name="net_book_value"
              type="number"
              step="0.01"
              defaultValue={vehicle?.net_book_value ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="depreciation_pct">Depreciation %</FieldLabel>
            <Input
              id="depreciation_pct"
              name="depreciation_pct"
              type="number"
              step="0.01"
              defaultValue={vehicle?.depreciation_pct ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="batch_number">Batch number</FieldLabel>
            <Input
              id="batch_number"
              name="batch_number"
              defaultValue={vehicle?.batch_number ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keys, GPS &amp; Tags</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field orientation="horizontal">
            <Switch
              id="gps_required"
              name="gps_required"
              defaultChecked={vehicle?.gps_required ?? false}
            />
            <FieldLabel htmlFor="gps_required">GPS required</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="spare_keys_available"
              name="spare_keys_available"
              defaultChecked={vehicle?.spare_keys_available ?? false}
            />
            <FieldLabel htmlFor="spare_keys_available">Spare keys available</FieldLabel>
          </Field>
          <Field>
            <FieldLabel htmlFor="number_of_spare_keys">Number of spare keys</FieldLabel>
            <Input
              id="number_of_spare_keys"
              name="number_of_spare_keys"
              type="number"
              defaultValue={vehicle?.number_of_spare_keys ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="salik_tag_number">Salik tag number</FieldLabel>
            <Input
              id="salik_tag_number"
              name="salik_tag_number"
              defaultValue={vehicle?.salik_tag_number ?? ""}
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
                placeholder="Additional notes about this vehicle…"
                defaultValue={vehicle?.notes ?? ""}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={vehicle ? `/vehicles/${vehicle.id}` : "/vehicles"}>
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : vehicle ? "Save changes" : "Create vehicle"}
        </Button>
      </div>
    </form>
  );
}
