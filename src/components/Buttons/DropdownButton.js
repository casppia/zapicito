import React from "react";
import { Dropdown, Menu, Button } from "antd";

export const DropdownButton = ({ section, onClick }) => {
  const menu = (
    <Menu
      onClick={(e) => onClick(e)}
      items={[
        {
          key: "CONNECT",
          label: (
            <Button className="dropdown__btn">Connect all {section}</Button>
          ),
        },
        {
          key: "DISCONNECT",
          label: (
            <Button className="dropdown__btn" danger>
              Disconnect all {section}
            </Button>
          ),
        },
      ]}
    />
  );
  return <Dropdown.Button className="dropdown__trigger" overlay={menu} />;
};
