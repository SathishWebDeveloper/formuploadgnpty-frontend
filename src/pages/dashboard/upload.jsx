import React, { useContext, useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload , Table , Spin } from "antd";
// import { Table, Button, Spin } from "antd";
import axios from 'axios';
import { Context } from "../../routes/routes";
const UploadPage = () => {
  const [fileList, setFileList] = useState([]);
  const propData = useContext(Context);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });
  
    setUploading(true);
  
    // Replace 'your-token' with the actual Bearer token
    const token = propData?.accessToken; // Fetch this dynamically if needed, e.g., from state or context
    // console.log("token", token);
    axios
      .post("http://localhost:8000/api/files/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensure the Content-Type is set correctly for file uploads
        },
      })
      .then((response) => {
        setFileList([]);
        fetchFiles();
        message.success("Upload successfully.");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        message.error("Upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };
  const props = {
    accept: "image/png, image/jpeg , .xlsx ,.pdf ", // add the file type attributes like this
    // maxCount:1,  it is not working check this
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // console.log("file", file);
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true); // For loader

  // Fetch files from API
  const fetchFiles = async () => {
    
    try {
      const token = propData?.accessToken; // Replace with actual token
      const response = await axios.get("http://localhost:8000/api/files/show",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res", response.data);
      setFiles(response.data); // Store data in state
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false); // Remove loader
    }
  };

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "Serial No",
      dataIndex: "serial",
      key: "serial",
      render: (_, __, index) => index + 1, // Render serial number
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => handleDownload(record)}
          >
            Download
          </Button>
          <Button
            type="link"
            onClick={() => handleShare(record._id)}
          >
            Share
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Action Handlers
  const handleDownload = (record) => {

    
    console.log("record", record.filePath);
    const updateUrl = record.filePath.replace("\\" , "/")
    console.log("updateUrl", updateUrl);
    const pdfUrl = `http://localhost:8000/${updateUrl}`;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


  };

  const handleShare = (fileId) => {
    // Logic to share the file
    console.log(`Share file with ID: ${fileId}`);
  };

  const handleDelete = (fileId) => {
    // Logic to delete the file
    console.log(`Delete file with ID: ${fileId}`);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <span style={{ margin: "0 5px 0px 0px" }}>Select Files :</span>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}> Upload File </Button>
          </Upload>
        </div>
        <div>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{
              marginTop: 16,
            }}
          >
            {uploading ? "Uploading" : "Start Upload"}
          </Button>
        </div>

        <div>
        <Spin spinning={loading} tip="Loading files...">
      <Table
        dataSource={files.map((file) => ({ ...file, key: file._id }))}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </Spin>
        </div>
      </div>
    </>
  );
};
export default UploadPage;
