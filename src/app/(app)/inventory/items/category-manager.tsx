"use client";

import { useState, useActionState } from "react";
import { Tags, Pencil, Trash2 } from "lucide-react";
import {
  createItemCategory,
  updateItemCategory,
  deleteItemCategory,
  type CategoryFormState,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import type { Tables } from "@/lib/supabase/types";

type ItemCategory = Tables<"item_categories">;

const PURCHASE_TYPES = ["in_stock", "internal", "external"];

function label(value: string) {
  return value.replace(/_/g, " ");
}

function PurchaseTypeSelect({
  id,
  defaultValue,
}: {
  id?: string;
  defaultValue?: string | null;
}) {
  return (
    <Select name="purchase_type" defaultValue={defaultValue ?? undefined}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="Select a purchase type" />
      </SelectTrigger>
      <SelectContent>
        {PURCHASE_TYPES.map((value) => (
          <SelectItem key={value} value={value} className="capitalize">
            {label(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AddCategoryForm() {
  const initialState: CategoryFormState = { error: null };
  const [state, formAction, pending] = useActionState(
    createItemCategory,
    initialState
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-end"
    >
      <Field className="sm:w-40">
        <FieldLabel htmlFor="new_category_name">Name</FieldLabel>
        <Input id="new_category_name" name="name" required />
      </Field>
      <Field className="sm:w-44">
        <FieldLabel htmlFor="new_category_purchase_type">Purchase type</FieldLabel>
        <PurchaseTypeSelect id="new_category_purchase_type" />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add"}
      </Button>
      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}
    </form>
  );
}

function CategoryEditRow({
  category,
  onDone,
}: {
  category: ItemCategory;
  onDone: () => void;
}) {
  const initialState: CategoryFormState = { error: null };
  const [state, formAction, pending] = useActionState(
    updateItemCategory.bind(null, category.id),
    initialState
  );

  return (
    <TableRow>
      <TableCell colSpan={3}>
        <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field className="sm:w-40">
            <FieldLabel htmlFor={`edit_name_${category.id}`}>Name</FieldLabel>
            <Input
              id={`edit_name_${category.id}`}
              name="name"
              defaultValue={category.name}
              required
            />
          </Field>
          <Field className="sm:w-44">
            <FieldLabel htmlFor={`edit_purchase_type_${category.id}`}>
              Purchase type
            </FieldLabel>
            <PurchaseTypeSelect
              id={`edit_purchase_type_${category.id}`}
              defaultValue={category.purchase_type}
            />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onDone}>
              Done
            </Button>
          </div>
          {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}
        </form>
      </TableCell>
    </TableRow>
  );
}

function CategoryRow({
  category,
  onEdit,
}: {
  category: ItemCategory;
  onEdit: () => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell>
        {category.purchase_type ? (
          <Badge variant="outline" className="capitalize">
            {label(category.purchase_type)}
          </Badge>
        ) : (
          "—"
        )}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onEdit}>
            <Pencil />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this category?</AlertDialogTitle>
                <AlertDialogDescription>
                  Items using &ldquo;{category.name}&rdquo; will keep their
                  record but lose this category. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form action={deleteItemCategory.bind(null, category.id)}>
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
  );
}

export function CategoryManager({ categories }: { categories: ItemCategory[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Dialog onOpenChange={(open) => !open && setEditingId(null)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Tags />
          Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Item Categories</DialogTitle>
          <DialogDescription>
            Add, edit, or remove the categories used to classify items.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Purchase type</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) =>
                  editingId === category.id ? (
                    <CategoryEditRow
                      key={category.id}
                      category={category}
                      onDone={() => setEditingId(null)}
                    />
                  ) : (
                    <CategoryRow
                      key={category.id}
                      category={category}
                      onEdit={() => setEditingId(category.id)}
                    />
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-sm text-muted-foreground">
                    No categories yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <AddCategoryForm key={categories.length} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
