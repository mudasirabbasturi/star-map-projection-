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
  InputNumber,
  Select,
  Slider,
} from "antd";

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const Message = ({ styles, setStyles, fontFamilies }) => {
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

  // ✅ Safe updater for node styles
  const updateNodeStyle = (patch) => {
    setStyles({
      ...styles,
      nodes: {
        ...styles.nodes,
        message: { ...styles.nodes?.message, ...patch },
      },
    });
  };

  const node = styles.nodes?.message || {};

  return (
    <>
      {/* Width */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2">Width:</small>
          <Slider
            className="w-100 m-0 me-2"
            min={30}
            max={100}
            value={node.width}
            onChange={(value) => updateNodeStyle({ width: value || 0 })}
          />
          <InputNumber
            value={node.width}
            className="w-80"
            size="small"
            min={30}
            max={100}
            onChange={(value) => updateNodeStyle({ width: value || 0 })}
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="mb-2">
        <small className="me-2">Background Color:</small>
        <ColorPicker
          style={{ width: "100%" }}
          allowClear
          value={node.bgColor}
          onChangeComplete={(c) =>
            updateNodeStyle({ bgColor: c.toCssString() })
          }
          presets={presets}
          panelRender={customPanelRender}
          size="small"
        />
      </div>

      {/* Text Color */}
      <div className="mb-2">
        <small className="me-2">Text Color:</small>
        <ColorPicker
          style={{ width: "100%" }}
          allowClear
          value={node.textColor}
          onChangeComplete={(c) =>
            updateNodeStyle({ textColor: c.toCssString() })
          }
          presets={presets}
          panelRender={customPanelRender}
          size="small"
        />
      </div>

      {/* Font Family */}
      <div className="mb-2">
        <small className="me-2">Font Family:</small>
        <Select
          className="w-100"
          value={node.fontFamily}
          onChange={(val) => updateNodeStyle({ fontFamily: val })}
          options={fontFamilies.map((f) => ({ label: f, value: f }))}
          size="small"
        />
      </div>

      {/* Font Style */}
      <div className="mb-2">
        <small className="me-2">Font Style:</small>
        <Select
          className="w-100"
          value={node.fontStyle}
          onChange={(val) => updateNodeStyle({ fontStyle: val })}
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

      {/* Font Weight */}
      <div className="mb-2">
        <small className="me-2">Font Weight:</small>
        <Select
          className="w-100"
          value={node.fontWeight}
          onChange={(val) => updateNodeStyle({ fontWeight: val })}
          options={[
            { label: "Thin (100)", value: "100" },
            { label: "Normal (400)", value: "400" },
            { label: "Bold (700)", value: "700" },
            { label: "Black (900)", value: "900" },
          ]}
          size="small"
        />
      </div>

      {/* Font Size */}
      <div className="mb-2">
        <small className="me-2">Font Size:</small>
        <InputNumber
          value={node.fontSize}
          className="w-100"
          size="small"
          min={0}
          max={2000}
          onChange={(value) => updateNodeStyle({ fontSize: value || 0 })}
        />
      </div>

      {/* Text Decoration */}
      <div className="mb-2">
        <small className="me-2">Text Decoration:</small>
        <Select
          className="w-100"
          value={node.textDecoration}
          onChange={(val) => updateNodeStyle({ textDecoration: val })}
          options={[
            { label: "None", value: "none" },
            { label: "Underline", value: "underline" },
            { label: "Line Through", value: "line-through" },
          ]}
          size="small"
        />
      </div>

      {/* Text Transform */}
      <div className="mb-2">
        <small className="me-2">Text Transform:</small>
        <Select
          className="w-100"
          value={node.textTransform}
          onChange={(val) => updateNodeStyle({ textTransform: val })}
          options={[
            { label: "None", value: "none" },
            { label: "Uppercase", value: "uppercase" },
            { label: "Lowercase", value: "lowercase" },
            { label: "Capitalize", value: "capitalize" },
          ]}
          size="small"
        />
      </div>
    </>
  );
};

export default Message;
