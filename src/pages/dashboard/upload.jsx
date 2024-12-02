// import React from "react";

// const UploadPage = () => {
//     return (
//         <div>
//             Upload

//         </div>

//     )
// }
// export default UploadPage;

// import React from 'react';
// import { UploadOutlined } from '@ant-design/icons';
// import { Button, message, Upload } from 'antd';
// const props = {
//   name: 'file',
//   action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
//   headers: {
//     authorization: 'authorization-text',
//   },
//   onChange(info) {
//     if (info.file.status !== 'uploading') {
//       console.log(info.file, info.fileList);
//     }
//     if (info.file.status === 'done') {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === 'error') {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
//   progress: {
//     strokeColor: {
//       '0%': '#108ee9',
//       '100%': '#87d068',
//     },
//     strokeWidth: 3,
//     format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
//   },
// };
// const UploadPage = () => (
//   <Upload {...props}>
//     <Button icon={<UploadOutlined />}>Click to Upload</Button>
//   </Upload>
// );
// export default UploadPage;   // direct upload on the data

import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
const UploadPage = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file);
    });
    setUploading(true);
    // You can use any AJAX library you like
    fetch("https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success("upload successfully.");
      })
      .catch(() => {
        message.error("upload failed.");
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
      console.log("file", file);
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
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
      </div>
    </>
  );
};
export default UploadPage;
