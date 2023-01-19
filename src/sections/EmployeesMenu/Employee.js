/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Space, Table, Modal } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { EmployeeForm } from "../EmployeesMenu/EmployeeForm";
import { EmployeeCard } from "./EmployeeCard/EmployeeCard";
import { useMode, modes } from "../../ModeContext";
import PanelBanner from "../PanelBanner/PanelBanner";
import { DeleteNotification } from "../../components/DeleteNotification/DeleteNotification";
import companyData from "../../data/company.json";
import employeeData from "../../data/employee.json";

const getAllEmployees = employeeData.reduce((acc, company) => {
  acc.push(
    ...company.employees.map((employee) => ({
      ...employee,
      companyID: company.companyID,
      company: companyData.company.reduce((acc, curr) => {
        if (curr.id === company.companyID) {
          return curr.name;
        }
        return acc;
      }, {}),
    }))
  );
  return [...acc];
}, []);

export const Employee = () => {
  const [formMode, setFormMode] = useMode();
  const [editData, setEditData] = useState();
  const [listOfEmployees, setListOfEmployees] = useState(getAllEmployees);
  const [employeeCardData, setEmployeeCardData] = useState();
  const [open, setOpen] = useState(false);
  const [showDeletedAlert, setShowDeletedAlert] = useState(false);
  const navigate = useNavigate();

  const white = getComputedStyle(document.documentElement).getPropertyValue(
    "--white"
  );
  const searchHighlighter = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--search-highlighter");

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? white : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        ''
      ) : (
        text
      ),
  });

  const showModal = (employee) => {
    setOpen(employee, true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "10%",
      fixed: "left",
      ...getColumnSearchProps("name"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Last Name",
      dataIndex: "surname",
      width: "10%",
      fixed: "left",
      ...getColumnSearchProps("surname"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.surname.localeCompare(b.surname),
    },
    {
      title: "Company",
      dataIndex: "company",
      responsive: ["md"],
      width: "10%",
      ...getColumnSearchProps("company"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.company.localeCompare(b.company),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      responsive: ["md"],
      width: "15%",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: "10%",
      render: (_, employee) => (
        <Space size="middle">
          <a
            onClick={() => {
              openInfoCard(employee);
              navigate(`${employee.id}/info`);
            }}
            className="action-item__icon"
          >
            <EyeOutlined />
          </a>
          <a
            onClick={() => {
              openEditForm(employee);
              navigate(`${employee.id}/edit`);
            }}
            className="action-item__icon"
          >
            <EditOutlined />
          </a>
          <a onClick={() => showModal(employee)} className="action-item__icon">
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const addEmployee = (newEmployee) => {
    const newListOfEmployees = [...listOfEmployees, newEmployee];
    setListOfEmployees(newListOfEmployees);
  };

  const editEmployee = (value) => {
    const updatedListOfEmployees = listOfEmployees.map((obj) => {
      if (obj.id === value.id) {
        return {
          ...obj,
          company: value.company,
          name: value.name,
          surname: value.surname,
          phone: value.phone,
        };
      }
      return obj;
    });
    setListOfEmployees(updatedListOfEmployees);
  };

  const deleteEmployee = (value) => {
    const updatedListOfEmployees = listOfEmployees.filter(
      (employee) => employee.id !== value.id
    );
    setShowDeletedAlert(true);
    hideModal();
    setListOfEmployees(updatedListOfEmployees);
    setTimeout(() => {
      setShowDeletedAlert(false);
    }, "2000");
  };

  const openAddForm = () => {
    setFormMode(modes.ADD);
  };

  const openEditForm = (value) => {
    setFormMode(modes.EDIT);
    setEditData(value);
  };

  const openInfoCard = (value) => {
    setFormMode(modes.INFO);
    setEmployeeCardData(value);
  };

  const handleClick = () => {
    if (formMode === modes.VIEW) {
      openAddForm();
      navigate("add");
    } else {
      setFormMode(modes.VIEW);
      navigate(-1, { replace: true });
    }
  };

  return (
    <>
      <Modal
        title="Are you sure you want to delete this employee?"
        open={open}
        onOk={() => deleteEmployee(open)}
        onCancel={hideModal}
        okText="Yes"
        cancelText="Cancel"
      >
        <p>This action will delete all employee data</p>
      </Modal>

      {formMode !== modes.INFO && (
        <PanelBanner
          title={
            formMode === modes.VIEW
              ? "Employees"
              : formMode === modes.ADD
              ? "Add New Employee"
              : "Edit Employee"
          }
          text={formMode === modes.VIEW ? "Add new employee" : "Cancel"}
          onClick={() => handleClick()}
        />
      )}

      <DeleteNotification
        showDeletedAlert={showDeletedAlert}
        message={"Employee Deleted"}
      />

      {formMode === modes.VIEW && (
        <Table
          columns={columns}
          pagination={{ pageSize: 5, hideOnSinglePage: true }}
          dataSource={listOfEmployees}
          rowKey="id"
        />
      )}

      {(formMode === modes.EDIT || formMode === modes.ADD) && (
        <EmployeeForm
          addEmployee={addEmployee}
          editEmployee={editEmployee}
          formMode={formMode}
          setFormMode={setFormMode}
          editData={editData}
          listOfEmployees={listOfEmployees}
        />
      )}
      {formMode === modes.INFO && (
        <EmployeeCard employeeCardData={employeeCardData} />
      )}
    </>
  );
};
