import React, { useContext, useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload, Table, Spin } from "antd";
// import { Table, Button, Spin } from "antd";
import axios from "axios";
import { Context } from "../../routes/routes";
import * as XLSX from "xlsx"; //excel
const UploadPage = () => {
  const [fileList, setFileList] = useState([]);
  const propData = useContext(Context);
  const [uploading, setUploading] = useState(false);
  const authkey = localStorage.getItem("accessToken") || "" ;

  const token = propData?.accessToken || authkey; // Fetch this dynamically if needed, e.g., from state or context
 
 
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });

    setUploading(true);

    // Replace 'your-token' with the actual Bearer token
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

  //show self generated pdf or excel 
  const [selfFiles , setSelfFiles] = useState([]);
  console.log("self", selfFiles)

  // Fetch files from API
  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/files/show", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("res", response.data);
      setFiles(response.data); // Store data in state
    } catch (error) {
      // console.error("Error fetching files:", error);
    } finally {
      setLoading(false); // Remove loader
    }
  };

  const generatedfetchFiles = async () => {
    // console.log("res123",propData )
    try {
      const response = await axios.get("http://localhost:8000/api/generatefiles/show", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("res123", response);
      setSelfFiles(response.data); // Store data in state
    } catch (error) {
      // console.error("Error fetching files:", error);
    } finally {
      setLoading(false); // Remove loader
    }
  };

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
    generatedfetchFiles();
  }, []);

  // Define columns for Ant Design Table
  const columnspdforexcelFrontend = [
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
          {/* create in front end pdf or excel  */}
          <Button type="link" onClick={() => handleDownload(record)}>
            Download
          </Button>
          <Button type="link" onClick={() => handleShare(record._id)}>
            Share
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Action Handlers
  const handleDownload = (record) => {
    console.log("record", record.filePath);
    const updateUrl = record.filePath.replace("\\", "/");
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



  //////////////////////////////////////////////generate files data

  const handleDownloadBackend = async (record) => {
    const token = propData?.accessToken || authkey;
    const fileId = { _id: record._id };

    console.log("test", record);
    //send the data to the backend and verify the auth token and create a pdf file in BE and send it in buffer
    // In response get that and using a blob and download that in frontend. - using this there is no memory required for storage purpose.  
  
    try {
      const response = await axios.post(
          "http://localhost:8000/api/generatefiles/downloadupload",
           fileId , // Send fileId in the request body
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
              responseType: "blob", // Important to handle binary data
          }
      );
      
      // console.log("response",response);

      if(record?.format === "PDF"){
                  // Create a Blob from the response data
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(pdfBlob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `${record.fileName}`; // Default file name
      document.body.appendChild(link);

      // Trigger the download
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      URL.revokeObjectURL(url);
      }
      else if(record?.format === "Excel"){
           // Get the Blob from the response
      // const blob = await response.blob();
      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });

      // Create a link element
      const link = document.createElement('a');

      // Create an object URL for the Blob
      const url = URL.createObjectURL(blob);

      // Set the link's href to the object URL
      link.href = url;

      // Set the download attribute to specify the filename
      // link.download = `${record.fileName}`;
      link.download = `${record.fileName}.xlsx`; // Ensure the extension matches the format


      // Append the link to the document
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up the URL and remove the link element
      URL.revokeObjectURL(url);
      link.remove();
      }

  } catch (error) {
      console.error("Error downloading the PDF:", error);
  }
  };
  // optimized way to download both excel and pdf function.
  // const handleDownloadBackend = async (record) => {
  //   const token = propData?.accessToken || authkey;
  //   const fileId = { _id: record._id };
  
  //   try {
  //     // Send request to backend
  //     const response = await axios.post(
  //       "http://localhost:8000/api/generatefiles/downloadupload",
  //       fileId, // Send fileId in the request body
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         responseType: "blob", // To handle binary data in response
  //       }
  //     );
  
  //     // Determine file type
  //     const fileType = record?.format === "PDF" ? "application/pdf" : "application/vnd.ms-excel";
  
  //     // Create a Blob from the response data
  //     const blob = new Blob([response.data], { type: fileType });
  
  //     // Create a temporary URL for the Blob
  //     const url = URL.createObjectURL(blob);
  
  //     // Create a link element
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${record.fileName}`; // Use fileName from record
  //     document.body.appendChild(link);
  
  //     // Trigger the download
  //     link.click();
  
  //     // Clean up
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading the file:", error);
  //   }
  // };


  const columnspdforexcelBackend = [
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
          {/* create in front end pdf or excel  */}
          <Button type="link" onClick={() => handleDownloadBackend(record)}>
            Download
          </Button>
          <Button type="link" onClick={() => handleShare(record._id)}>
            Share
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

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
              columns={columnspdforexcelFrontend}
              pagination={{ pageSize: 5 }}
            />
          </Spin>
        </div>

        <div>
        <Spin spinning={loading} tip="Loading files...">
            <Table
              dataSource={selfFiles.map((file) => ({ ...file, key: file._id }))}
              columns={columnspdforexcelBackend}
              pagination={{ pageSize: 5 }}
            />
          </Spin>
        </div>
      </div>
    </>
  );
};
export default UploadPage;
