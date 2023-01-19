import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button } from "antd";
import { v4 as uuid } from "uuid";
import { modes } from "../../ModeContext";
import { FormNotification } from "../../templates/FormNotification/FormNotification";
import companyData from "../../data/company.json";

export const EmployeeForm = (props) => {
  const {
    addEmployee,
    editEmployee,
    editData,
    formMode,
    setFormMode,
    listOfEmployees,
  } = props;
  const navigate = useNavigate();
  const [inputDisabled, setInputDisabled] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [form] = Form.useForm();
  const isEditMode = formMode === modes.EDIT;

  useEffect(() => {
    if (isEditMode) {
      form.setFieldValue("id", editData.id);
      form.setFieldValue("company", editData.company);
      form.setFieldValue("companyID", editData.companyID);
      form.setFieldValue("name", editData.name);
      form.setFieldValue("surname", editData.surname);
      form.setFieldValue("phone", editData.phone);
    }
  }, []);

  const onSubmit = (values) => {
    isEditMode ? editEmployee(values) : onAdd(values);
    setShowErrorAlert(false);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setFormMode(modes.VIEW);
    }, "3000");
  };

  const onAdd = (value) => {
    const newId = uuid().slice(0, 6);
    const newEmployee = { ...value, id: newId };
    addEmployee(newEmployee);
  };

  const onValuesChange = (_, allValues) => {
    setShowErrorAlert(false);
    allValues.company && allValues.name && allValues.surname && allValues.phone
      ? setButtonDisabled(false)
      : setButtonDisabled(true);

    !setInputDisabled ? setInputDisabled(true) : setInputDisabled(false);
  };

  const validateEmployeeName = (value) => {
    if (!value) return Promise.resolve();
    for (let i = 0; i < listOfEmployees.length; i++) {
      const employeeName = `${listOfEmployees[
        i
      ].name.toLowerCase()} ${listOfEmployees[i].surname.toLowerCase()}`;
      const newEmployeeName = `${form
        .getFieldValue("name")
        .toLowerCase()} ${value.toLowerCase()}`;
      if (employeeName === newEmployeeName)
        return Promise.reject(new Error("Employee already exists"));
    }
    return Promise.resolve();
  };

  const validateEmployeePhone = (value) => {
    if (!value) return Promise.resolve();
    const numRegex = /^\d+$/;
    for (let i = 0; i < listOfEmployees.length; i++) {
      if (
        listOfEmployees[i].phone
          .split("")
          .filter((el) => el.match(numRegex))
          .join("") ===
        value
          .split("")
          .filter((el) => el.match(numRegex))
          .join("")
      )
        return Promise.reject(new Error("Phone already registered"));
    }
    return Promise.resolve();
  };

  const companies = companyData.company.map((company) => (
    <Select.Option key={company.id} value={company.name}>
      {company.name}
    </Select.Option>
  ));

  const cancelForm = () => {
    navigate(-1);
    setFormMode(modes.VIEW);
  };

  return (
    <>
      <Form
        className="panel-form"
        form={form}
        name="employee"
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
            section={"Employee"}
          />
        </Form.Item>

        <Form.Item name="id" hidden>
          <Input placeholder="id" disabled />
        </Form.Item>

        <Form.Item
          name="company"
          label="Company"
          align="center"
          className="form-top__item"
          rules={[
            {
              required: true,
              message: "Please select a company",
            },
          ]}
          hasFeedback
        >
          <Select>{companies}</Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          align="center"
          rules={[
            {
              required: true,
              min: 3,
            },
          ]}
          hasFeedback
        >
          <Input disabled={formMode === modes.ADD ? inputDisabled : false} />
        </Form.Item>

        <Form.Item
          name="surname"
          label="Last Name"
          align="center"
          rules={[
            {
              required: true,
              min: 3,
            },
            {
              validator: (_, value) => validateEmployeeName(value),
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
              message: "Please input your phone number!",
            },
            {
              min: 3,
              pattern: new RegExp(
                /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s-]\d{3}[\s-]\d{4}$/g
              ),
              message:
                "Wrong format! Valid formats: 123-456-7890 | (123) 456-7890 | 123 456 7890 | +91 (123) 456-7890",
            },
            {
              validator: (_, value) => validateEmployeePhone(value),
            },
          ]}
          hasFeedback
        >
          <Input disabled={formMode === modes.ADD ? inputDisabled : false} />
        </Form.Item>

        <Form.Item>
        <div className="form-bottom__btns">
          <Button
            disabled={buttonDisabled}
            className="panel-form-btn"
            htmlType="submit"
            type="primary"
          >
            {formMode === modes.ADD ? "Add Employee" : "Save"}
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
