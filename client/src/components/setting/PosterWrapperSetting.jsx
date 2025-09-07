// src/components/setting/PosterWrapperSetting.jsx
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
} from "antd";

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const PosterWrapperSetting = ({ styles, updateStyles }) => {
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
            value={styles.posterWrapper.width}
            onChange={(value) => updateStyles("posterWrapper.width", value)}
          />
          <InputNumber
            value={styles.posterWrapper.width}
            className="w-80"
            size="small"
            min={30}
            max={100}
            onChange={(value) => updateStyles("posterWrapper.width", value)}
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
            value={styles.posterWrapper.height}
            onChange={(value) => updateStyles("posterWrapper.height", value)}
          />
          <InputNumber
            value={styles.posterWrapper.height}
            className="w-80"
            size="small"
            min={30}
            max={100}
            onChange={(value) => updateStyles("posterWrapper.height", value)}
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>
      {/* Background Color */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Background Color:
          </small>
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={styles.posterWrapper.bgColor}
            onChangeComplete={(color) =>
              updateStyles("posterWrapper.bgColor", color.toCssString())
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

      {/* Border Style */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Border Style:
          </small>
          <Select
            className="w-100"
            value={styles.posterWrapper.borderStyle}
            onChange={(value) =>
              updateStyles("posterWrapper.borderStyle", value)
            }
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

      {/* Border Width */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Border Width:
          </small>
          <InputNumber
            value={styles.posterWrapper.borderWidth}
            className="w-100"
            size="small"
            min={0}
            max={20}
            onChange={(value) =>
              updateStyles("posterWrapper.borderWidth", value || 0)
            }
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>

      {/* Border Radius */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Border Radius:
          </small>
          <InputNumber
            value={styles.posterWrapper.borderRadius}
            className="w-100"
            size="small"
            min={0}
            max={50}
            onChange={(value) =>
              updateStyles("posterWrapper.borderRadius", value || 0)
            }
          />
        </div>
        <hr className="mb-0 mt-1" />
      </div>

      {/* Border Color */}
      <div className="mb-2">
        <hr className="mb-1 mt-0" />
        <div className="d-flex align-items-center">
          <small className="me-2" style={{ whiteSpace: "nowrap" }}>
            Border Color:
          </small>
          <ColorPicker
            style={{
              width: "100%",
            }}
            allowClear
            value={styles.posterWrapper.borderColor}
            onChangeComplete={(color) =>
              updateStyles("posterWrapper.borderColor", color.toCssString())
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
    </>
  );
};

export default PosterWrapperSetting;
