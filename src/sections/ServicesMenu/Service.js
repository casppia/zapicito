/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Space, Table, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ServiceForm } from "./ServiceForm";
import { useMode, modes } from "../../ModeContext";
import { DeleteNotification } from "../../components/DeleteNotification/DeleteNotification";
import PanelBanner from "../PanelBanner/PanelBanner";
import serviceData from "../../data/service.json";

const data = serviceData[0].services.map((service) => ({
  id: service.id,
  name: service.name,
  description: service.description,
  type: service.type,
  duration: service.duration,
  price: service.price,
}));

export const Service = () => {
  const [formMode, setFormMode] = useMode();
  const [editData, setEditData] = useState();
  const [listOfServices, setListOfServices] = useState(data);
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

  const showModal = (service) => {
    setOpen(service, true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Service Name",
      dataIndex: "name",
      width: "10%",
      fixed: "left",
      ...getColumnSearchProps("name"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      responsive: ["md"],
      width: "15%",
      ...getColumnSearchProps("description"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Type",
      dataIndex: "type",
      responsive: ["md"],
      width: "10%",
      ...getColumnSearchProps("type"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      responsive: ["md"],
      width: "5%",
      ...getColumnSearchProps("duration"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: "Price",
      dataIndex: "price",
      responsive: ["md"],
      width: "5%",
      ...getColumnSearchProps("price"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: "10%",
      render: (_, service) => (
        <Space size="middle">
          <a
            onClick={() => {
              openEditForm(service);
              navigate(`${service.id}/edit`);
            }}
            className="action-item__icon"
          >
            <EditOutlined />
          </a>
          <a onClick={() => showModal(service)} className="action-item__icon">
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const addService = (newService) => {
    const newListOfServices = [...listOfServices, newService];
    setListOfServices(newListOfServices);
  };

  const editService = (value) => {
    const updatedListOfServices = listOfServices.map((obj) => {
      if (obj.id === value.id) {
        return {
          ...obj,
          id: value.id,
          name: value.name,
          description: value.description,
          type: value.type,
          duration: value.duration,
          price: value.price,
        };
      }
      return obj;
    });
    setListOfServices(updatedListOfServices);
  };

  const deleteService = (value) => {
    const updatedListOfServices = listOfServices.filter(
      (service) => service.id !== value.id
    );
    setShowDeletedAlert(true);
    hideModal();
    setListOfServices(updatedListOfServices);
    setTimeout(() => {
      setShowDeletedAlert(false);
    }, "2000");
  };

  //TO DO
  // const formatData = (data) => {
  //   const formatedData = data.map((service) => ({
  //     id: service.id,
  //     name: service.name,
  //     description: service.description,
  //     type: service.type,
  //     duration: `${service.duration} min`,
  //     price: `$${service.price} USD`
  //   }));
  //   setListOfServices(formatedData)
  // };

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
        title="Are you sure you want to delete this service?"
        open={open}
        onOk={() => deleteService(open)}
        onCancel={hideModal}
        okText="Yes"
        cancelText="Cancel"
      >
        <p>This action will delete all service data</p>
      </Modal>

      <PanelBanner
        title={
          formMode === modes.VIEW
            ? "Services"
            : formMode === modes.ADD
            ? "Add Service"
            : "Edit Service"
        }
        text={formMode === modes.VIEW ? "Add new service" : "Cancel"}
        onClick={() => handleClick()}
      />

      <DeleteNotification
        showDeletedAlert={showDeletedAlert}
        message={"Service Deleted"}
      />

      {formMode === modes.VIEW && (
        <Table
          columns={columns}
          pagination={{ pageSize: 5, hideOnSinglePage: true }}
          dataSource={listOfServices}
          rowKey="id"
        />
      )}

      {formMode !== modes.VIEW && (
        <ServiceForm
          addService={addService}
          editService={editService}
          listOfServices={listOfServices}
          formMode={formMode}
          setFormMode={setFormMode}
          editData={editData}
        />
      )}
    </>
  );
};
