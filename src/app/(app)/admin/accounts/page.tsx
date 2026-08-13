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
import { AccountForm } from "@/app/(app)/admin/accounts/account-form";
import { deleteAccount } from "@/app/(app)/admin/accounts/actions";

export default async function AccountsPage(props: PageProps<"/admin/accounts">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const type = typeof searchParams.type === "string" ? searchParams.type : "";
  const editId = typeof searchParams.edit === "string" ? searchParams.edit : "";

  const supabase = await createClient();

  let query = supabase.from("chart_of_accounts").select("*").order("account_name");
  if (q) {
    query = query.or(`account_name.ilike.%${q}%,account_code.ilike.%${q}%`);
  }
  if (type) {
    query = query.eq("account_type", type);
  }
  const { data: accounts, error } = await query;

  const { data: editingAccount } = editId
    ? await supabase
        .from("chart_of_accounts")
        .select("*")
        .eq("id", editId)
        .maybeSingle()
    : { data: null };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Chart of Accounts"
        description="Expense accounts used for cost allocation and vehicle expenses."
      />

      <Card>
        <CardHeader>
          <CardTitle>{editingAccount ? "Edit Account" : "Add Account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm account={editingAccount ?? undefined} />
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
                placeholder="Name or code…"
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
                defaultValue={type}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All types</option>
                <option value="cost_of_goods_sold">Cost of goods sold</option>
                <option value="expense">Expense</option>
                <option value="other_expense">Other expense</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || type ? (
              <Button variant="ghost" asChild>
                <Link href="/admin/accounts">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load accounts: {error.message}
            </p>
          ) : accounts && accounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Parent account</TableHead>
                  <TableHead>Admin expense</TableHead>
                  <TableHead className="w-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.account_code ?? "—"}</TableCell>
                    <TableCell className="font-medium">
                      {account.account_name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {account.account_type?.replace(/_/g, " ") ?? "—"}
                    </TableCell>
                    <TableCell>{account.parent_account ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={account.is_admin_expense ? "default" : "outline"}>
                        {account.is_admin_expense ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link href={`/admin/accounts?edit=${account.id}`}>
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
                              <AlertDialogTitle>Delete this account?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes {account.account_name}. This
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <form action={deleteAccount.bind(null, account.id)}>
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
              No accounts found{q || type ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
