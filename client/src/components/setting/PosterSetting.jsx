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
} from "antd";

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

  const customPanelRender = (_, { components: { Picker, Presets } }) => {
    return (
      <Row justify="space-between" wrap={false}>
        <Col span={12}>
          <div
            style={{
              height: 300,
              overflowY: "auto",
              padding: "5px 0 5px 4px",
              margin: "0px",
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
  };

  return (
    <>
      {/* Paper Size */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Paper Size:
          </small>
          <Select
            className="w-100"
            value={styles.paperSize}
            onChange={(value) => updateStyles("paperSize", value)}
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
        <hr className="mb-0 mt-1" />
      </div>
      {/* Download Type */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Download Type:
          </small>
          <Select
            className="w-100"
            value={content.downloadType}
            onChange={(value) => onChangeContent("downloadType", value)}
            options={[
              { label: "PDF", value: "pdf" },
              { label: "PNG", value: "png" },
              { label: "JPEG", value: "jpeg" },
            ]}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Download File Name */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            File Name:
          </small>
          <Input
            value={content.fileName}
            onChange={(e) => onChangeContent("fileName", e.target.value)}
            size="small"
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Background Color */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center mb-2">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Background Type:
          </small>
          <Select
            value={styles.bgType}
            style={{ width: 120 }}
            onChange={(value) => updateStyles("bgType", value)}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Gradient", value: "gradient" },
            ]}
          />
        </div>

        {styles.bgType === "solid" ? (
          // --- SOLID COLOR PICKER ---
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={styles.bgColor}
            onChangeComplete={(color) =>
              updateStyles("bgColor", color.toCssString())
            }
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            dropdownAlign={{
              points: ["tl", "bl"],
              overflow: { adjustY: true },
            }}
          />
        ) : (
          // --- GRADIENT SETTINGS ---
          <div>
            {/* Gradient Type Selector */}
            <div className="d-flex align-items-center mb-2">
              <small className="me-2">Gradient Type:</small>
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

            {/* Angle only for Linear & Conic */}
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

            {/* Gradient preview bar */}
            <div
              style={{
                height: 30,
                borderRadius: 6,
                marginBottom: 8,
                border: "1px solid #ccc",
                background: `linear-gradient(to right, ${styles.bgGradientColor.join(
                  ", "
                )})`,
              }}
            />

            {/* Gradient color pickers */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {styles.bgGradientColor.map((color, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <ColorPicker
                    value={color}
                    onChangeComplete={(c) => {
                      const newColors = [...styles.bgGradientColor];
                      newColors[index] = c.toCssString();
                      updateStyles("bgGradientColor", newColors);
                    }}
                    styles={{ popupOverlayInner: { width: 480 } }}
                    presets={presets}
                    panelRender={customPanelRender}
                    size="small"
                  />
                  {styles.bgGradientColor.length > 2 && (
                    <button
                      onClick={() => {
                        const newColors = styles.bgGradientColor.filter(
                          (_, i) => i !== index
                        );
                        updateStyles("bgGradientColor", newColors);
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

            {/* Add stop button */}
            <button
              onClick={() =>
                updateStyles("bgGradientColor", [
                  ...styles.bgGradientColor,
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

        <hr className="mb-0 mt-1" />
      </div>

      {/* Border Style */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Border Style:
          </small>
          <Select
            className="w-100"
            value={styles.borderStyle}
            onChange={(value) => updateStyles("borderStyle", value)}
            size="small"
            options={[
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
              { label: "Double", value: "double" },
              { label: "None", value: "none" },
            ]}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>

      {/* Border Width */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Border Width:
          </small>
          <InputNumber
            value={styles.borderWidth}
            className="w-100"
            size="small"
            min={0}
            max={20}
            onChange={(value) => updateStyles("borderWidth", value || 0)}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>

      {/* Border Radius */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Border Radius:
          </small>
          <InputNumber
            value={styles.borderRadius}
            className="w-100"
            size="small"
            min={0}
            max={50}
            onChange={(value) => updateStyles("borderRadius", value || 0)}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>

      {/* Border Color */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Border Color:
          </small>
          <ColorPicker
            style={{
              width: "100%",
            }}
            allowClear
            value={styles.borderColor}
            onChangeComplete={(color) =>
              updateStyles("borderColor", color.toCssString())
            }
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            dropdownAlign={{
              points: ["tl", "bl"],
              overflow: { adjustY: true },
            }}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
    </>
  );
};

export default PosterSetting;
