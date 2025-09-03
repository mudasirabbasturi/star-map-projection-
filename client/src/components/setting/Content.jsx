// src/components/setting/Content.jsx
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
  InputNumber,
  Select,
  Slider,
  Checkbox,
} from "antd";

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}
const Content = ({ styles, setStyles, fontFamilies }) => {
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
            style={{ height: 300, overflowY: "auto", padding: "5px 0 5px 4px" }}
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
      {/* Width */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Width:
          </small>
          <Slider
            className="w-100 m-0 me-2"
            min={30}
            max={100}
            value={styles.width}
            onChange={(value) => setStyles({ ...styles, width: value || 0 })}
          />
          <InputNumber
            value={styles.width}
            className="w-80"
            size="small"
            min={30}
            max={100}
            onChange={(value) => setStyles({ ...styles, width: value || 0 })}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Height */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Height:
          </small>
          <Slider
            className="w-100 m-0 me-2"
            min={0}
            max={50}
            value={styles.height}
            onChange={(value) => setStyles({ ...styles, height: value || 0 })}
          />
          <InputNumber
            value={styles.height}
            className="w-80"
            size="small"
            min={0}
            max={50}
            onChange={(value) => setStyles({ ...styles, height: value || 0 })}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Background Color */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Background Color:
          </small>
          <ColorPicker
            style={{
              width: "100%",
            }}
            allowClear
            value={styles.bgColor}
            onChangeComplete={(color) =>
              setStyles({ ...styles, bgColor: color.toCssString() })
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
      {/* Background Color */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Text Color:
          </small>
          <ColorPicker
            style={{
              width: "100%",
            }}
            allowClear
            value={styles.textColor}
            onChangeComplete={(color) =>
              setStyles({ ...styles, textColor: color.toCssString() })
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
      {/* Font family */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Font Family:
          </small>
          <Select
            className="w-100"
            value={styles.fontFamily}
            onChange={(val) => setStyles({ ...styles, fontFamily: val })}
            options={fontFamilies.map((f) => ({ label: f, value: f }))} // <-- mapping correctly
            size="small"
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Font Style */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Font Style:
          </small>
          <Select
            className="w-100"
            value={styles.fontStyle}
            onChange={(val) => setStyles({ ...styles, fontStyle: val })}
            options={[
              { label: "Normal", value: "normal" },
              { label: "Italic", value: "italic" },
              { label: "Oblique", value: "oblique" },
              { label: "Oblique 10°", value: "oblique 10deg" },
              { label: "Oblique 20°", value: "oblique 20deg" },
            ]}
            size="small"
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Font Weight */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Font Weight:
          </small>
          <Select
            className="w-100"
            value={styles.fontWeight}
            onChange={(val) => setStyles({ ...styles, fontWeight: val })}
            options={[
              { label: "Thin (100)", value: "100" },
              { label: "Extra Light (200)", value: "200" },
              { label: "Light (300)", value: "300" },
              { label: "Normal (400)", value: "400" },
              { label: "Medium (500)", value: "500" },
              { label: "Semi-Bold (600)", value: "600" },
              { label: "Bold (700)", value: "700" },
              { label: "Extra-Bold (800)", value: "800" },
              { label: "Black (900)", value: "900" },
              { label: "Lighter", value: "lighter" },
              { label: "Bolder", value: "bolder" },
            ]}
            size="small"
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Font Size */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Font Size:
          </small>
          <InputNumber
            value={styles.fontSize}
            className="w-100"
            size="small"
            min={0}
            max={2000}
            onChange={(value) => setStyles({ ...styles, fontSize: value || 0 })}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Text Decoration */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Text Decoration:
          </small>
          <Select
            className="w-100"
            value={styles.textDecoration}
            onChange={(val) => setStyles({ ...styles, textDecoration: val })}
            options={[
              { label: "None", value: "none" },
              { label: "Underline", value: "underline" },
              { label: "Overline", value: "overline" },
              { label: "Line Through", value: "line-through" },
              {
                label: "Underline + Overline",
                value: "underline overline",
              },
              { label: "Wavy Underline", value: "underline wavy" },
              { label: "Dotted Underline", value: "underline dotted" },
              { label: "Dashed Underline", value: "underline dashed" },
              { label: "Double Underline", value: "underline double" },
            ]}
            size="small"
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Text Transform:
          </small>
          <Select
            className="w-100"
            value={styles.textTransform}
            onChange={(val) => setStyles({ ...styles, textTransform: val })}
            options={[
              { label: "None", value: "none" },
              { label: "Uppercase", value: "uppercase" },
              { label: "Lowercase", value: "lowercase" },
              { label: "Capitalize", value: "capitalize" },
              { label: "Full Width", value: "full-width" },
            ]}
            size="small"
          />
        </div>
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
            onChange={(value) => setStyles({ ...styles, borderStyle: value })}
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
            onChange={(value) =>
              setStyles({ ...styles, borderWidth: value || 0 })
            }
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
            onChange={(value) =>
              setStyles({ ...styles, borderRadius: value || 0 })
            }
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
            value={styles.borderColor || styles.color}
            onChangeComplete={(color) =>
              setStyles({ ...styles, borderColor: color.toCssString() })
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
      {/* Checkbox show/hide Content */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div>
          <Checkbox
            checked={styles.show.showMessage}
            onChange={(e) =>
              setStyles({
                ...styles,
                show: { ...styles.show, showMessage: e.target.checked },
              })
            }
          >
            Show Message{" "}
          </Checkbox>
          <Checkbox
            checked={styles.show.showTitle}
            onChange={(e) =>
              setStyles({
                ...styles,
                show: { ...styles.show, showTitle: e.target.checked },
              })
            }
          >
            Show Title
          </Checkbox>
          <Checkbox
            checked={styles.show.showAddress}
            onChange={(e) =>
              setStyles({
                ...styles,
                show: { ...styles.show, showAddress: e.target.checked },
              })
            }
          >
            Show Address
          </Checkbox>
          <Checkbox
            checked={styles.show.showDate}
            onChange={(e) =>
              setStyles({
                ...styles,
                show: { ...styles.show, showDate: e.target.checked },
              })
            }
          >
            Show Date
          </Checkbox>
          <Checkbox
            checked={styles.show.showCoordinate}
            onChange={(e) =>
              setStyles({
                ...styles,
                show: { ...styles.show, showCoordinate: e.target.checked },
              })
            }
          >
            Show Coordinate
          </Checkbox>
        </div>
        <hr className="mb-0 mt-1" />
      </div>
    </>
  );
};
export default Content;
