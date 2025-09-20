// src/components/setting/CustomImgSetting.jsx
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
  Checkbox,
  Upload,
  Button,
} from "antd";

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const CustomImgSetting = ({
  styles,
  updateStyles,
  content,
  onChangeContent,
  showDrawer,
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
      {/* Checkbox show/hide Content */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Show / Hide Content</Divider>
        <div>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.show.CustomImg}
            onChange={(e) => updateStyles("show.CustomImg", e.target.checked)}
          >
            Custom Image
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.show.imgTxt_1}
            onChange={(e) => updateStyles("show.imgTxt_1", e.target.checked)}
            disabled={styles.show.CustomImg === false}
          >
            Text 1
          </Checkbox>

          <Checkbox
            className="text-muted fst-italic"
            checked={styles.show.imgTxt_2}
            onChange={(e) => updateStyles("show.imgTxt_2", e.target.checked)}
            disabled={styles.show.CustomImg === false}
          >
            Text 2
          </Checkbox>
        </div>
      </div>
      {/* Input Value */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Text</Divider>
        {/* Text 1 */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Text 1:
            </small>
            <Input
              value={content.text1}
              onChange={(e) => onChangeContent("text1", e.target.value)}
              size="small"
              disabled={
                styles.show.CustomImg === false ||
                styles.show.imgTxt_1 === false
              }
            />
          </div>
        </div>
        {/* Text 2 */}
        <div className="mb-2">
          <div className="d-flex align-items-center">
            <small
              className="text-muted fst-italic me-2"
              style={{ whiteSpace: "nowrap" }}
            >
              Text 2:
            </small>
            <Input
              value={content.text2}
              onChange={(e) => onChangeContent("text2", e.target.value)}
              size="small"
              disabled={
                styles.show.CustomImg === false ||
                styles.show.imgTxt_2 === false
              }
            />
          </div>
        </div>
      </div>
      <div className="mb-2">
        <Divider>Image</Divider>
        <div className="d-flex flex-column">
          <Button
            type="primary"
            onClick={() =>
              showDrawer("uploadSelectCustomeImg", "CustomImg", "imgSrc")
            }
          >
            Select File From Media
          </Button>
        </div>
      </div>
      <Divider>Dimension</Divider>
      {/* Width */}
      <div className="mb-1">
        <div className="d-flex align-items-center mb-1">
          <small
            className="me-1 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Main Width
          </small>
          <Slider
            className="w-100 me-2"
            min={30}
            max={100}
            value={styles.CustomImg.width}
            onChange={(value) => updateStyles("CustomImg.width", value)}
            disabled={styles.show.CustomImg === false}
          />
          <InputNumber
            value={styles.CustomImg.width}
            size="small"
            min={30}
            max={100}
            onChange={(value) => updateStyles("CustomImg.width", value)}
            disabled={styles.show.CustomImg === false}
          />
        </div>
      </div>
      {/* imgDimention */}
      <div className="mb-1">
        <div className="d-flex align-items-center mb-1">
          <small
            className="me-1 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Img Width
          </small>
          <Slider
            className="w-100 me-2"
            min={0}
            max={100}
            value={styles.CustomImg.imgDimention}
            onChange={(value) => updateStyles("CustomImg.imgDimention", value)}
            disabled={styles.show.CustomImg === false}
          />
          <InputNumber
            value={styles.CustomImg.imgDimention}
            size="small"
            min={0}
            max={100}
            onChange={(value) => updateStyles("CustomImg.imgDimention", value)}
            disabled={styles.show.CustomImg === false}
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="mb-2">
        <Divider>Background Color</Divider>
        <ColorPicker
          style={{ width: "100%" }}
          allowClear
          value={styles.CustomImg.bgColor}
          onChangeComplete={(color) =>
            updateStyles("CustomImg.bgColor", color.toCssString())
          }
          styles={{ popupOverlayInner: { width: 480 } }}
          presets={presets}
          panelRender={customPanelRender}
          size="small"
          disabled={styles.show.CustomImg === false}
        />
      </div>

      {/* Border Style */}
      <div className="mb-2">
        <Divider>Border</Divider>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1 text-muted fst-italic">Style</small>
          <Select
            className="w-100"
            size="small"
            value={styles.posterWrapper.borderStyle}
            onChange={(value) =>
              updateStyles("posterWrapper.borderStyle", value)
            }
            options={[
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
              { label: "Double", value: "double" },
              { label: "None", value: "none" },
            ]}
            disabled={styles.show.CustomImg === false}
          />
        </div>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1 text-muted fst-italic">Width</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={20}
            value={styles.posterWrapper.borderWidth}
            onChange={(value) =>
              updateStyles("posterWrapper.borderWidth", value || 0)
            }
            disabled={
              styles.show.CustomImg === false ||
              styles.posterWrapper.borderStyle === "none"
            }
          />
        </div>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1 text-muted fst-italic">Radius</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={50}
            value={styles.posterWrapper.borderRadius}
            onChange={(value) =>
              updateStyles("posterWrapper.borderRadius", value || 0)
            }
            disabled={
              styles.show.CustomImg === false ||
              styles.posterWrapper.borderStyle === "none"
            }
          />
        </div>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1 text-muted fst-italic">Color</small>
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={styles.posterWrapper.borderColor}
            onChangeComplete={(color) =>
              updateStyles("posterWrapper.borderColor", color.toCssString())
            }
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            disabled={
              styles.show.CustomImg === false ||
              styles.posterWrapper.borderStyle === "none"
            }
          />
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
              value={styles.CustomImg.fontFamily}
              onChange={(value) => updateStyles("CustomImg.fontFamily", value)}
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
              disabled={styles.show.CustomImg === false}
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
              value={styles.CustomImg.fontStyle}
              onChange={(value) => updateStyles("CustomImg.fontStyle", value)}
              size="small"
              options={[
                { label: "Normal", value: "normal" }, // default
                { label: "Italic", value: "italic" }, // italicized text
                { label: "Oblique", value: "oblique" }, // slanted (like italic, but not true italics)
              ]}
              disabled={styles.show.CustomImg === false}
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
              value={styles.CustomImg.fontWeight}
              onChange={(value) => updateStyles("CustomImg.fontWeight", value)}
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
              disabled={styles.show.CustomImg === false}
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
              max={10}
              step={0.1}
              value={styles.CustomImg.fontSize}
              onChange={(value) =>
                updateStyles("CustomImg.fontSize", value || 0)
              }
              disabled={styles.show.CustomImg === false}
            />
            <InputNumber
              value={styles.CustomImg.fontSize}
              className="w-20"
              size="small"
              max={10}
              step={0.1}
              onChange={(value) =>
                updateStyles("CustomImg.fontSize", value || 0)
              }
              disabled={styles.show.CustomImg === false}
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
              value={styles.CustomImg.textColor}
              onChangeComplete={(color) =>
                updateStyles("CustomImg.textColor", color.toCssString())
              }
              styles={{ popupOverlayInner: { width: 480 } }}
              presets={presets}
              panelRender={customPanelRender}
              size="small"
              dropdownAlign={{
                points: ["tl", "bl"],
                overflow: { adjustY: true },
              }}
              disabled={styles.show.CustomImg === false}
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
              value={styles.CustomImg.textTransform}
              onChange={(value) =>
                updateStyles("CustomImg.textTransform", value)
              }
              size="small"
              options={[
                { label: "None", value: "none" }, // default, no transform
                { label: "Capitalize", value: "capitalize" }, // "hello world" → "Hello World"
                { label: "Uppercase", value: "uppercase" }, // "hello" → "HELLO"
                { label: "Lowercase", value: "lowercase" }, // "HELLO" → "hello"
                { label: "Full Width", value: "full-width" }, // normal → ｎｏｒｍａｌ (rarely used)
              ]}
              disabled={styles.show.CustomImg === false}
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
              value={styles.CustomImg.textDecoration}
              onChange={(value) =>
                updateStyles("CustomImg.textDecoration", value)
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
              disabled={styles.show.CustomImg === false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomImgSetting;
