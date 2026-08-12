import Link from "next/link";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = [
  "fuel",
  "admin",
  "repair",
  "registration",
  "salary",
  "revenue",
  "headcount",
];

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

export default async function ExpensesPage(props: PageProps<"/expenses">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const from = typeof searchParams.from === "string" ? searchParams.from : "";
  const to = typeof searchParams.to === "string" ? searchParams.to : "";

  const supabase = await createClient();
  let query = supabase
    .from("vehicle_expense_ledger")
    .select(
      "id, entry_date, category, amount, quantity, notes, vehicle:vehicles(reg_number), company:companies(name), period:cost_allocation_periods(from_date, to_date)"
    )
    .order("entry_date", { ascending: false });

  if (q) {
    query = query.ilike("notes", `%${q}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (from) {
    query = query.gte("entry_date", from);
  }
  if (to) {
    query = query.lte("entry_date", to);
  }

  const { data: expenses, error } = await query;
  const hasFilters = Boolean(q || category || from || to);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vehicle Expenses"
        description="Ledger of costs recorded against vehicles and companies."
        actions={
          <Button asChild>
            <Link href="/expenses/new">
              <Plus />
              Add Expense
            </Link>
          </Button>
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
                placeholder="Notes…"
                defaultValue={q}
                className="w-48"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={category}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((value) => (
                  <option key={value} value={value} className="capitalize">
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="from" className="text-sm font-medium">
                From
              </label>
              <Input id="from" name="from" type="date" defaultValue={from} className="w-40" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="to" className="text-sm font-medium">
                To
              </label>
              <Input id="to" name="to" type="date" defaultValue={to} className="w-40" />
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {hasFilters ? (
              <Button variant="ghost" asChild>
                <Link href="/expenses">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load expenses: {error.message}
            </p>
          ) : expenses && expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      <Link href={`/expenses/${expense.id}`} className="hover:underline">
                        {fmtDate(expense.entry_date)}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">{expense.category}</TableCell>
                    <TableCell>{expense.vehicle?.reg_number ?? "—"}</TableCell>
                    <TableCell>{expense.company?.name ?? "—"}</TableCell>
                    <TableCell>
                      {expense.period
                        ? `${fmtDate(expense.period.from_date)} – ${fmtDate(expense.period.to_date)}`
                        : "—"}
                    </TableCell>
                    <TableCell>{expense.amount}</TableCell>
                    <TableCell className="max-w-64 truncate">
                      {expense.notes ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No expenses found{hasFilters ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
