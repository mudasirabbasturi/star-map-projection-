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
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small style={{ whiteSpace: "nowrap" }} className="me-2">
            Paper Size:
          </small>
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
        <hr className="mb-0 mt-1" />
      </div>

      {/* Download Type */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small style={{ whiteSpace: "nowrap" }} className="me-2">
            Download Type:
          </small>
          <Select
            className="w-100"
            value={content.downloadType}
            onChange={(val) => onChangeContent("downloadType", val)}
            options={[
              { label: "PDF", value: "pdf" },
              { label: "PNG", value: "png" },
              { label: "JPEG", value: "jpeg" },
            ]}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>

      {/* File Name */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small style={{ whiteSpace: "nowrap" }} className="me-2">
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

      {/* Background */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center mb-2">
          <small style={{ whiteSpace: "nowrap" }} className="me-2">
            Background Type:
          </small>
          <Select
            value={styles.bgType}
            style={{ width: 120 }}
            onChange={(val) => updateStyles("bgType", val)}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Gradient", value: "gradient" },
            ]}
          />
        </div>

        {styles.bgType === "solid" ? (
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
        ) : (
          <div>
            {/* Gradient Type */}
            <div className="d-flex align-items-center mb-2">
              <small style={{ whiteSpace: "nowrap" }} className="me-2">
                Gradient Type:
              </small>
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

            {/* Angle for Linear/Conic */}
            {(styles.bgGradientType === "linear" ||
              styles.bgGradientType === "conic") && (
              <div className="d-flex align-items-center mb-2">
                <small style={{ whiteSpace: "nowrap" }} className="me-2">
                  Angle:
                </small>
                <InputNumber
                  min={0}
                  max={360}
                  value={styles.bgGradientAngle}
                  onChange={(val) => updateStyles("bgGradientAngle", val || 0)}
                />
                <span className="ms-1">°</span>
              </div>
            )}

            {/* Gradient Preview */}
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

            {/* Gradient Colors */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {styles.bgGradientColor.map((color, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <ColorPicker
                    value={color}
                    onChangeComplete={(c) => {
                      const newColors = [...styles.bgGradientColor];
                      newColors[idx] = c.toCssString();
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
                          (_, i) => i !== idx
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

      {/* Border Settings */}
      {[
        {
          label: "Border Style",
          key: "borderStyle",
          type: "select",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
            { label: "Double", value: "double" },
            { label: "None", value: "none" },
          ],
        },
        {
          label: "Border Width",
          key: "borderWidth",
          type: "number",
          min: 0,
          max: 20,
        },
        {
          label: "Border Radius",
          key: "borderRadius",
          type: "number",
          min: 0,
          max: 50,
        },
      ].map((item) => (
        <div className="mb-2" key={item.key}>
          <hr className="mb-1 mt-0" />
          <div className="d-flex align-items-center">
            <small style={{ whiteSpace: "nowrap" }} className="me-2">
              {item.label}:
            </small>
            {item.type === "select" ? (
              <Select
                className="w-100"
                size="small"
                value={styles[item.key]}
                onChange={(val) => updateStyles(item.key, val)}
                options={item.options}
              />
            ) : (
              <InputNumber
                className="w-100"
                size="small"
                min={item.min}
                max={item.max}
                value={styles[item.key]}
                onChange={(val) => updateStyles(item.key, val || 0)}
              />
            )}
          </div>
          <hr className="mb-0 mt-1" />
        </div>
      ))}

      {/* Border Color */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small style={{ whiteSpace: "nowrap" }} className="me-2">
            Border Color:
          </small>
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
        <hr className="mb-0 mt-1" />
      </div>
    </>
  );
};

export default PosterSetting;
