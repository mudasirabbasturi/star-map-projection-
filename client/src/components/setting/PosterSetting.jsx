// src/components/setting/PosterSetting.jsx
import { useState, useEffect } from "react";
import {
  red,
  volcano,
  orange,
  gold,
  yellow,
  lime,
  green,
  cyan,
  blue,
  geekblue,
  purple,
  magenta,
  grey,
  presetPalettes,
  generate,
} from "@ant-design/colors";
import {
  Col,
  ColorPicker,
  Divider,
  Row,
  theme,
  Input,
  InputNumber,
  Select,
  Slider,
  Upload,
  Button,
  Avatar,
  Tooltip,
} from "antd";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const PosterSetting = ({
  posterStyles,
  updatePosterStyles,
  content,
  onChangeContent,
  showDrawer,
  orientation,
  setOrientation,
}) => {
  const { token } = theme.useToken();
  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    volcano,
    orange,
    gold,
    yellow,
    lime,
    green,
    cyan,
    blue,
    geekblue,
    purple,
    magenta,
    grey,
  });

  const customPanelRender = (_, { components: { Picker, Presets } }) => (
    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <div
          style={{
            height: 300,
            overflowY: "auto",
            padding: "5px 0 5px 4px",
            margin: 0,
          }}
        >
          <Presets />
        </div>
      </Col>
      <Divider type="vertical" style={{ height: "auto" }} />
      <Col flex="auto">
        <Picker />
      </Col>
    </Row>
  );

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [recentPosterMedia, setRecentPosterMedia] = useState([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentPosterMedia")) || [];
    setRecentPosterMedia(stored);
  }, []);

  return (
    <>
      {/* Orientation */}
      <div className="mb-2">
        <Divider>Orientation</Divider>
        <Select
          className="w-100"
          value={orientation}
          onChange={(val) => setOrientation(val)} // update directly
          options={[
            { label: "Portrait", value: "portrait" },
            { label: "Landscape", value: "landscape" },
          ]}
        />
      </div>
      {/* Paper Size */}
      <div className="mb-2">
        <Divider>Paper Size</Divider>
        <Select
          className="w-100"
          value={posterStyles.paperSize}
          onChange={(val) => updatePosterStyles("paperSize", val)}
          options={[
            { label: "A0", value: "A0" },
            { label: "A1", value: "A1" },
            { label: "A2", value: "A2" },
            { label: "A3", value: "A3" },
            { label: "A4", value: "A4" },
            { label: "A5", value: "A5" },
            { label: "A6", value: "A6" },
            { label: "Letter", value: "Letter" },
            { label: "Legal", value: "Legal" },
          ]}
        />
      </div>

      {/* Download / Export */}
      <div className="mb-2">
        <Divider>Export</Divider>
        <Select
          className="w-100 mb-2"
          value={content.downloadType}
          onChange={(val) => onChangeContent("downloadType", val)}
          options={[
            { label: "PDF", value: "pdf" },
            { label: "PNG", value: "png" },
            { label: "JPEG", value: "jpeg" },
          ]}
        />
        <Input
          placeholder="File name"
          value={content.fileName}
          onChange={(e) => onChangeContent("fileName", e.target.value)}
          size="small"
        />
      </div>

      {/* Background */}
      <div className="mb-2">
        <Divider>Background</Divider>
        <div className="d-flex align-items-center mb-2">
          <small className="me-2 text-muted fst-italic">Type:</small>
          <Select
            value={posterStyles.bgType}
            style={{ width: 140 }}
            onChange={(val) => updatePosterStyles("bgType", val)}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Gradient", value: "gradient" },
            ]}
          />
        </div>

        {/* Solid */}
        {posterStyles.bgType === "solid" && (
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={posterStyles.bgColor}
            onChangeComplete={(c) =>
              updatePosterStyles("bgColor", c.toCssString())
            }
            posterStyles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
          />
        )}

        {/* Gradient */}
        {posterStyles.bgType === "gradient" && (
          <div>
            <div className="d-flex align-items-center mb-2">
              <small className="me-2 text-muted fst-italic">In Gradient:</small>
              <Select
                value={posterStyles.bgGradientType}
                style={{ width: 140 }}
                onChange={(val) => updatePosterStyles("bgGradientType", val)}
                options={[
                  { label: "Linear", value: "linear" },
                  { label: "Radial", value: "radial" },
                  { label: "Conic", value: "conic" },
                ]}
              />
            </div>

            {(posterStyles.bgGradientType === "linear" ||
              posterStyles.bgGradientType === "conic") && (
              <div className="d-flex align-items-center mb-2">
                <small className="me-2 text-muted fst-italic">Angle:</small>
                <InputNumber
                  min={0}
                  max={360}
                  value={posterStyles.bgGradientAngle}
                  onChange={(val) =>
                    updatePosterStyles("bgGradientAngle", val || 0)
                  }
                />
                <span className="ms-1">°</span>
              </div>
            )}

            <div
              style={{
                height: 30,
                borderRadius: 6,
                marginBottom: 8,
                border: "1px solid #ccc",
                background: `linear-gradient(to right, ${posterStyles.bgGradientColors.join(
                  ", "
                )})`,
              }}
            />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {posterStyles.bgGradientColors.map((color, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <ColorPicker
                    value={color}
                    onChangeComplete={(c) => {
                      const newColors = [...posterStyles.bgGradientColors];
                      newColors[idx] = c.toCssString();
                      updatePosterStyles("bgGradientColors", newColors);
                    }}
                    posterStyles={{ popupOverlayInner: { width: 480 } }}
                    presets={presets}
                    panelRender={customPanelRender}
                    size="small"
                  />
                  {posterStyles.bgGradientColors.length > 2 && (
                    <button
                      onClick={() => {
                        const newColors = posterStyles.bgGradientColors.filter(
                          (_, i) => i !== idx
                        );
                        updatePosterStyles("bgGradientColors", newColors);
                      }}
                      style={{
                        marginLeft: 4,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "red",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                updatePosterStyles("bgGradientColors", [
                  ...posterStyles.bgGradientColors,
                  "#ffffff",
                ])
              }
              style={{
                marginTop: 8,
                padding: "2px 6px",
                border: "1px solid #ccc",
                borderRadius: 4,
                background: "#f9f9f9",
                cursor: "pointer",
              }}
            >
              + Add Color Stop
            </button>
          </div>
        )}
      </div>

      {/* Background Image */}
      <div className="mb-2">
        <div className="d-flex flex-column mb-2">
          <Divider>
            <small className="me-1 text-muted fst-italic">
              Background Theme
            </small>
          </Divider>
          {/* <Avatar.Group size="large" max={{ count: 6 }}>
            {recentPosterMedia.length === 0 ? (
              <Avatar style={{ backgroundColor: "#f56a00" }}>No Theme</Avatar>
            ) : (
              recentPosterMedia.map((url, idx) => (
                <Avatar
                  key={idx}
                  src={url}
                  style={{
                    cursor: "pointer",
                    border:
                      selectedMedia === url
                        ? "3px solid #1890ff"
                        : "2px solid transparent",
                    borderRadius: "50%",
                  }}
                  onClick={() => {
                    updatePosterStyles("bgImage", url);
                    setSelectedMedia(url);
                  }}
                />
              ))
            )}
          </Avatar.Group>
          <Button
            danger
            size="small"
            style={{ marginTop: 8 }}
            onClick={() => {
              localStorage.removeItem("recentPosterMedia");
              setRecentPosterMedia([]);
              setSelectedMedia(null);
            }}
          >
            Clear Poster Media
          </Button> */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {recentPosterMedia.length === 0 ? (
              <small>No Theme Is Selected, Add Or Upload From Media.</small>
            ) : (
              recentPosterMedia.map((url, idx) => (
                <div
                  className="theme"
                  key={idx}
                  style={{
                    position: "relative",
                    width: 70,
                    height: 70,
                    cursor: "pointer",
                    border:
                      selectedMedia === url
                        ? "1px solid #1890ff"
                        : "1px solid transparent",
                  }}
                  onClick={() => {
                    updatePosterStyles("bgImage", url);
                    setSelectedMedia(url);
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div
                    className="remove_theme"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "red",
                      color: "white",
                      fontSize: 12,
                      textAlign: "center",
                      lineHeight: "16px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = recentPosterMedia.filter(
                        (item) => item !== url
                      );
                      setRecentPosterMedia(updated);
                      localStorage.setItem(
                        "recentPosterMedia",
                        JSON.stringify(updated)
                      );
                      if (selectedMedia === url) setSelectedMedia(null);
                    }}
                  >
                    ×
                  </div>
                </div>
              ))
            )}
          </div>
          <Divider>
            <small className="me-1 text-muted fst-italic">OR</small>
          </Divider>
          <Button
            type="primary"
            onClick={() =>
              showDrawer("uploadSelectCustomeImg", "poster.bgImage")
            }
          >
            Select File From Media
          </Button>
        </div>
        <div className="d-flex align-items-center">
          <small className="me-1 text-muted fst-italic">Bacground Size</small>
          <Select
            value={posterStyles.bgImageMode}
            onChange={(val) => updatePosterStyles("bgImageMode", val)}
            style={{ width: "100%", marginTop: 8 }}
            options={[
              { label: "Cover", value: "cover" },
              { label: "Contain", value: "contain" },
              { label: "Stretch", value: "100% 100%" }, // map stretch to CSS
            ]}
          />
        </div>

        <div className="d-flex align-items-center">
          <small className="me-1 text-muted fst-italic">Opacity</small>
          <Slider
            className="w-75 me-3"
            min={0}
            max={1}
            step={0.1}
            value={posterStyles.bgImageOpacity}
            onChange={(val) => updatePosterStyles("bgImageOpacity", val)}
          />
          <InputNumber
            className="w-25"
            size="small"
            min={0}
            max={1}
            step={0.1}
            value={posterStyles.bgImageOpacity}
            onChange={(val) => updatePosterStyles("bgImageOpacity", val)}
          />
        </div>
      </div>

      {/* Border */}
      <div className="mb-2">
        <Divider>Border</Divider>
        <div className="d-flex align-items-center mb-2">
          <small className="me-2 text-muted fst-italic">Style:</small>
          <Select
            className="w-100"
            size="small"
            value={posterStyles.borderStyle}
            onChange={(val) => updatePosterStyles("borderStyle", val)}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
              { label: "Double", value: "double" },
              { label: "None", value: "none" },
            ]}
          />
        </div>
        <div className="d-flex align-items-center mb-2">
          <small className="me-2 text-muted fst-italic">Width:</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={20}
            value={posterStyles.borderWidth}
            onChange={(val) => updatePosterStyles("borderWidth", val || 0)}
            disabled={posterStyles.borderStyle === "none"}
          />
        </div>
        <div className="d-flex align-items-center mb-2">
          <small className="me-2 text-muted fst-italic">Radius:</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={50}
            value={posterStyles.borderRadius}
            onChange={(val) => updatePosterStyles("borderRadius", val || 0)}
            disabled={posterStyles.borderStyle === "none"}
          />
        </div>
        <div className="d-flex align-items-center mb-2">
          <small className="me-2 text-muted fst-italic">Color:</small>
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={posterStyles.borderColor}
            onChangeComplete={(c) =>
              updatePosterStyles("borderColor", c.toCssString())
            }
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            disabled={posterStyles.borderStyle === "none"}
          />
        </div>
      </div>
    </>
  );
};

export default PosterSetting;
