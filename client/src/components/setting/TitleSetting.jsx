// src/components/setting/ContentSetting.jsx
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
  Checkbox,
  Input,
  InputNumber,
  Select,
  Slider,
  DatePicker,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const TitleSetting = ({ styles, updateStyles, content, onChangeContent }) => {
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
      {/* Checkbox show/hide title */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Show / Hide Title</Divider>
        <div className="d-flex align-items-center justify-content-center">
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.show.title}
            onChange={(e) => updateStyles("show.title", e.target.checked)}
          >
            Show / Hide Title
          </Checkbox>
        </div>
      </div>
      {/* Input Value */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Title Text</Divider>
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <Input
              value={content.title}
              onChange={(e) => onChangeContent("title", e.target.value)}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
      </div>
      {/* Title Width And Heigth */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Title Width & Height</Divider>
        {/* Title Width */}
        <div className="">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Width:
            </small>
            <Slider
              value={styles.content.title.width}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={30}
              max={100}
              onChange={(value) => updateStyles("content.title.width", value)}
              disabled={styles.show.title === false}
            />
            <InputNumber
              value={styles.content.title.width}
              className="ms-1 me-1"
              size="small"
              min={30}
              max={100}
              onChange={(value) => updateStyles("content.title.width", value)}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
        {/* Title Height */}
        <div className="">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Height:
            </small>
            <Slider
              value={styles.content.title.height}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={3}
              max={100}
              onChange={(value) => updateStyles("content.title.height", value)}
              disabled={styles.show.title === false}
            />
            <InputNumber
              value={styles.content.title.height}
              className="ms-1 me-1"
              size="small"
              min={3}
              max={100}
              onChange={(value) => updateStyles("content.title.height", value)}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
      </div>
      {/* Title Padding */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Title Padding</Divider>
        <div className="">
          <div className="d-flex align-items-center">
            <InputNumber
              className="me-1"
              value={styles.content.title.paddingTop}
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateStyles("content.title.paddingTop", value)
              }
              disabled={styles.show.title === false}
            />
            <InputNumber
              className="me-1"
              value={styles.content.title.paddingBottom}
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateStyles("content.title.paddingBottom", value)
              }
              disabled={styles.show.title === false}
            />
            <InputNumber
              className="me-1"
              value={styles.content.title.paddingLeft}
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateStyles("content.title.paddingLeft", value)
              }
              disabled={styles.show.title === false}
            />
            <InputNumber
              className="me-1"
              value={styles.content.title.paddingRight}
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateStyles("content.title.paddingRight", value)
              }
              disabled={styles.show.title === false}
            />
          </div>
          <div className="d-flex align-items-center">
            <small className="w-100 text-muted fst-italic"> Top</small>
            <small className="w-100 text-muted fst-italic"> Bottom</small>
            <small className="w-100 text-muted fst-italic"> Left</small>
            <small className="w-100 text-muted fst-italic"> Right</small>
          </div>
        </div>
      </div>
      {/* Content Background Color */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Content Background</Divider>
        <div className="d-flex align-items-center">
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={styles.content.title.bgColor}
            onChangeComplete={(color) =>
              updateStyles("content.title.bgColor", color.toCssString())
            }
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            dropdownAlign={{
              points: ["tl", "bl"],
              overflow: { adjustY: true },
            }}
            disabled={styles.show.title === false}
          />
        </div>
      </div>
      {/* Content Border */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Title Border</Divider>
        {/* Border Style */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Style:
            </small>
            <Select
              className="w-100"
              value={styles.content.title.borderStyle}
              onChange={(value) =>
                updateStyles("content.title.borderStyle", value)
              }
              size="small"
              options={[
                { label: "Solid", value: "solid" },
                { label: "Dashed", value: "dashed" },
                { label: "Dotted", value: "dotted" },
                { label: "Double", value: "double" },
                { label: "None", value: "none" },
              ]}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
        {/* Border Width */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Width:
            </small>
            <Slider
              value={styles.content.title.borderWidth}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={0}
              max={20}
              onChange={(value) =>
                updateStyles("content.title.borderWidth", value || 0)
              }
              disabled={
                styles.show.title === false ||
                styles.content.title.borderStyle === "none"
              }
            />
            <InputNumber
              value={styles.content.title.borderWidth}
              className="w-20"
              size="small"
              min={0}
              max={20}
              onChange={(value) =>
                updateStyles("content.title.borderWidth", value || 0)
              }
              disabled={
                styles.show.title === false ||
                styles.content.title.borderStyle === "none"
              }
            />
          </div>
        </div>
        {/* Border Radius */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Radius:
            </small>
            <Slider
              value={styles.content.title.borderRadius}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateStyles("content.title.borderRadius", value || 0)
              }
              disabled={
                styles.show.title === false ||
                styles.content.title.borderStyle === "none"
              }
            />
            <InputNumber
              value={styles.content.title.borderRadius}
              className="w-20"
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateStyles("content.title.borderRadius", value || 0)
              }
              disabled={
                styles.show.title === false ||
                styles.content.title.borderStyle === "none"
              }
            />
          </div>
        </div>
        {/* Border Color */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Color:
            </small>
            <ColorPicker
              style={{
                width: "100%",
              }}
              allowClear
              value={styles.content.title.borderColor}
              onChangeComplete={(color) =>
                updateStyles("content.title.borderColor", color.toCssString())
              }
              styles={{ popupOverlayInner: { width: 480 } }}
              presets={presets}
              panelRender={customPanelRender}
              size="small"
              dropdownAlign={{
                points: ["tl", "bl"],
                overflow: { adjustY: true },
              }}
              disabled={
                styles.show.title === false ||
                styles.content.title.borderStyle === "none"
              }
            />
          </div>
        </div>
      </div>
      {/* Text Styling */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Font</Divider>
        {/* Font Family */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Family:
            </small>
            <Select
              className="w-100"
              value={styles.content.title.fontFamily}
              onChange={(value) =>
                updateStyles("content.title.fontFamily", value)
              }
              size="small"
              options={[
                { label: "Arial", value: "Arial, sans-serif" },
                { label: "Helvetica", value: "Helvetica, sans-serif" },
                { label: "Verdana", value: "Verdana, sans-serif" },
                { label: "Tahoma", value: "Tahoma, sans-serif" },
                {
                  label: "Trebuchet MS",
                  value: "'Trebuchet MS', sans-serif",
                },
                {
                  label: "Times New Roman",
                  value: "'Times New Roman', serif",
                },
                { label: "Georgia", value: "Georgia, serif" },
                { label: "Garamond", value: "Garamond, serif" },
                { label: "Courier New", value: "'Courier New', monospace" },
                {
                  label: "Brush Script MT",
                  value: "'Brush Script MT', cursive",
                },
              ]}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
        {/* Font Style */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Style:
            </small>
            <Select
              className="w-100"
              value={styles.content.title.fontStyle}
              onChange={(value) =>
                updateStyles("content.title.fontStyle", value)
              }
              size="small"
              options={[
                { label: "Normal", value: "normal" }, // default
                { label: "Italic", value: "italic" }, // italicized text
                { label: "Oblique", value: "oblique" }, // slanted (like italic, but not true italics)
              ]}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
        {/* Font Width */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Width:
            </small>
            <Select
              className="w-100"
              value={styles.content.title.fontWeight}
              onChange={(value) =>
                updateStyles("content.title.fontWeight", value)
              }
              size="small"
              options={[
                { label: "Normal", value: "normal" }, // default = 400
                { label: "Bold", value: "bold" }, // same as 700
                { label: "Bolder", value: "bolder" }, // relative heavier
                { label: "Lighter", value: "lighter" }, // relative lighter
                { label: "100 (Thin)", value: "100" },
                { label: "200 (Extra Light)", value: "200" },
                { label: "300 (Light)", value: "300" },
                { label: "400 (Normal)", value: "400" },
                { label: "500 (Medium)", value: "500" },
                { label: "600 (Semi Bold)", value: "600" },
                { label: "700 (Bold)", value: "700" },
                { label: "800 (Extra Bold)", value: "800" },
                { label: "900 (Black)", value: "900" },
              ]}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
        {/* Font Size */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Size:
            </small>
            <Slider
              className="w-100 me-2 mt-0 mb-0"
              max={10}
              step={0.1}
              value={styles.content.title.fontSize}
              onChange={(value) =>
                updateStyles("content.title.fontSize", value || 0)
              }
              disabled={styles.show.title === false}
            />
            <InputNumber
              value={styles.content.title.fontSize}
              className="w-20"
              size="small"
              max={10}
              step={0.1}
              onChange={(value) =>
                updateStyles("content.title.fontSize", value || 0)
              }
              disabled={styles.show.title === false}
            />
          </div>
        </div>
        {/* Text Color */}
        <div className="mb-2">
          <Divider style={{ fontStyle: "italic" }}>Text</Divider>
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Color:
            </small>
            <ColorPicker
              style={{ width: "100%" }}
              allowClear
              value={styles.content.title.textColor}
              onChangeComplete={(color) =>
                updateStyles("content.title.textColor", color.toCssString())
              }
              styles={{ popupOverlayInner: { width: 480 } }}
              presets={presets}
              panelRender={customPanelRender}
              size="small"
              dropdownAlign={{
                points: ["tl", "bl"],
                overflow: { adjustY: true },
              }}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
        {/* Text Transform */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Transform:
            </small>
            <Select
              className="w-100"
              value={styles.content.title.textTransform}
              onChange={(value) =>
                updateStyles("content.title.textTransform", value)
              }
              size="small"
              options={[
                { label: "None", value: "none" }, // default, no transform
                { label: "Capitalize", value: "capitalize" }, // "hello world" → "Hello World"
                { label: "Uppercase", value: "uppercase" }, // "hello" → "HELLO"
                { label: "Lowercase", value: "lowercase" }, // "HELLO" → "hello"
                { label: "Full Width", value: "full-width" }, // normal → ｎｏｒｍａｌ (rarely used)
              ]}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
        {/* Text Decoration */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Decoration:
            </small>
            <Select
              className="w-100"
              value={styles.content.title.textDecoration}
              onChange={(value) =>
                updateStyles("content.title.textDecoration", value)
              }
              size="small"
              options={[
                { label: "None", value: "none" }, // no decoration
                { label: "Underline", value: "underline" }, // adds underline
                { label: "Overline", value: "overline" }, // line above text
                { label: "Line Through", value: "line-through" }, // strike-through
                {
                  label: "Underline + Overline",
                  value: "underline overline",
                },
              ]}
              disabled={styles.show.title === false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TitleSetting;
