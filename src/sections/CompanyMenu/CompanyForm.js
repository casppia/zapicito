import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { v4 as uuid } from "uuid";
import { modes } from "../../ModeContext";
import { FormNotification } from "../../templates/FormNotification/FormNotification";

export const CompanyForm = (props) => {
  const {
    addCompany,
    editCompany,
    editData,
    formMode,
    setFormMode,
    dataSource,
  } = props;
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [inputDisabled, setInputDisabled] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [form] = Form.useForm();
  const isEditMode = formMode === modes.EDIT;

  useEffect(() => {
    if (isEditMode) {
      form.setFieldValue("name", editData.name);
      form.setFieldValue("id", editData.id);
      form.setFieldValue("address", editData.address);
      form.setFieldValue("phone", editData.phone);
      form.setFieldValue("description", editData.description);
    }
  }, []);

  const onSubmit = (values) => {
    isEditMode ? editCompany(values) : onAdd(values);
    setShowErrorAlert(false);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setFormMode(modes.VIEW);
    }, "3000");
  };

  const onAdd = (value) => {
    const newId = uuid().slice(0, 6);
    const newData = { ...value, id: newId };
    addCompany(newData);
  };

  const onValuesChange = (_, allValues) => {
    setShowErrorAlert(false);
    allValues.name &&
    allValues.address &&
    allValues.phone &&
    allValues.description
      ? setButtonDisabled(false)
      : setButtonDisabled(true);

    !setInputDisabled ? setInputDisabled(true) : setInputDisabled(false);
  };

  const validateCompanyName = (value) => {
    if (!value) return Promise.resolve();
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].name.toLowerCase() === value.toLowerCase()) {
        return Promise.reject("Company already exists");
      }
    }
    return Promise.resolve();
  };

  const cancelForm = () => {
    navigate(-1);
    setFormMode(modes.VIEW);
  };

  return (
    <>
      <Form
        form={form}
        className="wrapper"
        name="company"
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
            section={"Company"}
          />
        </Form.Item>

        <Form.Item name="id" hidden>
          <Input placeholder="id" disabled />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          align="center"
          className="form-top__item"
          rules={[
            {
              required: true,
              message: "Please write company's name",
            },
            {
              min: 3,
              message: "Name must be at least 3 characters",
            },
            {
              validator: (_, value) => validateCompanyName(value),
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          align="center"
          rules={[
            {
              required: true,
              message: "Please write company's address",
            },
          ]}
          hasFeedback
        >
          <Input disabled={formMode === modes.ADD ? inputDisabled : false} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          align="center"
          rules={[
            {
              required: true,
              message: "Please write company's phone number",
            },
            {
              min: 3,
              pattern: new RegExp(
                /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s-]\d{3}[\s-]\d{4}$/g
              ),
              message:
                "Wrong format! Valid formats: 123-456-7890 | (123) 456-7890 | 123 456 7890 | +91 (123) 456-7890",
            },
          ]}
          hasFeedback
        >
          <Input disabled={formMode === modes.ADD ? inputDisabled : false} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          align="center"
          rules={[
            {
              required: true,
              message: "Please write company's description",
            },
            { min: 10 },
          ]}
          hasFeedback
        >
          <TextArea
            rows={4}
            disabled={formMode === modes.ADD ? inputDisabled : false}
          />
        </Form.Item>

        <Form.Item>
          <div className="form-bottom__btns">
            <Button
              disabled={buttonDisabled}
              className="panel-form-btn"
              htmlType="submit"
              type="primary"
            >
              {formMode === modes.ADD ? "Add Company" : "Save"}
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
