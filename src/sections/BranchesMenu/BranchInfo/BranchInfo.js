/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Collapse } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { BranchEditWorkHours } from "./BranchEditWorkHours";
import { BranchEditServices } from "./BranchEditServices";
import { BranchEditEmployee } from "./BranchEditEmployee";
import PanelBanner from "../../PanelBanner/PanelBanner";
import employeesInfo from "../../../data/employee.json";
import servicesInfo from "../../../data/service.json";
import branchEmployeesData from "../../../data/branchEmployees.json";
import branchServicesData from "../../../data/branchServices.json";

const modes = {
  VIEW_BRANCH: "VIEW_BRANCH",
  EDIT_BRANCH: "EDIT_BRANCH",
  EDIT_BRANCH_SERVICES: "EDIT_BRANCH_SERVICES",
  EDIT_BRANCH_EMPLOYEES: "EDIT_BRANCH_EMPLOYEES",
  EDIT_BRANCH_WORKHOURS: "EDIT_BRANCH_WORKHOURS",
};

export const BranchInfo = ({ infoCardData }) => {
  const { Panel } = Collapse;
  const navigate = useNavigate();
  const white = getComputedStyle(document.documentElement).getPropertyValue('--white');

  const [currentMode, setCurrentMode] = useState(modes.VIEW_BRANCH);
  const branchCardInfo = infoCardData;

  const getCompanyServices = servicesInfo.reduce((acc, company) => {
    if (company.companyID === branchCardInfo.companyID) return company;
    return acc;
  }, {}).services;

  const getBranchServices = branchServicesData
    .reduce((acc, curr) => {
      if (curr.companyID === branchCardInfo.companyID) return curr;
      return acc;
    }, {})
    .branches.reduce((acc, curr) => {
      if (curr.branchID === branchCardInfo.id) return curr;
      return acc;
    }, {}).services;

  const servicesData = getCompanyServices.reduce((acc, curr) => {
    getBranchServices.map((service) => {
      if (curr.id === service.serviceID)
        return acc.push({
          ...curr,
          isActive: service.isActive,
        });
    });
    return acc;
  }, []);

  const getCompanyEmployees = employeesInfo.reduce((acc, curr) => {
    if (curr.companyID === branchCardInfo.companyID) {
      curr.employees.forEach((employee) => {
        if (employee.branchID.includes(branchCardInfo.id))
          return acc.push(employee);
      });
    }
    return acc;
  }, []);

  const getBranchEmployees = branchEmployeesData
    .reduce((acc, curr) => {
      if (curr.companyID === branchCardInfo.companyID) return curr;
      return acc;
    }, {})
    .branches.reduce((acc, curr) => {
      if (curr.branchID === branchCardInfo.id) return curr;
      return acc;
    }, {}).employees;

  const employeesData = getCompanyEmployees.reduce((acc, curr) => {
    getBranchEmployees.map((employee) => {
      if (curr.id === employee.employeeID)
        return acc.push({
          ...curr,
          isActive: employee.isActive,
        });
    });
    return acc;
  }, []);

  const [employeesList, setEmployeesList] = useState(employeesData);
  const [servicesList, setServicesList] = useState(servicesData);
  const [editData, setEditData] = useState();

  let resetData = editData;

  const branchWorkHours = branchCardInfo.schedule.map((el) => {
    const newId = uuid().slice(0, 6);
    const from = el.from;
    const to = el.to;

    if (from || to) {
      return (
        <div key={newId} className="work-hours__container">
          <h4>{el.day}:</h4>
          <p>
            {from.slice(0, 2)}:{from.slice(2, 4)} -{to.slice(0, 2)}:
            {to.slice(2, 4)}
          </p>
        </div>
      );
    }

    return (
      <div key={newId} className="work-hours__container">
        <h4>{el.day}:</h4>
        <p>Day Off</p>
      </div>
    );
  });

  let numOfServices = 0;
  const services = servicesList?.map((service) => {
    const newId = uuid().slice(0, 6);
    service.isActive && numOfServices++;
    return (
      service.isActive && (
        <p key={newId}>
          {service.name} ({service.type})
        </p>
      )
    );
  });

  let numOfEmployees = 0;
  const employees = employeesList?.map((employee) => {
    const newId = uuid().slice(0, 6);
    employee.isActive && numOfEmployees++;
    return (
      employee.isActive && (
        <p key={newId}>
          <UserOutlined /> {employee.name} {employee.surname}
        </p>
      )
    );
  });

  const cancelEdit = () => {
    currentMode === modes.EDIT_BRANCH_SERVICES && setServicesList(resetData);
    currentMode === modes.EDIT_BRANCH_EMPLOYEES && setEmployeesList(resetData);
    setCurrentMode(modes.VIEW_BRANCH);
    navigate(`${branchCardInfo.id}/info`);
  };

  const goBack = () => {
    setCurrentMode(modes.VIEW_BRANCH);
    navigate(`${branchCardInfo.id}/info`);
  };

  const editStatus = (value) => {
    const list =
    currentMode === modes.EDIT_BRANCH_SERVICES
        ? servicesList
        : currentMode === modes.EDIT_BRANCH_EMPLOYEES && employeesList;

    const updatedStatus = list.map((el) => {
      if (el.id === value.id) {
        return el.isActive
          ? {
              ...el,
              isActive: false,
            }
          : {
              ...el,
              isActive: true,
            };
      }
      return el;
    });
    currentMode === modes.EDIT_BRANCH_SERVICES && setServicesList(updatedStatus);
    currentMode === modes.EDIT_BRANCH_EMPLOYEES && setEmployeesList(updatedStatus);
  };

  const connectAll = () => {
    const list =
    currentMode === modes.EDIT_BRANCH_SERVICES
        ? servicesList
        : currentMode === modes.EDIT_BRANCH_EMPLOYEES && employeesList;

    const updatedStatus = list.map((el) => {
      if (!el.isActive) {
        return {
          ...el,
          isActive: true,
        };
      }
      return el;
    });

    currentMode === modes.EDIT_BRANCH_SERVICES && setServicesList(updatedStatus);
    currentMode === modes.EDIT_BRANCH_EMPLOYEES && setEmployeesList(updatedStatus);
  };

  const disconnectAll = () => {
    const list =
    currentMode === modes.EDIT_BRANCH_SERVICES
        ? servicesList
        : currentMode === modes.EDIT_BRANCH_EMPLOYEES && employeesList;

    const updatedStatus = list.map((el) => {
      if (el.isActive) {
        return {
          ...el,
          isActive: false,
        };
      }
      return el;
    });
    currentMode === modes.EDIT_BRANCH_SERVICES && setServicesList(updatedStatus);
    currentMode === modes.EDIT_BRANCH_EMPLOYEES && setEmployeesList(updatedStatus);
  };


  //TODO too much ? :
  const genExtra = (section, data) => {
    const newId = uuid().slice(0, 6);
    return section === "SCHEDULE" ? (
      <EditOutlined
        key={newId}
        onClick={(e) => {
          navigate(`${branchCardInfo.id}/info/edit/schedule`);
          setCurrentMode(modes.EDIT_BRANCH_WORKHOURS);
          // setEditSchedule(data);
          e.stopPropagation();
        }}
        style={{ color: white }}
      />
    ) : section === "SERVICES" ? (
      <EditOutlined
        key={newId}
        onClick={(e) => {
          navigate(`${branchCardInfo.id}/info/edit/services`);
          setCurrentMode(modes.EDIT_BRANCH_SERVICES);
          setEditData(data);
          e.stopPropagation();
        }}
        style={{ color: white }}
      />
    ) : (
      section === "EMPLOYEES" ? (
        <EditOutlined
          key={newId}
          onClick={(e) => {
            navigate(`${branchCardInfo.id}/info/edit/employee`);
            setCurrentMode(modes.EDIT_BRANCH_EMPLOYEES);
            setEditData(data);
            e.stopPropagation();
          }}
          style={{ color: white }}
        />
        // TODO null
      ) : null
    );
  };

    //TODO too much ? :
  return (
    <>
      {currentMode === modes.VIEW_BRANCH && (
        <div className="info-card__container">
          <Card
            title={branchCardInfo.name}
            bordered={false}
            style={{
              width: 300,
            }}
          >
            <div className="info-card__content">
              <h4>Phone</h4>
              <p>{branchCardInfo.phone}</p>
            </div>
            <div className="info-card__content">
              <h4>Address</h4>
              <p>{branchCardInfo.address}</p>
            </div>
            <div className="info-card__content">
              <h4>Description</h4>
              <p>{branchCardInfo.description}</p>
            </div>
          </Card>

          <Collapse defaultActiveKey={["0"]} ghost>
            <Panel
              key="1"
              header="Work Hours"
              extra={genExtra("SCHEDULE", branchCardInfo.schedule)}
            >
              {branchWorkHours}
            </Panel>
            <Panel
              key="2"
              header={`Services (${numOfServices})`}
              extra={genExtra("SERVICES", servicesList)}
              collapsible={!numOfServices ? "disabled" : "enabled"}
            >
              {services}
            </Panel>
            <Panel
              key="3"
              header={`Staff (${numOfEmployees})`}
              extra={genExtra("EMPLOYEES", employeesList)}
              collapsible={!numOfEmployees ? "disabled" : "enabled"}
            >
              {employees}
            </Panel>
          </Collapse>
        </div>
      )}

      {currentMode === modes.EDIT_BRANCH_WORKHOURS ? (
          <>
            <PanelBanner
              title={"Schedule"}
              text={"Cancel"}
              onClick={() => cancelEdit()}
            />
            <BranchEditWorkHours />
          </>
        ) : currentMode === modes.EDIT_BRANCH_SERVICES ? (
          <>
            <PanelBanner
              title={"Services"}
              text={"Cancel"}
              onClick={() => cancelEdit()}
              onGoBack={() => goBack()}
            />
            <BranchEditServices
              editData={servicesList}
              editStatus={editStatus}
              connectAll={connectAll}
              disconnectAll={disconnectAll}
            />
          </>
        ) : currentMode === modes.EDIT_BRANCH_EMPLOYEES ? (
          <>
            <PanelBanner
              title={"Employees"}
              text={"Cancel"}
              onClick={() => cancelEdit()}
              onGoBack={() => goBack()}
            />
            <BranchEditEmployee
              editData={employeesList}
              editStatus={editStatus}
              connectAll={connectAll}
              disconnectAll={disconnectAll}
            />
          </>
        ): null }
    </>
  );
};