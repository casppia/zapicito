import React from "react";
import "./PanelHeader.scss";
import UserAvatar from "../../components/UserData/UserAvatar";
import UserName from "../../components/UserData/UserName";

import companyData from "../../data/company.json";
import adminData from "../../data/admin.json";

const company_name = companyData.company[0].name;
const admin_name = adminData.admin[0].admins[0].name;

const PanelHeader = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header-company__container">
          <h1 className="header-company__name">{company_name}</h1>
        </div>
        <div className="header-user-info__container">
          <UserName name={admin_name} />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};

export default PanelHeader;
