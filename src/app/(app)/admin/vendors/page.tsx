import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { VendorForm } from "@/app/(app)/admin/vendors/vendor-form";
import { deleteVendor } from "@/app/(app)/admin/vendors/actions";

export default async function VendorsPage(props: PageProps<"/admin/vendors">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const vendorType = typeof searchParams.type === "string" ? searchParams.type : "";
  const editId = typeof searchParams.edit === "string" ? searchParams.edit : "";

  const supabase = await createClient();

  let query = supabase.from("vendors").select("*").order("name");
  if (q) {
    query = query.or(`name.ilike.%${q}%,contact_person.ilike.%${q}%`);
  }
  if (vendorType) {
    query = query.eq("vendor_type", vendorType);
  }
  const { data: vendors, error } = await query;

  const { data: editingVendor } = editId
    ? await supabase.from("vendors").select("*").eq("id", editId).maybeSingle()
    : { data: null };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vendors"
        description="Fuel and service vendors used for workshop and fuel records."
      />

      <Card>
        <CardHeader>
          <CardTitle>{editingVendor ? "Edit Vendor" : "Add Vendor"}</CardTitle>
        </CardHeader>
        <CardContent>
          <VendorForm vendor={editingVendor ?? undefined} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3" method="get">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="q" className="text-sm font-medium">
                Search
              </label>
              <Input
                id="q"
                name="q"
                placeholder="Name or contact…"
                defaultValue={q}
                className="w-56"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="type"
                name="type"
                defaultValue={vendorType}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All types</option>
                <option value="fuel">Fuel</option>
                <option value="service">Service</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || vendorType ? (
              <Button variant="ghost" asChild>
                <Link href="/admin/vendors">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load vendors: {error.message}
            </p>
          ) : vendors && vendors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {vendor.vendor_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{vendor.contact_person ?? "—"}</TableCell>
                    <TableCell>{vendor.phone ?? "—"}</TableCell>
                    <TableCell>{vendor.email ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link href={`/admin/vendors?edit=${vendor.id}`}>
                            <Pencil />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Trash2 />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this vendor?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes {vendor.name}. This cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <form action={deleteVendor.bind(null, vendor.id)}>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No vendors found{q || vendorType ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
