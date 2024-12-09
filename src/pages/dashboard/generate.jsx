import React, { useContext } from "react";
import { Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import { Context } from "../../routes/routes";
import jsPDF from "jspdf"; //pdf
import * as XLSX from "xlsx"; //excel

const { Option } = Select;

const GeneratePage = () => {
  const [form] = Form.useForm();
  const propData = useContext(Context);
  const authkey = localStorage.getItem("accessToken") || "" ;

  const token = propData?.accessToken || authkey;

  const fileMaker = (fileData) => {
    console.log();
    if (fileData.fileFormat === "PDF") {
      // Generate PDF file
      const doc = new jsPDF();
      doc.text("Form Data", 20, 10);
      let y = 20;
      Object.entries(fileData).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 20, y);
        y += 10;
      });
      doc.save(`${name}_form.pdf`);
    } else if (fileData.fileFormat === "Excel") {
      // Generate Excel file
      const ws = XLSX.utils.json_to_sheet([fileData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Form Data");
      XLSX.writeFile(wb, `${name}_form.xlsx`);
    }
  };

  const handleSubmit = async (values) => {
    // const token = propData?.accessToken;
    console.log("test", token, values); // Logging for debugging

    const url = "http://localhost:8000/api/generatefiles/upload"; // Replace with your API endpoint

    try {
      // Sending the object directly
      const response = await axios.post(url, values, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token for authentication
          "Content-Type": "application/json", // Ensure the content type is JSON
        },
      });

      // Success response
      console.log("Response Data:", response.data);
      fileMaker(values); // Call your fileMaker function with values
    } catch (error) {
      // Error handling
      console.error("Error:", error);

      // Optional: log more details about the error
      if (error.response) {
        console.error("Error Response:", error.response.data);
      }
    }
  };

  // Handle form submission
  const onFinish = (values) => {
    console.log("Form Values:", values);

    handleSubmit(values);
    // Display entered details
    message.success("Form submitted successfully!");
    // form.resetFields();
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
          fileFormat: "PDF", // Default value for file format
        }}
      >
        {/* Name Field */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
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
          rules={[{ required: true, message: "Please provide event details" }]}
        >
          <Input.TextArea rows={4} placeholder="Describe the event" />
        </Form.Item>

        {/* Location Dropdown */}
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please select a location" }]}
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
          rules={[{ required: true, message: "Please select a file format" }]}
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
