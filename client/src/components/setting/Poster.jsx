// src/components/setting/Poster.jsx
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

const Poster = () => {
  return (
    <>
      {/* Poster-specific settings */}
      <div className={drawerMode === "poster" ? "d-block" : "d-none"}>
        <hr className="mb-1 mt-1" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Paper Size:
          </small>
          <Select
            className="w-100"
            value={styles.paperSize}
            onChange={(value) => setStyles({ ...styles, paperSize: value })}
            size="small"
            options={[
              { label: "A0", value: "A0", disabled: true },
              { label: "A1", value: "A1", disabled: true },
              { label: "A2", value: "A2", disabled: true },
              { label: "A3", value: "A3", disabled: true },
              { label: "A4", value: "A4" },
              { label: "A5", value: "A5" },
              { label: "A6", value: "A6" },
              { label: "B0", value: "B0" },
              { label: "B1", value: "B1" },
              { label: "B2", value: "B2" },
              { label: "B3", value: "B3" },
              { label: "B4", value: "B4" },
              { label: "B5", value: "B5" },
              { label: "C0", value: "C0" },
              { label: "C1", value: "C1" },
              { label: "C2", value: "C2" },
              { label: "C3", value: "C3" },
              { label: "C4", value: "C4" },
              { label: "C5", value: "C5" },
              { label: "Letter", value: "Letter" },
              { label: "Legal", value: "Legal" },
              { label: "Tabloid", value: "Tabloid" },
            ]}
          />
        </div>
        <hr className="mb-1 mt-1" />
      </div>

      {/* Map-specific settings */}
      <div className={drawerMode === "map" ? "d-block" : "d-none"}>
        <div className="d-flex align-items-center mb-1">
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
            ]}
          />
        </div>
        <hr className="mb-1 mt-1" />
        <div className="d-flex align-items-center mb-1">
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
        <div className="d-flex align-items-center mb-1">
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
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Stroke Color:
          </small>
          <ColorPicker
            className="me-2"
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
        <hr className="mb-1 mt-1" />
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
        <hr className="mb-1 mt-1" />
        <div className="d-flex align-items-center mb-1">
          <small className="me-2">Milky Way Opacity:</small>
          <Slider
            className="w-100"
            min={0}
            max={1}
            step={0.05}
            value={styles.milkywayOpacity || 0.2}
            onChange={(v) => setStyles({ ...styles, milkywayOpacity: v })}
          />
        </div>

        <div className="d-flex align-items-center mb-1">
          <small className="me-2">Star Size Mult:</small>
          <Slider
            className="w-100"
            min={0.3}
            max={3}
            step={0.1}
            value={styles.sizeMult || 1}
            onChange={(v) => setStyles({ ...styles, sizeMult: v })}
          />
        </div>

        <div className="d-flex align-items-center mb-1">
          <small className="me-2">Magnitude Limit:</small>
          <Slider
            className="w-100"
            min={1}
            max={10}
            step={0.1}
            value={styles.magLimit || 6.5}
            onChange={(v) => setStyles({ ...styles, magLimit: v })}
          />
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
      </div>

      {/* General style settings */}
      <div className={drawerMode === "map" ? "d-none" : "d-block"}>
        <div className="d-flex align-items-center">
          <small className="me-2">Background Color:</small>
          <ColorPicker
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
        <hr className="mb-1 mt-1" />
        <div className="d-flex align-items-center mb-1">
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
        <div className="d-flex align-items-center mb-1">
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
        <div className="d-flex align-items-center mb-1">
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
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Border Color:
          </small>
          <ColorPicker
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
        <hr className="mb-1 mt-1" />
      </div>

      {/* Size sliders (PosterWrapper or Map/Moment) */}
      <div className={drawerMode === "poster" ? "d-none" : "d-block"}>
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Width:
          </small>
          <Slider
            className="w-100 me-2"
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
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Height:
          </small>
          <Slider
            className="w-100 me-2"
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
        <hr className="mb-1 mt-1" />
      </div>
    </>
  );
};
