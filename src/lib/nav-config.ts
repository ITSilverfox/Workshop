import type { LucideIcon } from "lucide-react";
import {
  Car,
  Wrench,
  Fuel,
  Wallet,
  Boxes,
  Settings,
} from "lucide-react";

export type NavLink = {
  title: string;
  url: string;
};

export type NavGroup = {
  title: string;
  icon: LucideIcon;
  links: NavLink[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Fleet",
    icon: Car,
    links: [
      { title: "Vehicles", url: "/vehicles" },
      { title: "Drivers", url: "/drivers" },
      { title: "Assignments & Handovers", url: "/assignments" },
    ],
  },
  {
    title: "Workshop",
    icon: Wrench,
    links: [
      { title: "Job Cards", url: "/job-cards" },
      { title: "Accident Reports", url: "/accidents" },
      { title: "Inspections", url: "/inspections" },
    ],
  },
  {
    title: "Fuel & Tolls",
    icon: Fuel,
    links: [
      { title: "Fuel Entries", url: "/fuel" },
      { title: "Fuel Expense Claims", url: "/fuel/claims" },
      { title: "Toll Transactions", url: "/tolls" },
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    links: [
      { title: "Vehicle Expenses", url: "/expenses" },
      { title: "Cost Allocation", url: "/cost-allocation" },
    ],
  },
  {
    title: "Inventory",
    icon: Boxes,
    links: [
      { title: "Items", url: "/inventory/items" },
      { title: "Stock Transactions", url: "/inventory/transactions" },
    ],
  },
  {
    title: "Admin",
    icon: Settings,
    links: [
      { title: "Companies", url: "/admin/companies" },
      { title: "Vendors", url: "/admin/vendors" },
      { title: "Technicians", url: "/admin/technicians" },
      { title: "Chart of Accounts", url: "/admin/accounts" },
      { title: "Users", url: "/admin/users" },
    ],
  },
];

