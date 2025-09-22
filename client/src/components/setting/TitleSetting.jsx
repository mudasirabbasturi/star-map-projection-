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

const TitleSetting = ({
  titleStyles,
  updateTitleStyles,
  showStyles,
  updateShowStyles,
  content,
  onChangeContent,
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
            checked={showStyles.title}
            onChange={(e) => updateShowStyles("title", e.target.checked)}
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
              disabled={showStyles.title === false}
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
              value={titleStyles.width}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={30}
              max={100}
              onChange={(value) => updateTitleStyles("width", value)}
              disabled={showStyles.title === false}
            />
            <InputNumber
              value={titleStyles.width}
              className="ms-1 me-1"
              size="small"
              min={30}
              max={100}
              onChange={(value) => updateTitleStyles("width", value)}
              disabled={showStyles.title === false}
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
              value={titleStyles.height}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={3}
              max={100}
              onChange={(value) => updateTitleStyles("height", value)}
              disabled={showStyles.title === false}
            />
            <InputNumber
              value={titleStyles.height}
              className="ms-1 me-1"
              size="small"
              min={3}
              max={100}
              onChange={(value) => updateTitleStyles("height", value)}
              disabled={showStyles.title === false}
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
              value={titleStyles.paddingTop}
              size="small"
              min={0}
              max={50}
              onChange={(value) => updateTitleStyles("paddingTop", value)}
              disabled={showStyles.title === false}
            />
            <InputNumber
              className="me-1"
              value={titleStyles.paddingBottom}
              size="small"
              min={0}
              max={50}
              onChange={(value) => updateTitleStyles("paddingBottom", value)}
              disabled={showStyles.title === false}
            />
            <InputNumber
              className="me-1"
              value={titleStyles.paddingLeft}
              size="small"
              min={0}
              max={50}
              onChange={(value) => updateTitleStyles("paddingLeft", value)}
              disabled={showStyles.title === false}
            />
            <InputNumber
              className="me-1"
              value={titleStyles.paddingRight}
              size="small"
              min={0}
              max={50}
              onChange={(value) => updateTitleStyles("paddingRight", value)}
              disabled={showStyles.title === false}
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
            value={titleStyles.bgColor}
            onChangeComplete={(color) =>
              updateTitleStyles("bgColor", color.toCssString())
            }
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            dropdownAlign={{
              points: ["tl", "bl"],
              overflow: { adjustY: true },
            }}
            disabled={showStyles.title === false}
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
              value={titleStyles.borderStyle}
              onChange={(value) => updateTitleStyles("borderStyle", value)}
              size="small"
              options={[
                { label: "Solid", value: "solid" },
                { label: "Dashed", value: "dashed" },
                { label: "Dotted", value: "dotted" },
                { label: "Double", value: "double" },
                { label: "None", value: "none" },
              ]}
              disabled={showStyles.title === false}
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
              value={titleStyles.borderWidth}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={0}
              max={20}
              onChange={(value) => updateTitleStyles("borderWidth", value || 0)}
              disabled={
                showStyles.title === false || titleStyles.borderStyle === "none"
              }
            />
            <InputNumber
              value={titleStyles.borderWidth}
              className="w-20"
              size="small"
              min={0}
              max={20}
              onChange={(value) => updateTitleStyles("borderWidth", value || 0)}
              disabled={
                showStyles.title === false || titleStyles.borderStyle === "none"
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
              value={titleStyles.borderRadius}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateTitleStyles("borderRadius", value || 0)
              }
              disabled={
                showStyles.title === false || titleStyles.borderStyle === "none"
              }
            />
            <InputNumber
              value={titleStyles.borderRadius}
              className="w-20"
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateTitleStyles("borderRadius", value || 0)
              }
              disabled={
                showStyles.title === false || titleStyles.borderStyle === "none"
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
              value={titleStyles.borderColor}
              onChangeComplete={(color) =>
                updateTitleStyles("borderColor", color.toCssString())
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
                showStyles.title === false || titleStyles.borderStyle === "none"
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
              value={titleStyles.fontFamily}
              onChange={(value) => updateTitleStyles("fontFamily", value)}
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
              disabled={showStyles.title === false}
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
              value={titleStyles.fontStyle}
              onChange={(value) => updateTitleStyles("fontStyle", value)}
              size="small"
              options={[
                { label: "Normal", value: "normal" }, // default
                { label: "Italic", value: "italic" }, // italicized text
                { label: "Oblique", value: "oblique" }, // slanted (like italic, but not true italics)
              ]}
              disabled={showStyles.title === false}
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
              value={titleStyles.fontWeight}
              onChange={(value) => updateTitleStyles("fontWeight", value)}
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
              disabled={showStyles.title === false}
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
              value={titleStyles.fontSize}
              onChange={(value) => updateTitleStyles("fontSize", value || 0)}
              disabled={showStyles.title === false}
            />
            <InputNumber
              value={titleStyles.fontSize}
              className="w-20"
              size="small"
              max={10}
              step={0.1}
              onChange={(value) => updateTitleStyles("fontSize", value || 0)}
              disabled={showStyles.title === false}
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
              value={titleStyles.textColor}
              onChangeComplete={(color) =>
                updateTitleStyles("textColor", color.toCssString())
              }
              styles={{ popupOverlayInner: { width: 480 } }}
              presets={presets}
              panelRender={customPanelRender}
              size="small"
              dropdownAlign={{
                points: ["tl", "bl"],
                overflow: { adjustY: true },
              }}
              disabled={showStyles.title === false}
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
              value={titleStyles.textTransform}
              onChange={(value) => updateTitleStyles("textTransform", value)}
              size="small"
              options={[
                { label: "None", value: "none" }, // default, no transform
                { label: "Capitalize", value: "capitalize" }, // "hello world" → "Hello World"
                { label: "Uppercase", value: "uppercase" }, // "hello" → "HELLO"
                { label: "Lowercase", value: "lowercase" }, // "HELLO" → "hello"
                { label: "Full Width", value: "full-width" }, // normal → ｎｏｒｍａｌ (rarely used)
              ]}
              disabled={showStyles.title === false}
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
              value={titleStyles.textDecoration}
              onChange={(value) => updateTitleStyles("textDecoration", value)}
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
              disabled={showStyles.title === false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TitleSetting;
