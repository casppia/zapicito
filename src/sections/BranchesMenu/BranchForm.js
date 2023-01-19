import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button } from "antd";
import { v4 as uuid } from "uuid";
import { modes } from "../../ModeContext";
import { FormNotification } from "../../templates/FormNotification/FormNotification";
import data from "../../data/branch.json";

export const BranchForm = (props) => {
  const {
    addBranch,
    editBranch,
    editData,
    formMode,
    setFormMode,
    listOfBranches,
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
      form.setFieldValue("id", editData.id);
      form.setFieldValue("company", editData.company);
      form.setFieldValue("name", editData.name);
      form.setFieldValue("address", editData.address);
      form.setFieldValue("phone", editData.phone);
      form.setFieldValue("description", editData.description);
    }
  }, []);

  const onSubmit = (values) => {
    isEditMode ? editBranch(values) : onAdd(values);
    setShowErrorAlert(false);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setFormMode(modes.VIEW);
    }, "3000");
  };

  const onAdd = (value) => {
    const newId = uuid().slice(0, 6);
    const newBranch = { ...value, id: newId };
    addBranch(newBranch);
  };

  const onValuesChange = (_, allValues) => {
    setShowErrorAlert(false);
    allValues.company &&
    allValues.name &&
    allValues.address &&
    allValues.phone &&
    allValues.description
      ? setButtonDisabled(false)
      : setInputDisabled(true);

    !setInputDisabled ? setInputDisabled(true) : setInputDisabled(false);
  };

  const validateBranchName = (value) => {
    if (!value) return Promise.resolve();
    for (let i = 0; i < listOfBranches.length; i++) {
      if (listOfBranches[i].name.toLowerCase() === value.toLowerCase()) {
        return Promise.reject(new Error("Branch already exists"));
      }
    }
    return Promise.resolve();
  };

  const validateBranchPhone = (value) => {
    if (!value) return Promise.resolve();
    const numRegex = /^\d+$/;
    for (let i = 0; i < listOfBranches.length; i++) {
      if (
        listOfBranches[i].phone
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

  const companies = data.map((el) => (
    <Select.Option key={el.id} value={el.company}>
      {el.company}
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
        name="branch"
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
            section={"Branch"}
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
          label="Branch Name"
          align="center"
          rules={[
            {
              required: true,
              min: 3,
            },
            {
              validator: (_, value) => validateBranchName(value),
            },
          ]}
          hasFeedback
        >
          <Input disabled={formMode === modes.ADD ? inputDisabled : false} />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          align="center"
          rules={[
            {
              required: true,
              message: "Please add a description",
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
              validator: (_, value) => validateBranchPhone(value),
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
              message: "Please add a description",
            },
            {
              min: 10,
            },
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
              {formMode === modes.ADD ? "Add Branch" : "Save"}
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
