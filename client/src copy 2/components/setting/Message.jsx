// src/components/setting/Message.jsx
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
  Tooltip,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const Message = ({
  content,
  onChangeContent,
  styles,
  setStyles,
  fontFamilies,
  globalStyle,
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

  const defaultValues = {
    width: 100,
    bgColor: "transparent",
    textColor: "#ff9c6e",
    fontFamily: "Verdana",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    textDecoration: "none",
    textTransform: "capitalize",
  };

  const isInherited = (key) => {
    return (
      (styles[key] === undefined ||
        styles[key] === null ||
        styles[key] === "") &&
      globalStyle &&
      globalStyle[key]
    );
  };

  const getDisplayValue = (key) => {
    if (
      styles[key] !== undefined &&
      styles[key] !== null &&
      styles[key] !== ""
    ) {
      return styles[key];
    }
    if (
      globalStyle &&
      globalStyle[key] !== undefined &&
      globalStyle[key] !== null &&
      globalStyle[key] !== ""
    ) {
      return globalStyle[key];
    }
    return defaultValues[key];
  };

  const handleNumberChange = (key, value) => {
    setStyles({
      ...styles,
      [key]: value !== null && value !== undefined ? value : undefined,
    });
  };

  const customPanelRender = (_, { components: { Picker, Presets } }) => (
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

  const getNumberValue = (key) =>
    styles[key] !== undefined ? styles[key] : getDisplayValue(key);

  return (
    <>
      {/* Message */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Message:
          </small>
          <Input
            value={content.message}
            onChange={(e) => onChangeContent({ message: e.target.value })}
            size="small"
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Width */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Width:
            {isInherited("width") && (
              <Tooltip title="Inherited from global content settings">
                <QuestionCircleOutlined className="ms-1" />
              </Tooltip>
            )}
          </small>
          <Slider
            className="w-100 m-0 me-2"
            min={30}
            max={100}
            value={getNumberValue("width")}
            onChange={(value) => handleNumberChange("width", value)}
          />
          <InputNumber
            value={getNumberValue("width")}
            className="w-80"
            size="small"
            min={30}
            max={100}
            onChange={(value) => handleNumberChange("width", value)}
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
            {isInherited("bgColor") && (
              <Tooltip title="Inherited from global content settings">
                <QuestionCircleOutlined className="ms-1" />
              </Tooltip>
            )}
          </small>
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={getDisplayValue("bgColor")}
            onChangeComplete={(color) =>
              setStyles({
                ...styles,
                bgColor: color ? color.toCssString() : undefined,
              })
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

      {/* Text Color */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Text Color:
            {isInherited("textColor") && (
              <Tooltip title="Inherited from global content settings">
                <QuestionCircleOutlined className="ms-1" />
              </Tooltip>
            )}
          </small>
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={getDisplayValue("textColor")}
            onChangeComplete={(color) =>
              setStyles({
                ...styles,
                textColor: color ? color.toCssString() : undefined,
              })
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

      {/* Font Family */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Font Family:
            {isInherited("fontFamily") && (
              <Tooltip title="Inherited from global content settings">
                <QuestionCircleOutlined className="ms-1" />
              </Tooltip>
            )}
          </small>
          <Select
            className="w-100"
            value={getDisplayValue("fontFamily")}
            onChange={(val) => setStyles({ ...styles, fontFamily: val })}
            options={fontFamilies.map((f) => ({ label: f, value: f }))}
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
            {isInherited("fontStyle") && (
              <Tooltip title="Inherited from global content settings">
                <QuestionCircleOutlined className="ms-1" />
              </Tooltip>
            )}
          </small>
          <Select
            className="w-100"
            value={getDisplayValue("fontStyle")}
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
            {isInherited("fontWeight") && (
              <Tooltip title="Inherited from global content settings">
                <QuestionCircleOutlined className="ms-1" />
              </Tooltip>
            )}
          </small>
          <Select
            className="w-100"
            value={getDisplayValue("fontWeight")}
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
            {isInherited("fontSize") && (
              <Tooltip title="Inherited from global content settings">
                <QuestionCircleOutlined className="ms-1" />
              </Tooltip>
            )}
          </small>
          <Slider
            className="w-100 m-0 me-2"
            min={8}
            max={72}
            value={getNumberValue("fontSize")}
            onChange={(value) => handleNumberChange("fontSize", value)}
          />
          <InputNumber
            value={getNumberValue("fontSize")}
            className="w-80"
            size="small"
            min={8}
            max={200}
            onChange={(value) => handleNumberChange("fontSize", value)}
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
            {isInherited("textDecoration") && (
              <Tooltip title="Inherited from global content settings">
                <QuestionCircleOutlined className="ms-1" />
              </Tooltip>
            )}
          </small>
          <Select
            className="w-100"
            value={getDisplayValue("textDecoration")}
            onChange={(val) => setStyles({ ...styles, textDecoration: val })}
            options={[
              { label: "None", value: "none" },
              { label: "Underline", value: "underline" },
              { label: "Overline", value: "overline" },
              { label: "Line Through", value: "line-through" },
              { label: "Underline + Overline", value: "underline overline" },
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

      {/* Text Transform */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Text Transform:
            {isInherited("textTransform") && (
              <Tooltip title="Inherited from global content settings">
                <QuestionCircleOutlined className="ms-1" />
              </Tooltip>
            )}
          </small>
          <Select
            className="w-100"
            value={getDisplayValue("textTransform")}
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
    </>
  );
};

export default Message;
