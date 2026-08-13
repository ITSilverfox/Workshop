import { PageHeader } from "@/components/page-header";
import { ClaimForm } from "@/app/(app)/fuel/claims/claim-form";

export default function NewClaimPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Fuel Expense Claim" description="Create a new fuel expense claim." />
      <ClaimForm />
    </div>
  );
}
