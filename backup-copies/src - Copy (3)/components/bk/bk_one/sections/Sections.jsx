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

const Sections = ({ drawerMode, styles, setStyles, fontFamilies }) => {
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
              paddingRight: 4,
              paddingBottom: 5,
              paddingTop: 5,
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

  //  const isTextSection = !["poster", "map"].includes(drawerMode);

  return (
    <>
      {/* Applicable only to main poster */}
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
            optionFilterProp="label"
            showSearch
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
      {/* Applicable Only To Map */}
      <div className={drawerMode === "map" ? "d-block" : "d-none"}>
        <div className="d-flex align-items-center mb-1">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Mask Shape:
          </small>
          <Select
            className="w-100"
            value={styles.maskShape}
            onChange={(value) => setStyles({ ...styles, maskShape: value })}
            optionFilterProp="label"
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

        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Stroke Color:
          </small>
          <ColorPicker
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
        </div>
        <hr className="mb-1 mt-1" />
        <div className="">
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
            Constellations
          </Checkbox>
        </div>

        {/* <div>
          <hr className="mb-1 mt-1" />
          <div>
            <small className="d-inline-block" style={{ whiteSpace: "nowrap" }}>
              Magnitude Limit:
              <hr className="mb-1 mt-1" />
            </small>
            <div
              className="d-flex align-items-center"
              style={{ marginTop: "-15px" }}
            >
              <Slider
                className="w-100"
                min={30}
                max={100}
                value={styles.magnitudeLimit}
                onChange={(value) =>
                  setStyles({ ...styles, magnitudeLimit: value || 0 })
                }
                style={{ margin: "0px" }}
              />
              <InputNumber
                value={styles.magnitudeLimit}
                className="w-90"
                size="small"
                min={30}
                max={100}
                onChange={(value) =>
                  setStyles({ ...styles, magnitudeLimit: value || 0 })
                }
              />
            </div>
          </div>
          <div>
            <small className="d-inline-block" style={{ whiteSpace: "nowrap" }}>
              Star Size Multiplier:
              <hr className="mb-1 mt-1" />
            </small>
            <div
              className="d-flex align-items-center"
              style={{ marginTop: "-15px" }}
            >
              <Slider
                className="w-100"
                min={30}
                max={100}
                value={styles.magnitudeLimit}
                onChange={(value) =>
                  setStyles({ ...styles, magnitudeLimit: value || 0 })
                }
                style={{ margin: "0px" }}
              />
              <InputNumber
                value={styles.magnitudeLimit}
                className="w-90"
                size="small"
                min={30}
                max={100}
                onChange={(value) =>
                  setStyles({ ...styles, magnitudeLimit: value || 0 })
                }
              />
            </div>
          </div>
          <div>
            <small className="d-inline-block" style={{ whiteSpace: "nowrap" }}>
              MilkyWay Opacity:
              <hr className="mb-1 mt-1" />
            </small>
            <div
              className="d-flex align-items-center"
              style={{ marginTop: "-15px" }}
            >
              <Slider
                className="w-100"
                min={30}
                max={100}
                value={styles.magnitudeLimit}
                onChange={(value) =>
                  setStyles({ ...styles, magnitudeLimit: value || 0 })
                }
                style={{ margin: "0px" }}
              />
              <InputNumber
                value={styles.magnitudeLimit}
                className="w-90"
                size="small"
                min={30}
                max={100}
                onChange={(value) =>
                  setStyles({ ...styles, magnitudeLimit: value || 0 })
                }
              />
            </div>
          </div>
        </div> */}
        <hr className="mb-1 mt-1" />
      </div>
      <div className={drawerMode === "map" ? "d-none" : "d-block"}>
        <div className="d-flex align-items-center">
          <small className="me-2">BackGround Color:</small>
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
            optionFilterProp="label"
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
            style={{ margin: "0px" }}
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
            min={10}
            max={100}
            value={styles.height}
            onChange={(value) => setStyles({ ...styles, height: value || 0 })}
            style={{ margin: "0px" }}
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
        {/* <div
          className={
            drawerMode === "map" || drawerMode === "moment"
              ? "d-block"
              : "d-none"
          }
        >
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Position X:
            </small>
            <Slider
              className="w-100"
              min={30}
              max={100}
              value={styles.width}
              onChange={(value) => setStyles({ ...styles, width: value || 0 })}
              style={{ margin: "4px" }}
            />
          </div>
          <div className="d-flex align-items-center">
            <small className="me-2" style={{ whiteSpace: "nowrap" }}>
              Position Y:
            </small>
            <Slider
              className="w-100"
              min={5}
              max={100}
              value={styles.height}
              onChange={(value) => setStyles({ ...styles, height: value || 0 })}
              style={{ margin: "4px" }}
            />
          </div>
        </div> */}
        <hr className="mb-1 mt-1" />
      </div>
    </>
  );
};

export default Sections;
