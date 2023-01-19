import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Card, Collapse, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { EmployeeEditService } from "./EmployeeEditService";
import { EmployeeEditBranch } from "./EmployeeEditBranch";
import PanelBanner from "../../PanelBanner/PanelBanner";
import branchInfo from "../../../data/branch.json";
import serviceInfo from "../../../data/service.json";
import employeeServiceData from "../../../data/employeeService.json";
import employeeBranchData from "../../../data/employeeBranch.json";

const modes = {
  VIEW_EMPLOYEE: "VIEW_EMPLOYEE",
  EDIT_EMPLOYEE: "EDIT_EMPLOYEE",
  EDIT_EMPLOYEE_WORKHOURS: "EDIT_EMPLOYEE_WORKHOURS",
  EDIT_EMPLOYEE_SERVICES: "EDIT_EMPLOYEE_SERVICES",
  EDIT_EMPLOYEE_BRANCHES: "EDIT_EMPLOYEE_BRANCHES",
};

export const EmployeeCard = ({ employeeCardData }) => {
  const { Panel } = Collapse;
  const navigate = useNavigate();
  const white = getComputedStyle(document.documentElement).getPropertyValue(
    "--white"
  );

  const [currentMode, setCurrentMode] = useState(modes.VIEW_EMPLOYEE);

  const getCompanyBranches = branchInfo.reduce((acc, curr) => {
    if (curr.id === employeeCardData.companyID) {
      return curr;
    }
    return acc;
  }, {}).branches;

  const getEmployeeBranches = employeeBranchData
    .reduce((acc, curr) => {
      if (curr.companyID === employeeCardData.companyID) {
        return curr;
      }
      return acc;
    }, {})
    .employees.reduce((acc, curr) => {
      if (curr.employeeID === employeeCardData.id) {
        return curr;
      }
      return acc;
    }, {}).branches;

  const branchesData = getCompanyBranches.reduce((acc, curr) => {
    getEmployeeBranches.map((branch) => {
      if (curr.id === branch.branchID)
        return acc.push({
          ...curr,
          isActive: branch.isActive,
        });
    });
    return acc;
  }, []);

  const getCompanyServices = serviceInfo.reduce((acc, curr) => {
    if (curr.companyID === employeeCardData.companyID) {
      return curr;
    }
    return acc;
  }, {}).services;

  const getEmployeeServices = employeeServiceData
    .reduce((acc, curr) => {
      if (curr.companyID === employeeCardData.companyID) {
        return curr;
      }
      return acc;
    }, {})
    .employees.reduce((acc, curr) => {
      if (curr.employeeID === employeeCardData.id) {
        return curr;
      }
      return acc;
    }, {}).services;

  const servicesData = getCompanyServices.reduce((acc, curr) => {
    getEmployeeServices.map((service) => {
      if (curr.id === service.serviceID)
        return acc.push({
          ...curr,
          isActive: service.isActive,
        });
    });
    return acc;
  }, []);

  const [branchesList, setBranchesList] = useState(branchesData);
  const [servicesList, setServicesList] = useState(servicesData);
  const [editData, setEditData] = useState();

  let resetData = editData;

  let numOfBranches = 0;
  const branches = branchesList.map((branch) => {
    if (branch.isActive) {
      const newId = uuid().slice(0, 6);
      numOfBranches++;
      return <p key={newId}>{branch.name}</p>;
    }
  });

  let numOfServices = 0;
  const services = servicesList.map((service) => {
    if (service.isActive) {
      const newId = uuid().slice(0, 6);
      numOfServices++;
      return (
        <p key={newId}>
          {service.name} ({service.type})
        </p>
      );
    }
  });

  const cancelEdit = () => {
    currentMode === modes.EDIT_EMPLOYEE_SERVICES && setServicesList(resetData);
    currentMode === modes.EDIT_EMPLOYEE_BRANCHES && setBranchesList(resetData);
    setCurrentMode(modes.VIEW_EMPLOYEE);
    navigate(`${employeeCardData.id}/info`);
  };

  const goBack = () => {
    setCurrentMode(modes.VIEW_EMPLOYEE);
    navigate(`${employeeCardData.id}/info`);
  };

  const editStatus = (value) => {
    const list =
      currentMode === modes.EDIT_EMPLOYEE_SERVICES
        ? servicesList
        : currentMode === modes.EDIT_EMPLOYEE_BRANCHES && branchesList;

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
    currentMode === modes.EDIT_EMPLOYEE_SERVICES &&
      setServicesList(updatedStatus);
    currentMode === modes.EDIT_EMPLOYEE_BRANCHES &&
      setBranchesList(updatedStatus);
  };

  //TODO
  const connectAll = () => {
    const list =
      currentMode === modes.EDIT_EMPLOYEE_SERVICES
        ? servicesList
        : currentMode === modes.EDIT_EMPLOYEE_BRANCHES && branchesList;

    const updatedStatus = list.map((el) => {
      if (!el.isActive) {
        return {
          ...el,
          isActive: true,
        };
      }
      return el;
    });

    currentMode === modes.EDIT_EMPLOYEE_SERVICES &&
      setServicesList(updatedStatus);
    currentMode === modes.EDIT_EMPLOYEE_BRANCHES &&
      setBranchesList(updatedStatus);
  };

  const disconnectAll = () => {
    const list =
      currentMode === modes.EDIT_EMPLOYEE_SERVICES
        ? servicesList
        : currentMode === modes.EDIT_EMPLOYEE_BRANCHES && branchesList;

    const updatedStatus = list.map((el) => {
      if (el.isActive) {
        return {
          ...el,
          isActive: false,
        };
      }
      return el;
    });
    currentMode === modes.EDIT_EMPLOYEE_SERVICES &&
      setServicesList(updatedStatus);
    currentMode === modes.EDIT_EMPLOYEE_BRANCHES &&
      setBranchesList(updatedStatus);
  };

  const genExtra = (section, data) => {
    const newId = uuid().slice(0, 6);
    return section === "BRANCHES" ? (
      <EditOutlined
        key={newId}
        onClick={(e) => {
          navigate(`${employeeCardData.id}/info/edit/branch`);
          setCurrentMode(modes.EDIT_EMPLOYEE_BRANCHES);
          setEditData(data);
          e.stopPropagation();
        }}
        style={{ color: white }}
      />
    ) : section === "SERVICES" ? (
      <EditOutlined
        key={newId}
        onClick={(e) => {
          navigate(`${employeeCardData.id}/info/edit/service`);
          setCurrentMode(modes.EDIT_EMPLOYEE_SERVICES);
          setEditData(data);
          e.stopPropagation();
        }}
        style={{ color: white }}
      />
    ) : section === "WORKHOURS" ? (
      <EditOutlined
        key={newId}
        onClick={(e) => {
          navigate(`${employeeCardData.id}/info/edit/employee`);
          setCurrentMode(modes.EDIT_EMPLOYEE_WORKHOURS);
          setEditData(data);
          e.stopPropagation();
        }}
        style={{ color: white }}
      />
    ) : null;
  };

  return (
    <>
      {currentMode === modes.VIEW_EMPLOYEE && (
        <div className="info-card__container">
          <Card
            title={`${employeeCardData.name} ${employeeCardData.surname}`}
            bordered={false}
            style={{
              width: 300,
            }}
          >
            <div className="info-card__content">
              <h4>Status</h4>
              <Tag
                color={numOfBranches !== 0 ? "success" : "error"}
                style={{ marginBottom: "1em" }}
              >
                {numOfBranches !== 0 ? "Active" : "Inactive"}
              </Tag>
            </div>
            <div className="info-card__content">
              <h4>Email</h4>
              <p>{employeeCardData.email}</p>
            </div>
            <div className="info-card__content">
              <h4>Phone</h4>
              <p>{employeeCardData.phone}</p>
            </div>
          </Card>

          <Collapse defaultActiveKey={["0"]} ghost>
            <Panel key="1" header="Work Hours" extra={genExtra("WORKHOURS")}>
              {/* {WorkHours} */}
            </Panel>
            <Panel
              key="2"
              header={`Connected Services (${numOfServices})`}
              extra={genExtra("SERVICES", servicesList)}
              collapsible={!numOfServices ? "disabled" : "enabled"}
            >
              {services}
            </Panel>
            <Panel
              key="3"
              header={`Connected Branches (${numOfBranches})`}
              extra={genExtra("BRANCHES", branchesList)}
              collapsible={!numOfBranches ? "disabled" : "enabled"}
            >
              {branches}
            </Panel>
          </Collapse>
        </div>
      )}

      {currentMode === modes.EDIT_EMPLOYEE_SERVICES ? (
        <>
          <PanelBanner
            title={"Services"}
            text={"Cancel"}
            onClick={() => cancelEdit()}
            onGoBack={() => goBack()}
          />
          <EmployeeEditService
            editData={servicesList}
            editStatus={editStatus}
            connectAll={connectAll}
            disconnectAll={disconnectAll}
          />
        </>
      ) : currentMode === modes.EDIT_EMPLOYEE_BRANCHES ? (
        <>
          <PanelBanner
            title={"Branches"}
            text={"Cancel"}
            onClick={() => cancelEdit()}
            onGoBack={() => goBack()}
          />
          <EmployeeEditBranch
            editData={branchesList}
            editStatus={editStatus}
            connectAll={connectAll}
            disconnectAll={disconnectAll}
          />
        </>
      ) : null}
    </>
  );
};
