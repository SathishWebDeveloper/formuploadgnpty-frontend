// import React from "react";

// const GeneratePage = () => {
//     return (
//         <div>
//             Generate 

//         </div>
      
//     )
// }
// export default GeneratePage;

import React from "react";
import { Form, Input, Select, Button, message } from "antd";

const { Option } = Select;

const GeneratePage = () => {
  const [form] = Form.useForm();

  // Handle form submission
  const onFinish = (values) => {
    console.log("Form Values:", values);

    // Display entered details
    message.success("Form submitted successfully!");
    form.resetFields();
    console.log("Formatted Output:", JSON.stringify(values, null, 2));
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2>Event Form</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          location: "New York", // Default value for location
          fileFormat: "PDF",   // Default value for file format
        }}
      >
        {/* Name Field */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter your name" },
          ]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        {/* Event Details Field */}
        <Form.Item
          label="Event Details"
          name="eventDetails"
          rules={[
            { required: true, message: "Please provide event details" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Describe the event" />
        </Form.Item>

        {/* Location Dropdown */}
        <Form.Item
          label="Location"
          name="location"
          rules={[
            { required: true, message: "Please select a location" },
          ]}
        >
          <Select placeholder="Select a location">
            <Option value="New York">New York</Option>
            <Option value="San Francisco">San Francisco</Option>
            <Option value="Los Angeles">Los Angeles</Option>
            <Option value="Chicago">Chicago</Option>
          </Select>
        </Form.Item>

        {/* File Format Dropdown */}
        <Form.Item
          label="File Format"
          name="fileFormat"
          rules={[
            { required: true, message: "Please select a file format" },
          ]}
        >
          <Select placeholder="Select a file format">
            <Option value="PDF">PDF</Option>
            <Option value="Word">Word</Option>
            <Option value="Excel">Excel</Option>
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GeneratePage;
