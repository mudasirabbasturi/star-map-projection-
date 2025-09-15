import { useState } from "react";
import { Divider, Upload, Button, Image } from "antd";
import { UploadOutlined, CheckCircleTwoTone } from "@ant-design/icons";

const DEFAULT_IMAGES = [
  "https://picsum.photos/800/600?random=1",
  "https://picsum.photos/800/600?random=2",
  "https://picsum.photos/800/600?random=3",
  "https://picsum.photos/800/600?random=4",
];

const BackgroundImagePicker = ({ styles, updateStyles }) => {
  const [customImages, setCustomImages] = useState([]);

  const handleUpload = (file) => {
    const url = URL.createObjectURL(file);
    setCustomImages((prev) => [...prev, url]);
    updateStyles("bgImage", url);
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
                borderRadius: "50%",
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

        {/* Upload Button */}
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
