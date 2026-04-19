import { type RegisteredRouter, type ValidateLinkOptions } from "@tanstack/react-router";
import {
 BarChart3,
 CandlestickChart,
 History,
 KeyRound,
 LayoutDashboard,
 ShoppingCart,
} from "lucide-react";
import type { LucideIcon } from "@/shared/model/icon.ts";

interface NavItem<TRouter extends RegisteredRouter = RegisteredRouter, TOptions = unknown> {
 icon: LucideIcon;
 label: string;
 linkOptions: ValidateLinkOptions<TRouter, TOptions>;
}

interface NavGroup<TRouter extends RegisteredRouter = RegisteredRouter, TOptions = unknown> {
 groupItems: Array<NavItem<TRouter, TOptions>>;
 groupLabel: string;
}

export const navbarConfig: Array<NavGroup> = [
 {
  groupItems: [
   {
    icon: LayoutDashboard,
    label: "Overview",
    linkOptions: {
     to: "/",
    },
   },
   {
    icon: ShoppingCart,
    label: "Orders",
    linkOptions: {
     to: "/orders",
    },
   },
   {
    icon: CandlestickChart,
    label: "Chart",
    linkOptions: {
     to: "/chart",
    },
   },
   {
    icon: History,
    label: "History",
    linkOptions: {
     to: "/history",
    },
   },
  ],
  groupLabel: "",
 },
 {
  groupItems: [
   {
    icon: KeyRound,
    label: "API Keys",
    linkOptions: { to: "/api-keys" },
   },
   {
    icon: BarChart3,
    label: "Two-Factor",
    linkOptions: { to: "/two-factor" },
   },
  ],
  groupLabel: "Settings",
 },
];
