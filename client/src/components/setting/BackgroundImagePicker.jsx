import { useState } from "react";
import { Divider, Upload, Button, Image } from "antd";
import { UploadOutlined, CheckCircleTwoTone } from "@ant-design/icons";

// Default images (served from public/imgs)
const DEFAULT_IMAGES = [
  `${window.location.origin}/imgs/starmap/img10.png`,
  `${window.location.origin}/imgs/starmap/img11.png`,
  `${window.location.origin}/imgs/starmap/img12.jpeg`,
  `${window.location.origin}/imgs/starmap/img13.jpg`,
  `${window.location.origin}/imgs/starmap/img14.jpg`,
  `${window.location.origin}/imgs/starmap/img15.jpeg`,
  `${window.location.origin}/imgs/starmap/img16.avif`,
];

const BackgroundImagePicker = ({ styles, updateStyles }) => {
  const [customImages, setCustomImages] = useState([]);

  const handleUpload = (file) => {
    const url = URL.createObjectURL(file);
    setCustomImages((prev) => [...prev, url]);
    updateStyles("CustomImg.imgSrc", url);
    return false;
  };

  const allImages = [...DEFAULT_IMAGES, ...customImages];

  return (
    <>
      <Divider>Background Image</Divider>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {allImages.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              width: 64,
              height: 64,
              borderRadius: "50%",
              overflow: "hidden",
              border:
                styles.bgImage === img
                  ? "2px solid #1677ff"
                  : "2px solid transparent",
              cursor: "pointer",
            }}
            onClick={() => updateStyles("bgImage", img)}
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
            {styles.bgImage === img && (
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
        ))}

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
      </div>
    </>
  );
};

export default BackgroundImagePicker;
