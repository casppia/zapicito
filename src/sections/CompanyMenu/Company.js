/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Space, Table, Modal } from "antd";
import { CompanyForm } from "./CompanyForm";
import { useMode, modes } from "../../ModeContext";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { DeleteNotification } from "../../components/DeleteNotification/DeleteNotification";
import PanelBanner from "../PanelBanner/PanelBanner";
import data from "../../data/company.json";

export const Company = () => {
  const [formMode, setFormMode] = useMode();
  const [editData, setEditData] = useState();
  const [listOfCompanies, setListOfCompanies] = useState(data.company);
  const [open, setOpen] = useState(false);
  const [showDeletedAlert, setShowDeletedAlert] = useState(false);
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const white = getComputedStyle(document.documentElement).getPropertyValue(
    "--white"
  );
  const searchHighlighter = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--search-highlighter");

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

  const showModal = (company) => {
    setOpen(company, true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Company name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...getColumnSearchProps("name"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "15%",
      responsive: ["md"],
      ...getColumnSearchProps("address"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "15%",
      responsive: ["md"],
      ...getColumnSearchProps("phone"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "20%",
      responsive: ["md"],
      ...getColumnSearchProps("description"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, company) => (
        <Space size="middle">
          <a
            onClick={() => {
              openEditForm(company);
              navigate(`${company.id}/edit`);
            }}
            className="action-item__icon"
          >
            <EditOutlined />
          </a>
          <a onClick={() => showModal(company)} className="action-item__icon">
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const addCompany = (newData) => {
    const newListOfCompanies = [...listOfCompanies, newData];
    setListOfCompanies(newListOfCompanies);
  };

  const editCompany = (value) => {
    const updatedListOfCompanies = listOfCompanies.map((obj) => {
      if (obj.id === value.id) {
        return {
          ...obj,
          name: value.name,
          address: value.address,
          phone: value.phone,
          description: value.description,
        };
      }
      return obj;
    });
    setListOfCompanies(updatedListOfCompanies);
  };

  const deleteCompany = (value) => {
    const updatedListOfCompanies = listOfCompanies.filter(
      (company) => company.id !== value.id
    );
    setShowDeletedAlert(true);
    hideModal();
    setListOfCompanies(updatedListOfCompanies);
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
        title="Are you sure you want to delete this company?"
        open={open}
        onOk={() => deleteCompany(open)}
        onCancel={hideModal}
        okText="Yes"
        cancelText="Cancel"
      >
        <p>This action will delete all company data</p>
      </Modal>

      <PanelBanner
        title={
          formMode === modes.VIEW
            ? "Companies"
            : formMode === modes.ADD
            ? "Add New Company"
            : "Edit Company"
        }
        text={formMode === modes.VIEW ? "Add new company" : "Cancel"}
        onClick={() => handleClick()}
      />

      <DeleteNotification
        showDeletedAlert={showDeletedAlert}
        message={"Company Deleted"}
      />

      {formMode === modes.VIEW && (
        <Table
          columns={columns}
          dataSource={listOfCompanies}
          pagination={{ pageSize: 5, hideOnSinglePage: true }}
          rowKey="id"
        />
      )}
      {formMode !== modes.VIEW && (
        <CompanyForm
          addCompany={addCompany}
          editCompany={editCompany}
          formMode={formMode}
          setFormMode={setFormMode}
          editData={editData}
          dataSource={listOfCompanies}
        />
      )}
    </>
  );
};
