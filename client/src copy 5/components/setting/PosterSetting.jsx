// src/components/setting/PosterSetting.jsx
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
} from "antd";
import BackgroundImagePicker from "./BackgroundImagePicker";

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const PosterSetting = ({ styles, updateStyles, content, onChangeContent }) => {
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

  return (
    <>
      {/* Paper Size */}
      <div className="mb-2">
        <Divider>Paper Size</Divider>
        <Select
          className="w-100"
          value={styles.paperSize}
          onChange={(val) => updateStyles("paperSize", val)}
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
          <small className="me-2">Type:</small>
          <Select
            value={styles.bgType}
            style={{ width: 140 }}
            onChange={(val) => updateStyles("bgType", val)}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Gradient", value: "gradient" },
            ]}
          />
        </div>

        {/* Solid */}
        {styles.bgType === "solid" && (
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={styles.bgColor}
            onChangeComplete={(c) => updateStyles("bgColor", c.toCssString())}
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
          />
        )}

        {/* Gradient */}
        {styles.bgType === "gradient" && (
          <div>
            <div className="d-flex align-items-center mb-2">
              <small className="me-2">Type:</small>
              <Select
                value={styles.bgGradientType}
                style={{ width: 140 }}
                onChange={(val) => updateStyles("bgGradientType", val)}
                options={[
                  { label: "Linear", value: "linear" },
                  { label: "Radial", value: "radial" },
                  { label: "Conic", value: "conic" },
                ]}
              />
            </div>

            {(styles.bgGradientType === "linear" ||
              styles.bgGradientType === "conic") && (
              <div className="d-flex align-items-center mb-2">
                <small className="me-2">Angle:</small>
                <InputNumber
                  min={0}
                  max={360}
                  value={styles.bgGradientAngle}
                  onChange={(val) => updateStyles("bgGradientAngle", val || 0)}
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
                background: `linear-gradient(to right, ${styles.bgGradientColors.join(
                  ", "
                )})`,
              }}
            />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {styles.bgGradientColors.map((color, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <ColorPicker
                    value={color}
                    onChangeComplete={(c) => {
                      const newColors = [...styles.bgGradientColors];
                      newColors[idx] = c.toCssString();
                      updateStyles("bgGradientColors", newColors);
                    }}
                    styles={{ popupOverlayInner: { width: 480 } }}
                    presets={presets}
                    panelRender={customPanelRender}
                    size="small"
                  />
                  {styles.bgGradientColors.length > 2 && (
                    <button
                      onClick={() => {
                        const newColors = styles.bgGradientColors.filter(
                          (_, i) => i !== idx
                        );
                        updateStyles("bgGradientColors", newColors);
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
                updateStyles("bgGradientColors", [
                  ...styles.bgGradientColors,
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
        <BackgroundImagePicker styles={styles} updateStyles={updateStyles} />
        <Select
          value={styles.bgImageMode}
          onChange={(val) => updateStyles("bgImageMode", val)}
          style={{ width: "100%", marginTop: 8 }}
          options={[
            { label: "Cover", value: "cover" },
            { label: "Contain", value: "contain" },
            { label: "Stretch", value: "100% 100%" }, // map stretch to CSS
          ]}
        />
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={styles.bgImageOpacity}
          onChange={(val) => updateStyles("bgImageOpacity", val)}
        />
      </div>
      {/* Border */}
      <div className="mb-2">
        <Divider>Border</Divider>
        <div className="mb-2">
          <small className="me-2">Style:</small>
          <Select
            className="w-100"
            size="small"
            value={styles.borderStyle}
            onChange={(val) => updateStyles("borderStyle", val)}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
              { label: "Double", value: "double" },
              { label: "None", value: "none" },
            ]}
          />
        </div>
        <div className="mb-2">
          <small className="me-2">Width:</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={20}
            value={styles.borderWidth}
            onChange={(val) => updateStyles("borderWidth", val || 0)}
          />
        </div>
        <div className="mb-2">
          <small className="me-2">Radius:</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={50}
            value={styles.borderRadius}
            onChange={(val) => updateStyles("borderRadius", val || 0)}
          />
        </div>
        <div className="mb-2">
          <small className="me-2">Color:</small>
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={styles.borderColor}
            onChangeComplete={(c) =>
              updateStyles("borderColor", c.toCssString())
            }
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
          />
        </div>
      </div>
    </>
  );
};

export default PosterSetting;
