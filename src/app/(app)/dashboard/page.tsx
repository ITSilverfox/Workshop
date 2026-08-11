import { Car, Users, Wrench, BellRing, FileWarning } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const OPEN_JOB_CARD_STATUSES = [
  "pending",
  "under_inspection",
  "scheduled",
  "wip",
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const in30DaysStr = in30Days.toISOString().slice(0, 10);

  const [
    { count: activeVehicles },
    { count: workshopVehicles },
    { count: unassignedVehicles },
    { count: activeDrivers },
    { count: openJobCards },
    { count: pendingReminders },
    { data: upcomingReminders },
    { data: expiringDocuments },
  ] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("vehicle_status", "active"),
    supabase
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("assignment_status", "workshop"),
    supabase
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("assignment_status", "unassigned"),
    supabase
      .from("drivers")
      .select("id", { count: "exact", head: true })
      .eq("user_status", "active"),
    supabase
      .from("job_cards")
      .select("id", { count: "exact", head: true })
      .in("status", OPEN_JOB_CARD_STATUSES),
    supabase
      .from("reminders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("reminders")
      .select(
        "id, reminder_for, renewal_type, reminder_at, vehicle:vehicles(reg_number)"
      )
      .eq("status", "pending")
      .order("reminder_at", { ascending: true })
      .limit(8),
    supabase
      .from("vehicle_documents")
      .select("id, doc_type, expiry_date, vehicle:vehicles(reg_number)")
      .not("expiry_date", "is", null)
      .lte("expiry_date", in30DaysStr)
      .order("expiry_date", { ascending: true })
      .limit(8),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Fleet, workshop, and reminder overview."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Vehicles" value={activeVehicles ?? 0} icon={Car} />
        <StatCard label="In Workshop" value={workshopVehicles ?? 0} icon={Wrench} />
        <StatCard
          label="Unassigned Vehicles"
          value={unassignedVehicles ?? 0}
          icon={Car}
        />
        <StatCard label="Active Drivers" value={activeDrivers ?? 0} icon={Users} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Open Job Cards" value={openJobCards ?? 0} icon={Wrench} />
        <StatCard
          label="Pending Reminders"
          value={pendingReminders ?? 0}
          icon={BellRing}
        />
        <StatCard
          label="Documents Expiring (30d)"
          value={expiringDocuments?.length ?? 0}
          icon={FileWarning}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingReminders && upcomingReminders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingReminders.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.vehicle?.reg_number ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {r.renewal_type ?? r.reminder_for}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(r.reminder_at), "dd MMM yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No pending reminders.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            {expiringDocuments && expiringDocuments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringDocuments.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.vehicle?.reg_number ?? "—"}</TableCell>
                      <TableCell className="capitalize">{d.doc_type}</TableCell>
                      <TableCell>
                        {d.expiry_date
                          ? format(new Date(d.expiry_date), "dd MMM yyyy")
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nothing expiring in the next 30 days.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
