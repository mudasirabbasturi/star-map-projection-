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

const ContentSetting = ({ styles, updateStyles, content, onChangeContent }) => {
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
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <small>Show / Hide: </small>
        <div>
          <Checkbox
            checked={styles.show.title}
            onChange={(e) => updateStyles("show.title", e.target.checked)}
          >
            Title
          </Checkbox>

          <Checkbox
            checked={styles.show.address}
            onChange={(e) => updateStyles("show.address", e.target.checked)}
          >
            Address
          </Checkbox>

          <Checkbox
            checked={styles.show.message}
            onChange={(e) => updateStyles("show.message", e.target.checked)}
          >
            Message
          </Checkbox>

          <Checkbox
            checked={styles.show.date}
            onChange={(e) => updateStyles("show.date", e.target.checked)}
          >
            Date
          </Checkbox>
          <Checkbox
            checked={styles.show.time}
            onChange={(e) => updateStyles("show.time", e.target.checked)}
          >
            Time
          </Checkbox>
          <Checkbox
            checked={styles.show.coordinate}
            onChange={(e) => updateStyles("show.coordinate", e.target.checked)}
          >
            Coordinate
          </Checkbox>
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Input Value */}
      <div>
        {/* Title */}
        <div className="mb-2">
          <hr className="mb-1 mt-0" />
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Title:
            </small>
            <Input
              value={content.title}
              onChange={(e) => onChangeContent("title", e.target.value)}
              size="small"
            />
          </div>
          <hr className="mb-0 mt-1" />
        </div>
        {/* Address */}
        <div className="mb-2">
          <hr className="mb-1 mt-0" />
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Address:
            </small>
            <Input
              value={content.address}
              onChange={(e) => onChangeContent("address", e.target.value)}
              size="small"
            />
          </div>
          <hr className="mb-0 mt-1" />
        </div>
        {/* Date */}
        <div className="mb-2">
          <hr className="mb-1 mt-0" />
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Date:
            </small>
            <DatePicker
              value={content.date ? dayjs(content.date) : null}
              onChange={(date, dateString) =>
                onChangeContent("date", dateString || "")
              }
              style={{ width: "100%" }}
            />
            <TimePicker
              className="ms-1 w-100"
              value={content.time ? dayjs(content.time, "hh:mm A") : null}
              format="hh:mm A" // <-- 12-hour format with AM/PM
              use12Hours // <-- enables AM/PM mode
              onChange={(time, timeString) =>
                onChangeContent("time", timeString || "")
              }
            />
          </div>
          <hr className="mb-0 mt-1" />
        </div>
        {/* Message */}
        <div className="mb-2">
          <hr className="mb-1 mt-0" />
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Message:
            </small>
            <Input
              value={content.message}
              onChange={(e) => onChangeContent("message", e.target.value)}
              size="small"
            />
          </div>
          <hr className="mb-0 mt-1" />
        </div>
        {/* Coordinate */}
        <div className="mb-2">
          <hr className="mb-1 mt-0" />
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Coordinate:
            </small>
            <Input
              value={content.coordinate}
              onChange={(e) => onChangeContent("coordinate", e.target.value)}
              size="small"
            />
          </div>
          <hr className="mb-0 mt-1" />
        </div>
      </div>
      {/* Width Height */}
      <div className="d-flex flex-column">
        <hr className="mb-1 mt-0" />
        <small style={{ whiteSpace: "nowrap" }}>
          Width /
          <InputNumber
            value={styles.content.width}
            className="ms-1 me-1"
            size="small"
            min={30}
            max={100}
            onChange={(value) => updateStyles("content.width", value)}
          />
          Height /
          <InputNumber
            value={styles.content.height}
            className="ms-1"
            size="small"
            min={10}
            max={100}
            onChange={(value) => updateStyles("content.height", value)}
          />
        </small>
        <hr className="mb-0 mt-1" />
      </div>

      {/* Bacground Color / Border */}
      <hr className="mb-1 mt-1" />
      <div className="d-flex flex-column">
        <small className="mb-2" style={{ whiteSpace: "nowrap" }}>
          Bg Color / <b>Border</b> / Style / Width / Radius / Color
        </small>
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <div className="me-1">
            <ColorPicker
              style={{ width: "100%" }}
              allowClear
              value={styles.content.bgColor}
              onChangeComplete={(color) =>
                updateStyles("content.bgColor", color.toCssString())
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
          {/* Border Style */}
          <div className="me-1 w-100">
            <Select
              className="w-100"
              value={styles.content.borderStyle}
              onChange={(value) => updateStyles("content.borderStyle", value)}
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
          {/* Border Width */}
          <div className="me-1">
            <InputNumber
              value={styles.content.borderWidth}
              className="w-100"
              size="small"
              min={0}
              max={20}
              onChange={(value) =>
                updateStyles("content.borderWidth", value || 0)
              }
            />
          </div>

          {/* Border Radius */}
          <div className="me-1">
            <InputNumber
              value={styles.content.borderRadius}
              className="w-100"
              size="small"
              min={0}
              max={50}
              onChange={(value) =>
                updateStyles("content.borderRadius", value || 0)
              }
            />
          </div>
          {/* Border Color */}
          <div>
            <ColorPicker
              style={{
                width: "100%",
              }}
              allowClear
              value={styles.content.borderColor}
              onChangeComplete={(color) =>
                updateStyles("content.borderColor", color.toCssString())
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
        </div>
      </div>
      <hr className="mb-0 mt-1" />
      {/* Fonts */}
      <hr className="mb-1 mt-2" />
      <div className="mb-2">
        <div className="d-flex flex-column">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Fonts: / Family / Style / Width / Size
          </small>
          <hr className="mb-1 mt-0" />
          <div className="d-flex align-items-center">
            {/* Font Family */}
            <div className="me-1 w-100">
              <Select
                className="w-100"
                value={styles.content.fontFamily}
                onChange={(value) => updateStyles("content.fontFamily", value)}
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
              />
            </div>
            {/* Font Style */}
            <div className="me-1 w-100">
              <Select
                className="w-100"
                value={styles.content.fontStyle}
                onChange={(value) => updateStyles("content.fontStyle", value)}
                size="small"
                options={[
                  { label: "Normal", value: "normal" }, // default
                  { label: "Italic", value: "italic" }, // italicized text
                  { label: "Oblique", value: "oblique" }, // slanted (like italic, but not true italics)
                ]}
              />
            </div>
            {/* Font Width */}
            <div className="me-1 w-100">
              <Select
                className="w-100"
                value={styles.content.fontWeight}
                onChange={(value) => updateStyles("content.fontWeight", value)}
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
              />
            </div>
            {/* Font Size */}
            <div className="me-1">
              <InputNumber
                value={styles.content.fontSize}
                className="w-100"
                size="small"
                min={0}
                max={50}
                onChange={(value) =>
                  updateStyles("content.fontSize", value || 0)
                }
              />
            </div>
          </div>
        </div>
      </div>
      <hr className="mb-0 mt-1" />
      {/* Text */}
      <hr className="mb-1 mt-2" />
      <div className="mb-2">
        <div className="d-flex flex-column">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Text: / Color / Transform / Decoration
          </small>
          <hr className="mb-1 mt-0" />
          <div className="d-flex align-items-center">
            {/* Text Color */}
            <div className="me-1">
              <ColorPicker
                style={{ width: "100%" }}
                allowClear
                value={styles.content.textColor}
                onChangeComplete={(color) =>
                  updateStyles("content.textColor", color.toCssString())
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
            {/* Text Transform */}
            <div className="me-1 w-100">
              <Select
                className="w-100"
                value={styles.content.textTransform}
                onChange={(value) =>
                  updateStyles("content.textTransform", value)
                }
                size="small"
                options={[
                  { label: "None", value: "none" }, // default, no transform
                  { label: "Capitalize", value: "capitalize" }, // "hello world" → "Hello World"
                  { label: "Uppercase", value: "uppercase" }, // "hello" → "HELLO"
                  { label: "Lowercase", value: "lowercase" }, // "HELLO" → "hello"
                  { label: "Full Width", value: "full-width" }, // normal → ｎｏｒｍａｌ (rarely used)
                ]}
              />
            </div>
            {/* Text Decoration */}
            <div className="me-1 w-100">
              <Select
                className="w-100"
                value={styles.content.textDecoration}
                onChange={(value) =>
                  updateStyles("content.textDecoration", value)
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
                  }, // both
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      <hr className="mb-0 mt-1" />
    </>
  );
};

export default ContentSetting;
