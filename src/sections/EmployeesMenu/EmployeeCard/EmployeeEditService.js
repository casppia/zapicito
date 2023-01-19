import React, { useState } from "react";
import { Table, Input, Space, Switch, Modal } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DropdownButton } from "../../../components/Buttons/DropdownButton";
import { SaveNotification } from "../../../components/SaveNotification/SaveNotification";

const CONNECT = "CONNECT";
const DISCONNECT = "DISCONNECT";

export const EmployeeEditService = ({
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
      render: (_, service) => {
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
                editStatus(service);
              }}
              checked={service.isActive}
              defaultChecked
            />
          </Space>
        );
      },
    },
    {
      title: "Service Name",
      dataIndex: ["name", "surname"],
      width: "10%",
      sortDirections: ["descend", "ascend"],
      render: (_, service) => {
        return (
          <p style={{ marginBottom: "0" }}>
            {service.name} {service.surname}
          </p>
        );
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: [searchedText],
      onFilter: (value, service) => {
        const name = `${service.name} ${service.surname}`;
        return String(name).toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Type",
      dataIndex: "type",
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
        <p>{`Are you sure you want to ${modalMode} all services?`}</p>
      </Modal>

      <SaveNotification showSavedAlert={showSavedAlert} />

      <span className="search-and-dropdown__container">
        <Input.Search
          placeholder="Search"
          onSearch={(value) => setSearchedText(value)}
          onChange={(e) => setSearchedText(e.target.value)}
        />
        <DropdownButton section={"services"} onClick={(e) => showModal(e)} />
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
