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

const ContentSetting = ({
  contentStyles,
  updateContentStyles,
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
      {/* Checkbox show/hide Content */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Show / Hide Content</Divider>
        <div>
          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.content}
            onChange={(e) => updateShowStyles("content", e.target.checked)}
          >
            Content
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.address}
            onChange={(e) => updateShowStyles("address", e.target.checked)}
            disabled={showStyles.content === false}
          >
            Address
          </Checkbox>

          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.message}
            onChange={(e) => updateShowStyles("message", e.target.checked)}
            disabled={showStyles.content === false}
          >
            Message
          </Checkbox>

          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.date}
            onChange={(e) => updateShowStyles("date", e.target.checked)}
            disabled={showStyles.content === false}
          >
            Date
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.time}
            onChange={(e) => updateShowStyles("time", e.target.checked)}
            disabled={showStyles.content === false || showStyles.date === false}
          >
            Time
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.coordinate}
            onChange={(e) => updateShowStyles("coordinate", e.target.checked)}
            disabled={showStyles.content === false}
          >
            Coordinate
          </Checkbox>
        </div>
      </div>
      {/* Input Value */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Text</Divider>
        {/* Address */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Address:
            </small>
            <Input
              value={content.address}
              onChange={(e) => onChangeContent("address", e.target.value)}
              size="small"
              disabled={
                showStyles.content === false || showStyles.address === false
              }
            />
          </div>
        </div>
        {/* Date */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Date:
            </small>
            <DatePicker
              value={content.date ? dayjs(content.date) : null}
              onChange={(date, dateString) =>
                onChangeContent("date", dateString || "")
              }
              style={{ width: "100%" }}
              disabled={
                showStyles.content === false || showStyles.date === false
              }
            />
            <TimePicker
              className="ms-1 w-100"
              value={content.time ? dayjs(content.time, "hh:mm A") : null}
              format="hh:mm A" // <-- 12-hour format with AM/PM
              use12Hours // <-- enables AM/PM mode
              onChange={(time, timeString) =>
                onChangeContent("time", timeString || "")
              }
              disabled={
                showStyles.content === false ||
                showStyles.time === false ||
                showStyles.date === false
              }
            />
          </div>
        </div>
        {/* Message */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Message:
            </small>
            <Input
              value={content.message}
              onChange={(e) => onChangeContent("message", e.target.value)}
              size="small"
              disabled={
                showStyles.content === false || showStyles.message === false
              }
            />
          </div>
        </div>
        {/* Coordinate */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Coordinate:
            </small>
            <Input
              value={content.coordinate}
              onChange={(e) => onChangeContent("coordinate", e.target.value)}
              size="small"
              disabled={
                showStyles.content === false || showStyles.coordinate === false
              }
            />
          </div>
        </div>
      </div>
      {/* Content Width And Heigth */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>
          Content Width & Height
        </Divider>
        {/* Content Width */}
        <div className="">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Width:
            </small>
            <Slider
              value={contentStyles.width}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={30}
              max={100}
              onChange={(value) => updateContentStyles("width", value)}
              disabled={showStyles.content === false}
            />
            <InputNumber
              value={contentStyles.width}
              className="ms-1 me-1"
              size="small"
              min={30}
              max={100}
              onChange={(value) => updateContentStyles("width", value)}
              disabled={showStyles.content === false}
            />
          </div>
        </div>
        {/* Content Height */}
        <div className="">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Height:
            </small>
            <Slider
              value={contentStyles.height}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={10}
              max={100}
              onChange={(value) => updateContentStyles("height", value)}
              disabled={showStyles.content === false}
            />
            <InputNumber
              value={contentStyles.height}
              className="ms-1 me-1"
              size="small"
              min={10}
              max={100}
              onChange={(value) => updateContentStyles("height", value)}
              disabled={showStyles.content === false}
            />
          </div>
        </div>
      </div>
      {/* Content Padding */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Content Padding</Divider>
        <div className="">
          <div className="d-flex align-items-center">
            <InputNumber
              className="me-1"
              value={contentStyles.paddingTop}
              size="small"
              min={0}
              max={50}
              onChange={(value) => updateContentStyles("paddingTop", value)}
              disabled={showStyles.content === false}
            />
            <InputNumber
              className="me-1"
              value={contentStyles.paddingBottom}
              size="small"
              min={0}
              max={50}
              onChange={(value) => updateContentStyles("paddingBottom", value)}
              disabled={showStyles.content === false}
            />
            <InputNumber
              className="me-1"
              value={contentStyles.paddingLeft}
              size="small"
              min={0}
              max={50}
              onChange={(value) => updateContentStyles("paddingLeft", value)}
              disabled={showStyles.content === false}
            />
            <InputNumber
              className="me-1"
              value={contentStyles.paddingRight}
              size="small"
              min={0}
              max={50}
              onChange={(value) => updateContentStyles("paddingRight", value)}
              disabled={showStyles.content === false}
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
            value={contentStyles.bgColor}
            onChangeComplete={(color) =>
              updateContentStyles("bgColor", color.toCssString())
            }
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            dropdownAlign={{
              points: ["tl", "bl"],
              overflow: { adjustY: true },
            }}
            disabled={showStyles.content === false}
          />
        </div>
      </div>
      {/* Content Border */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Content Border</Divider>
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
              value={contentStyles.borderStyle}
              onChange={(value) => updateContentStyles("borderStyle", value)}
              size="small"
              options={[
                { label: "Solid", value: "solid" },
                { label: "Dashed", value: "dashed" },
                { label: "Dotted", value: "dotted" },
                { label: "Double", value: "double" },
                { label: "None", value: "none" },
              ]}
              disabled={showStyles.content === false}
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
              value={contentStyles.borderWidth}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={0}
              max={20}
              onChange={(value) =>
                updateContentStyles("borderWidth", value || 0)
              }
              disabled={
                showStyles.content === false ||
                contentStyles.borderStyle === "none"
              }
            />
            <InputNumber
              value={contentStyles.borderWidth}
              className="w-20"
              size="small"
              min={0}
              max={20}
              onChange={(value) =>
                updateContentStyles("borderWidth", value || 0)
              }
              disabled={
                showStyles.content === false ||
                contentStyles.borderStyle === "none"
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
              value={contentStyles.borderRadius}
              className="w-100 me-2 mt-0 mb-0"
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateContentStyles("borderRadius", value || 0)
              }
              disabled={
                showStyles.content === false ||
                contentStyles.borderStyle === "none"
              }
            />
            <InputNumber
              value={contentStyles.borderRadius}
              className="w-20"
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateContentStyles("borderRadius", value || 0)
              }
              disabled={
                showStyles.content === false ||
                contentStyles.borderStyle === "none"
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
              value={contentStyles.borderColor}
              onChangeComplete={(color) =>
                updateContentStyles("borderColor", color.toCssString())
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
                showStyles.content === false ||
                contentStyles.borderStyle === "none"
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
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Family:
            </small>
            <Select
              className="w-100"
              value={contentStyles.fontFamily}
              onChange={(value) => updateContentStyles("fontFamily", value)}
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
              disabled={showStyles.content === false}
            />
          </div>
        </div>
        {/* Font Style */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Style:
            </small>
            <Select
              className="w-100"
              value={contentStyles.fontStyle}
              onChange={(value) => updateContentStyles("fontStyle", value)}
              size="small"
              options={[
                { label: "Normal", value: "normal" }, // default
                { label: "Italic", value: "italic" }, // italicized text
                { label: "Oblique", value: "oblique" }, // slanted (like italic, but not true italics)
              ]}
              disabled={showStyles.content === false}
            />
          </div>
        </div>
        {/* Font Width */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Width:
            </small>
            <Select
              className="w-100"
              value={contentStyles.fontWeight}
              onChange={(value) => updateContentStyles("fontWeight", value)}
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
              disabled={showStyles.content === false}
            />
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Size:
            </small>
            <Slider
              className="w-100 me-2 mt-0 mb-0"
              min={0}
              max={10} // smaller range (acts like points)
              step={0.1} // smooth increments
              value={contentStyles.fontSize}
              onChange={(value) => updateContentStyles("fontSize", value || 0)}
              disabled={showStyles.content === false}
            />
            <InputNumber
              value={contentStyles.fontSize}
              className="w-20"
              size="small"
              min={0}
              max={10}
              step={0.1}
              onChange={(value) => updateContentStyles("fontSize", value || 0)}
              disabled={showStyles.content === false}
            />
          </div>
        </div>

        {/* Text Color */}
        <div className="mb-2">
          <Divider style={{ fontStyle: "italic" }}>Text</Divider>
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Color:
            </small>
            <ColorPicker
              style={{ width: "100%" }}
              allowClear
              value={contentStyles.textColor}
              onChangeComplete={(color) =>
                updateContentStyles("textColor", color.toCssString())
              }
              styles={{ popupOverlayInner: { width: 480 } }}
              presets={presets}
              panelRender={customPanelRender}
              size="small"
              dropdownAlign={{
                points: ["tl", "bl"],
                overflow: { adjustY: true },
              }}
              disabled={showStyles.content === false}
            />
          </div>
        </div>
        {/* Text Transform */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Transform:
            </small>
            <Select
              className="w-100"
              value={contentStyles.textTransform}
              onChange={(value) => updateContentStyles("textTransform", value)}
              size="small"
              options={[
                { label: "None", value: "none" },
                { label: "Capitalize", value: "capitalize" }, // "hello world" → "Hello World"
                { label: "Uppercase", value: "uppercase" }, // "hello" → "HELLO"
                { label: "Lowercase", value: "lowercase" }, // "HELLO" → "hello"
                { label: "Full Width", value: "full-width" }, // normal → ｎｏｒｍａｌ (rarely used)
              ]}
              disabled={showStyles.content === false}
            />
          </div>
        </div>
        {/* Text Decoration */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Decoration:
            </small>
            <Select
              className="w-100"
              value={contentStyles.textDecoration}
              onChange={(value) => updateContentStyles("textDecoration", value)}
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
              disabled={showStyles.content === false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentSetting;
