import React, { useState } from "react";
import { Table, Input, Space, Switch, Modal } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DropdownButton } from "../../../components/Buttons/DropdownButton";
import { SaveNotification } from "../../../components/SaveNotification/SaveNotification";

const CONNECT = "CONNECT";
const DISCONNECT = "DISCONNECT";

export const BranchEditEmployee = ({
  editData,
  editStatus,
  connectAll,
  disconnectAll,
}) => {
  const [searchedText, setSearchedText] = useState("");
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const showModal = (e) => {
    setModalMode(e.key === CONNECT ? CONNECT : DISCONNECT);
    setOpen(editData, true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const onOk = (open) => {
    hideModal();
    setShowSavedAlert(true);
    setTimeout(() => {
      setShowSavedAlert(false);
    }, "2500");

    if (modalMode === CONNECT) {
      connectAll(open);
    }
    if (modalMode === DISCONNECT) {
      disconnectAll(open);
    }
  };

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      width: "5%",
      render: (_, employee) => {
        return (
          <Space size="middle">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onClick={() => {
                setShowSavedAlert(true);
                setTimeout(() => {
                  setShowSavedAlert(false);
                }, "2500");
                editStatus(employee);
              }}
              checked={employee.isActive}
              defaultChecked
            />
          </Space>
        );
      },
    },
    {
      title: "Staff",
      dataIndex: ["name", "surname"],
      width: "10%",
      sortDirections: ["descend", "ascend"],
      render: (_, employee) => {
        return (
          <p style={{ marginBottom: "0" }}>
            {employee.name} {employee.surname}
          </p>
        );
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: [searchedText],
      onFilter: (value, employee) => {
        const name = `${employee.name} ${employee.surname}`;
        return String(name).toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      responsive: ["md"],
      width: "10%",
    },
  ];

  return (
    <>
      <Modal
        title=""
        open={open}
        onOk={() => onOk(open)}
        onCancel={hideModal}
        okText="Yes"
        cancelText="Cancel"
      >
        <p>{`Are you sure you want to ${modalMode} all employees?`}</p>
      </Modal>

      <SaveNotification showSavedAlert={showSavedAlert} />

      <span className="search-and-dropdown__container">
        <Input.Search
          placeholder="Search"
          onSearch={(value) => setSearchedText(value)}
          onChange={(e) => setSearchedText(e.target.value)}
        />
        <DropdownButton section={"employees"} onClick={(e) => showModal(e)} />
      </span>

      <Table
        columns={columns}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        dataSource={editData}
        rowKey="id"
      />
    </>
  );
};
