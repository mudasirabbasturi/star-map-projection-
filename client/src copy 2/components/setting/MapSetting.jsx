// src/components/setting/MapSetting.jsx
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

const MapSetting = ({ styles, updateStyles }) => {
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

  return (
    <>
      {/* Mask Shape */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Mask Shape
          <hr className="mb-0 mt-1" />
        </h5>
        <Select
          className="w-100"
          value={styles.map.maskShape}
          onChange={(value) => updateStyles("map.maskShape", value)}
          size="small"
          options={[
            { value: "circle", label: "Circle" },
            { value: "heart", label: "Heart" },
            { value: "triangle", label: "Triangle" },
            { value: "rect", label: "Rectangle" },
            { value: "apple", label: "Apple Inc" },
          ]}
        />
      </div>

      {/* Stroke Style */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Stroke Style
          <hr className="mb-0 mt-1" />
        </h5>
        <Select
          className="w-100"
          value={styles.map.strokeStyle}
          onChange={(value) => updateStyles("map.strokeStyle", value)}
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

      {/* Stroke Width */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Stroke Width
          <hr className="mb-0 mt-1" />
        </h5>
        <div className="d-flex align-items-center">
          <Slider
            min={0}
            max={20}
            value={styles.map.strokeWidth}
            onChange={(v) => updateStyles("map.strokeWidth", v || 0)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={0}
            max={20}
            value={styles.map.strokeWidth}
            onChange={(v) => updateStyles("map.strokeWidth", v || 0)}
            size="small"
          />
        </div>
      </div>

      {/* Stroke Color & Fill Color */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Stroke & Fill Color
          <hr className="mb-0 mt-1" />
        </h5>
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Stroke:
          </small>
          <ColorPicker
            value={styles.map.strokeColor}
            onChangeComplete={(color) =>
              updateStyles("map.strokeColor", color.toCssString())
            }
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            style={{ flex: 1 }}
          />
          <small className="ms-2 me-2" style={{ whiteSpace: "nowrap" }}>
            Fill:
          </small>
          <ColorPicker
            value={styles.map.fill}
            onChangeComplete={(color) =>
              updateStyles("map.fill", color.toCssString())
            }
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* Show/hide checkboxes */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Show / Hide Elements
          <hr className="mb-0 mt-1" />
        </h5>
        <div>
          <Checkbox
            checked={styles.map.showStars}
            onChange={(e) => updateStyles("map.showStars", e.target.checked)}
          >
            Show Stars
          </Checkbox>
          <Checkbox
            checked={styles.map.showMilkyway}
            onChange={(e) => updateStyles("map.showMilkyway", e.target.checked)}
          >
            Show Milky Way
          </Checkbox>
          <Checkbox
            checked={styles.map.showConstellations}
            onChange={(e) =>
              updateStyles("map.showConstellations", e.target.checked)
            }
          >
            Show Constellations
          </Checkbox>
          <Checkbox
            checked={styles.map.showPlanets}
            onChange={(e) => updateStyles("map.showPlanets", e.target.checked)}
          >
            Show Planets
          </Checkbox>
          <Checkbox
            checked={styles.map.showMoon}
            onChange={(e) => updateStyles("map.showMoon", e.target.checked)}
          >
            Show Moon
          </Checkbox>
        </div>
      </div>

      {/* MW Opacity */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Milky Way Opacity
          <hr className="mb-0 mt-1" />
        </h5>
        <div className="d-flex align-items-center">
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={styles.map.milkywayOpacity}
            onChange={(v) => updateStyles("map.milkywayOpacity", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={0}
            max={1}
            step={0.05}
            value={styles.map.milkywayOpacity}
            onChange={(v) => updateStyles("map.milkywayOpacity", v)}
            size="small"
          />
        </div>
      </div>

      {/* Star Size Mult */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Star Size Multiplier
          <hr className="mb-0 mt-1" />
        </h5>
        <div className="d-flex align-items-center">
          <Slider
            min={0.3}
            max={3}
            step={0.1}
            value={styles.map.sizeMult}
            onChange={(v) => updateStyles("map.sizeMult", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={0.3}
            max={3}
            step={0.1}
            value={styles.map.sizeMult}
            onChange={(v) => updateStyles("map.sizeMult", v)}
            size="small"
          />
        </div>
      </div>

      {/* Magnitude Limit */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Magnitude Limit
          <hr className="mb-0 mt-1" />
        </h5>
        <div className="d-flex align-items-center">
          <Slider
            min={1}
            max={10}
            step={0.1}
            value={styles.map.magLimit}
            onChange={(v) => updateStyles("map.magLimit", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={1}
            max={10}
            step={0.1}
            value={styles.map.magLimit}
            onChange={(v) => updateStyles("map.magLimit", v)}
            size="small"
          />
        </div>
      </div>

      {/* Width / Height */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Map Width & Height
          <hr className="mb-0 mt-1" />
        </h5>
        <div className="d-flex align-items-center mb-2">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Width:
          </small>
          <Slider
            min={30}
            max={100}
            value={styles.map.width}
            onChange={(v) => updateStyles("map.width", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={30}
            max={100}
            value={styles.map.width}
            onChange={(v) => updateStyles("map.width", v)}
            size="small"
          />
        </div>
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Height:
          </small>
          <Slider
            min={0}
            max={100}
            value={styles.map.height || 0}
            onChange={(v) => updateStyles("map.height", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={0}
            max={100}
            value={styles.map.height || 0}
            onChange={(v) => updateStyles("map.height", v)}
            size="small"
          />
        </div>
      </div>

      {/* Latitude / Longitude */}
      <div className="mb-2">
        <h5 style={{ fontStyle: "italic" }}>
          Coordinates
          <hr className="mb-0 mt-1" />
        </h5>
        <div className="d-flex align-items-center mb-2">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Latitude:
          </small>
          <Slider
            min={-90}
            max={90}
            value={styles.map.lat}
            onChange={(v) => updateStyles("map.lat", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={-90}
            max={90}
            value={styles.map.lat}
            onChange={(v) => updateStyles("map.lat", v)}
            size="small"
          />
        </div>
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Longitude:
          </small>
          <Slider
            min={-180}
            max={180}
            value={styles.map.lon}
            onChange={(v) => updateStyles("map.lon", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={-180}
            max={180}
            value={styles.map.lon}
            onChange={(v) => updateStyles("map.lon", v)}
            size="small"
          />
        </div>
      </div>
    </>
  );
};

export default MapSetting;
