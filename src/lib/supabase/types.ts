import type { Database } from "@/lib/supabase/database.types";

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

export type Vehicle = Tables<"vehicles">;
export type Driver = Tables<"drivers">;
export type Company = Tables<"companies">;
export type VehicleType = Tables<"vehicle_types">;
export type VehicleGroup = Tables<"vehicle_groups">;
export type AppUser = Tables<"app_users">;
export type JobCard = Tables<"job_cards">;
export type Reminder = Tables<"reminders">;
