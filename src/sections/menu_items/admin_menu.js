import React from "react";
import {
  ShopOutlined,
  BranchesOutlined,
  ScissorOutlined,
  TeamOutlined,
  CalendarOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

export const admin_menu_items = [
  {
    key: "company",
    label: "Company",
    icon: ShopOutlined,
  },
  {
    key: "branches",
    label: "Branches",
    icon: BranchesOutlined,
  },
  {
    key: "services",
    label: "Services",
    icon: ScissorOutlined,
  },
  {
    key: "employees",
    label: "Employees",
    icon: TeamOutlined,
  },
  {
    key: "calendar",
    label: "Calendar",
    icon: CalendarOutlined,
  },
  {
    key: "/",
    label: "Sign out",
    icon: PoweroffOutlined,
  },
].map((el) => ({
  key: el.key,
  icon: React.createElement(el.icon),
  label: `${el.label}`,
}));
