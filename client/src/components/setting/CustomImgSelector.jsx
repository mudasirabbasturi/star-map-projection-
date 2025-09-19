import { useState } from "react";
import { Divider, Upload, Button, Image, Row, Col } from "antd";
import { UploadOutlined, CheckCircleTwoTone } from "@ant-design/icons";

const DEFAULT_IMAGES = [
  `${window.location.origin}/imgs/starmap/img1.jpg`,
  `${window.location.origin}/imgs/starmap/img2.jpg`,
  `${window.location.origin}/imgs/starmap/img3.jpg`,
  `${window.location.origin}/imgs/starmap/img4.jpg`,
  `${window.location.origin}/imgs/starmap/img5.jpg`,
];
const CustomImgSelector = ({ styles, updateStyles }) => {
  const [customImages, setCustomImages] = useState([]);
  // const handleUpload = (file) => {
  //   const url = URL.createObjectURL(file);
  //   setCustomImages((prev) => [...prev, url]);
  //   updateStyles("CustomImg.imgSrc", url);
  //   return false;
  // };
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      setCustomImages((prev) => [...prev, base64Url]);
      updateStyles("CustomImg.imgSrc", base64Url);
    };
    reader.readAsDataURL(file);
    return false;
  };
  const allImages = [...DEFAULT_IMAGES, ...customImages];
  return (
    <div className="mb-2">
      <Divider>Custom Image</Divider>
      <Row gutter={[8, 8]}>
        {allImages.map((img, idx) => (
          <Col key={idx}>
            <div
              style={{
                position: "relative",
                width: 64,
                height: 64,
                borderRadius: "50%",
                overflow: "hidden",
                border:
                  styles.CustomImg.imgSrc === img
                    ? "2px solid #1677ff"
                    : "2px solid transparent",
                cursor: "pointer",
              }}
              onClick={() => updateStyles("CustomImg.imgSrc", img)}
            >
              <Image
                src={img}
                preview={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              {styles.CustomImg.imgSrc === img && (
                <CheckCircleTwoTone
                  twoToneColor="#1677ff"
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    fontSize: 18,
                    background: "#fff",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
          </Col>
        ))}
        <Col>
          <Upload beforeUpload={handleUpload} showUploadList={false}>
            <Button
              shape="circle"
              icon={<UploadOutlined />}
              style={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Upload>
        </Col>
      </Row>
    </div>
  );
};
export default CustomImgSelector;
