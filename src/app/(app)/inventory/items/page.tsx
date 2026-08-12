import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getItemFormLookups } from "@/app/(app)/inventory/items/lookups";
import { CategoryManager } from "@/app/(app)/inventory/items/category-manager";
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
import { Card, CardContent } from "@/components/ui/card";

const STATUS_VARIANT: Record<string, "default" | "secondary"> = {
  active: "default",
  inactive: "secondary",
};

export default async function ItemsPage(props: PageProps<"/inventory/items">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";
  const categoryId = typeof searchParams.category === "string" ? searchParams.category : "";

  const supabase = await createClient();
  const lookups = await getItemFormLookups();

  let query = supabase
    .from("items")
    .select("id, item_code, name, part_number, unit, rate, status, category:item_categories(name)")
    .order("name", { ascending: true });

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,item_code.ilike.%${q}%,part_number.ilike.%${q}%`
    );
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data: items, error } = await query;

  const { data: stockLevels } = await supabase
    .from("item_stock_levels")
    .select("item_id, quantity_on_hand");
  const stockByItem = new Map(
    (stockLevels ?? []).map((level) => [level.item_id, level.quantity_on_hand])
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Items"
        description="Inventory master list of parts and supplies."
        actions={
          <>
            <CategoryManager categories={lookups.categories} />
            <Button asChild>
              <Link href="/inventory/items/new">
                <Plus />
                Add Item
              </Link>
            </Button>
          </>
        }
      />

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
                placeholder="Name, code, or part number…"
                defaultValue={q}
                className="w-56"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={categoryId}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All categories</option>
                {lookups.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || status || categoryId ? (
              <Button variant="ghost" asChild>
                <Link href="/inventory/items">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load items: {error.message}
            </p>
          ) : items && items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Qty on Hand</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/inventory/items/${item.id}`}
                        className="hover:underline"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>{item.item_code ?? "—"}</TableCell>
                    <TableCell>{item.category?.name ?? "—"}</TableCell>
                    <TableCell>{item.unit ?? "—"}</TableCell>
                    <TableCell>{item.rate}</TableCell>
                    <TableCell>
                      {stockByItem.get(item.id) ?? 0} {item.unit ?? ""}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[item.status] ?? "outline"}
                        className="capitalize"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No items found{q || status || categoryId ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
