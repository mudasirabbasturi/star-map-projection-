// src/components/setting/Map.jsx
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
const Map = ({ styles, setStyles, fontFamilies }) => {
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
      {/* Mask Shape */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Mask Shape:
          </small>
          <Select
            className="w-100"
            value={styles.maskShape}
            onChange={(value) => setStyles({ ...styles, maskShape: value })}
            size="small"
            options={[
              { value: "circle", label: "Circle" },
              { value: "heart", label: "Heart" },
              { value: "triangle", label: "Triangle" },
              { value: "rect", label: "Rectangle" },
              { value: "apple", label: "Apple Inc" },
              { value: "astronomy", label: "Astronomy" },
            ]}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Stroke Style */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Stroke Style:
          </small>
          <Select
            className="w-100"
            value={styles.strokeStyle}
            onChange={(value) => setStyles({ ...styles, strokeStyle: value })}
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
      {/* Stroke Width */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Stroke Width:
          </small>
          <InputNumber
            value={styles.strokeWidth}
            className="w-100"
            size="small"
            min={0}
            max={20}
            onChange={(value) =>
              setStyles({ ...styles, strokeWidth: value || 0 })
            }
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Stroke Color */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Stroke Color:
          </small>
          <ColorPicker
            className="me-2"
            style={{
              width: "100%",
            }}
            allowClear
            value={styles.strokeColor || styles.color}
            onChangeComplete={(color) =>
              setStyles({ ...styles, strokeColor: color.toCssString() })
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
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Fill Color:
          </small>
          <ColorPicker
            style={{
              width: "100%",
            }}
            allowClear
            value={styles.bgColor || styles.color || null}
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
      {/* Fill Color */}
      {/* Checkbox show/hide starts/mw/moon/plan/... */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div>
          <Checkbox
            checked={styles.showStars}
            onChange={(e) =>
              setStyles({ ...styles, showStars: e.target.checked })
            }
          >
            Show Stars
          </Checkbox>
          <Checkbox
            checked={styles.showMilkyway}
            onChange={(e) =>
              setStyles({ ...styles, showMilkyway: e.target.checked })
            }
          >
            Show Milky Way
          </Checkbox>
          <Checkbox
            checked={styles.showConstellations}
            onChange={(e) =>
              setStyles({ ...styles, showConstellations: e.target.checked })
            }
          >
            Show Constellations
          </Checkbox>
          <Checkbox
            checked={styles.showPlanets}
            onChange={(e) =>
              setStyles({ ...styles, showPlanets: e.target.checked })
            }
          >
            Show Planets
          </Checkbox>
          <Checkbox
            checked={styles.showMoon}
            onChange={(e) =>
              setStyles({ ...styles, showMoon: e.target.checked })
            }
          >
            Show Moon
          </Checkbox>
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Milky Way Opacity */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            MW Opacity:
          </small>
          <Slider
            className="w-100 m-0 me-2"
            min={0}
            max={1}
            step={0.05}
            value={styles.milkywayOpacity || 0.2}
            onChange={(v) => setStyles({ ...styles, milkywayOpacity: v })}
          />
          <InputNumber
            value={styles.milkywayOpacity}
            className="w-100"
            size="small"
            min={0}
            max={1}
            step={0.05}
            onChange={(value) =>
              setStyles({ ...styles, milkywayOpacity: value || 0 })
            }
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Star Size Mult */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Star Size Mult:
          </small>
          <Slider
            className="w-100 m-0 me-2"
            min={0.3}
            max={3}
            step={0.1}
            value={styles.sizeMult || 1}
            onChange={(v) => setStyles({ ...styles, sizeMult: v })}
          />
          <InputNumber
            value={styles.sizeMult}
            className="w-100"
            size="small"
            min={0.3}
            max={3}
            step={0.1}
            onChange={(value) => setStyles({ ...styles, sizeMult: value || 0 })}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Magnitude Limit: */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Magnitude:
          </small>
          <Slider
            className="w-100 m-0 me-2"
            min={1}
            max={10}
            step={0.1}
            value={styles.magLimit || 6.5}
            onChange={(v) => setStyles({ ...styles, magLimit: v })}
          />
          <InputNumber
            className="w-100"
            size="small"
            value={styles.magLimit || 6.5}
            min={1}
            max={10}
            step={0.1}
            onChange={(value) =>
              setStyles({ ...styles, magLimit: value || 6.5 })
            }
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
            max={100}
            value={styles.height}
            onChange={(value) => setStyles({ ...styles, height: value || 0 })}
          />
          <InputNumber
            value={styles.height}
            className="w-80"
            size="small"
            min={30}
            max={100}
            onChange={(value) => setStyles({ ...styles, height: value || 0 })}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>

      <hr className="mb-1 mt-1" />
      <div className="d-flex align-items-center mb-1">
        <small className="me-2">Latitude:</small>
        <InputNumber
          min={-90}
          max={90}
          value={styles.lat || 0}
          onChange={(v) => setStyles({ ...styles, lat: v })}
          size="small"
          className="w-100"
        />
      </div>
      <div className="d-flex align-items-center mb-1">
        <small className="me-2">Longitude:</small>
        <InputNumber
          min={-180}
          max={180}
          value={styles.lon || 0}
          onChange={(v) => setStyles({ ...styles, lon: v })}
          size="small"
          className="w-100"
        />
      </div>
      <hr className="mb-1 mt-1" />
    </>
  );
};
export default Map;
