import React from "react";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";

export const user_menu_items = [
  {
    label: "My booking",
    icon: CalendarOutlined,
  },
  {
    label: "My Profile",
    icon: UserOutlined,
  },
].map((el, index) => ({
  key: String(index + 1),
  icon: React.createElement(el.icon),
  label: `${el.label}`,
}));
