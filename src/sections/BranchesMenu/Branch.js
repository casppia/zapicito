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
import { useMode, modes } from "../../ModeContext";
import { BranchForm } from "../BranchesMenu/BranchForm";
import { BranchInfo } from "./BranchInfo/BranchInfo";
import { DeleteNotification } from "../../components/DeleteNotification/DeleteNotification";
import PanelBanner from "../PanelBanner/PanelBanner";
import branchData from "../../data/branch.json";
import companyData from "../../data/company.json";

const data = branchData[0].branches.map((branch) => ({
  id: branch.id,
  name: branch.name,
  address: branch.address,
  phone: branch.phone,
  description: branch.description,
  schedule: branch.schedule,
  companyID: branch.companyID,
  company: companyData.company.reduce((acc, company) => {
    if (company.id === branch.companyID) {
      return company.name;
    }
    return acc;
  }, {}),
}));

export const Branch = () => {
  const [formMode, setFormMode] = useMode();
  const [editData, setEditData] = useState();
  const [listOfBranches, setListOfBranches] = useState(data);
  const [infoCardData, setInfoCardData] = useState();
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

  const showModal = (branch) => {
    setOpen(branch, true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Branch Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      fixed: "left",
      ...getColumnSearchProps("name"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      responsive: ["md"],
      width: "15%",
      ...getColumnSearchProps("address"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      responsive: ["md"],
      width: "15%",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["md"],
      width: "20%",
      ...getColumnSearchProps("description"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: "10%",
      render: (_, branch) => (
        <Space size="middle">
          <a
            onClick={() => {
              openInfoCard(branch);
              navigate(`${branch.id}/info`);
            }}
            className="action-item__icon"
          >
            <EyeOutlined />
          </a>
          <a
            onClick={() => {
              openEditForm(branch);
              navigate(`${branch.id}/edit`);
            }}
            className="action-item__icon"
          >
            <EditOutlined />
          </a>
          <a onClick={() => showModal(branch)} className="action-item__icon">
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const addBranch = (newBranch) => {
    const newListOfBranches = [...listOfBranches, newBranch];
    setListOfBranches(newListOfBranches);
  };

  const editBranch = (value) => {
    const updatedListOfBranches = listOfBranches.map((obj) => {
      if (obj.id === value.id) {
        return {
          ...obj,
          company: value.company,
          name: value.name,
          address: value.address,
          phone: value.phone,
          description: value.description,
        };
      }
      return obj;
    });
    setListOfBranches(updatedListOfBranches);
  };

  const deleteBranch = (value) => {
    const updatedListOfBranches = listOfBranches.filter(
      (branch) => branch.id !== value.id
    );
    setShowDeletedAlert(true);
    hideModal();
    setListOfBranches(updatedListOfBranches);
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
    setInfoCardData(value);
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
        title="Are you sure you want to delete this branch?"
        open={open}
        onOk={() => deleteBranch(open)}
        onCancel={hideModal}
        okText="Yes"
        cancelText="Cancel"
      >
        <p>This action will delete all branch data</p>
      </Modal>

      {formMode !== modes.INFO && (
        <PanelBanner
          title={
            formMode === modes.VIEW
              ? "Branches"
              : formMode === modes.ADD
              ? "Add New Branch"
              : "Edit Branch"
          }
          text={formMode === modes.VIEW ? "Add new branch" : "Cancel"}
          onClick={() => handleClick()}
        />
      )}

      <DeleteNotification
        showDeletedAlert={showDeletedAlert}
        message={"Branch Deleted"}
      />

      {formMode === modes.VIEW && (
        <Table
          columns={columns}
          pagination={{ pageSize: 5, hideOnSinglePage: true }}
          dataSource={listOfBranches}
          rowKey="id"
        />
      )}

      {formMode === modes.EDIT ? (
        <BranchForm
          addBranch={addBranch}
          editBranch={editBranch}
          formMode={formMode}
          setFormMode={setFormMode}
          editData={editData}
          listOfBranches={listOfBranches}
        />
      ) : (
        formMode === modes.ADD && (
          <BranchForm
            addBranch={addBranch}
            editBranch={editBranch}
            formMode={formMode}
            setFormMode={setFormMode}
            editData={editData}
            listOfBranches={listOfBranches}
          />
        )
      )}
      {formMode === modes.INFO && <BranchInfo infoCardData={infoCardData} />}
    </>
  );
};
