import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button } from "antd";
import { v4 as uuid } from "uuid";
import { modes } from "../../ModeContext";
import { FormNotification } from "../../templates/FormNotification/FormNotification";
import data from "../../data/service.json";

export const ServiceForm = (props) => {
  const {
    addService,
    editService,
    editData,
    formMode,
    setFormMode,
    listOfServices,
  } = props;
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [form] = Form.useForm();
  const isEditMode = formMode === modes.EDIT;

  useEffect(() => {
    if (isEditMode) {
      form.setFieldValue("id", editData.id);
      form.setFieldValue("name", editData.name);
      form.setFieldValue("description", editData.description);
      form.setFieldValue("duration", editData.duration);
      form.setFieldValue("price", editData.price);
      form.setFieldValue("type", editData.type);
    }
  }, []);

  const onSubmit = (values) => {
    isEditMode ? editService(values) : onAdd(values);
    setShowErrorAlert(false);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setFormMode(modes.VIEW);
    }, "3000");
  };

  const onAdd = (value) => {
    const newId = uuid().slice(0, 6);
    const newService = { ...value, id: newId };
    addService(newService);
  };

  const onValuesChange = (_, allValues) => {
    setShowErrorAlert(false);
    allValues.name && allValues.description && allValues.type
      ? setButtonDisabled(false)
      : setButtonDisabled(true);
  };

  const validateServiceType = (value) => {
    if (!value) return Promise.resolve();

    const sameTypeServices = listOfServices.reduce((acc, service) => {
      service.type === value && acc.push(service.name);
      return acc;
    }, []);

    for (let i = 0; i < sameTypeServices.length; i++) {
      if (sameTypeServices[i] === form.getFieldValue("name")) {
        return Promise.reject(new Error("This service already exists"));
      }
    }
    return Promise.resolve();
  };

  const types = data[0].types.map((el) => (
    <Select.Option key={el} value={el}>
      {el.type}
    </Select.Option>
  ));

  const cancelForm = () => {
    navigate(-1);
    setFormMode(modes.VIEW);
  };

  return (
    <>
      <Form
        form={form}
        name="service"
        autoComplete="off"
        scrollToFirstError
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{ remember: true }}
        onValuesChange={onValuesChange}
        onFinishFailed={() => setShowErrorAlert(true)}
        onFinish={onSubmit}
      >
        <Form.Item className="form-notification__container">
          <FormNotification
            isEditMode={isEditMode}
            showSuccessAlert={showSuccessAlert}
            showErrorAlert={showErrorAlert}
            section={"Service"}
          />
        </Form.Item>

        <Form.Item name="id" hidden>
          <Input placeholder="id" disabled />
        </Form.Item>

        <Form.Item
          name="name"
          label="Service Name"
          align="center"
          className="form-top__item"
          rules={[
            {
              required: true,
              min: 3,
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          align="center"
          rules={[
            {
              required: true,
              message: "Please add a description",
            },
            {
              min: 10,
            },
          ]}
          hasFeedback
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Duration"
          align="center"
          rules={[
            {
              required: true,
              pattern: new RegExp(/^[0-9]+$/),
              message: "Enter a valid number",
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          align="center"
          rules={[
            {
              required: true,
              pattern: new RegExp(/^[0-9]+$/),
              message: "Enter a valid number",
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          align="center"
          rules={[
            {
              required: true,
            },
            {
              validator: (_, value) => validateServiceType(value),
            },
          ]}
          hasFeedback
        >
          <Select>{types}</Select>
        </Form.Item>

        <Form.Item>
          <div className="form-bottom__btns">
            <Button
              disabled={buttonDisabled}
              className="panel-form-btn"
              htmlType="submit"
              type="primary"
            >
              {formMode === modes.ADD ? "Add Service" : "Save"}
            </Button>
            <Button
              className="panel-form-btn"
              onClick={() => cancelForm()}
              type="primary"
            >
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};
