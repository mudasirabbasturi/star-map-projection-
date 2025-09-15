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
      <Divider>Dimension</Divider>
      {/* Width */}
      <div className="mb-1">
        <div className="d-flex align-items-center mb-1">
          <small className="me-1">Width</small>
          <Slider
            className="w-100 me-2"
            min={30}
            max={100}
            value={styles.posterWrapper.width}
            onChange={(value) => updateStyles("posterWrapper.width", value)}
          />
          <InputNumber
            value={styles.posterWrapper.width}
            size="small"
            min={30}
            max={100}
            onChange={(value) => updateStyles("posterWrapper.width", value)}
          />
        </div>
      </div>
      {/* Height */}
      <div className="mb-1">
        <div className="d-flex align-items-center mb-1">
          <small className="me-1">Height</small>
          <Slider
            className="w-100 me-2"
            min={0}
            max={100}
            value={styles.posterWrapper.height}
            onChange={(value) => updateStyles("posterWrapper.height", value)}
          />
          <InputNumber
            value={styles.posterWrapper.height}
            size="small"
            min={0}
            max={100}
            onChange={(value) => updateStyles("posterWrapper.height", value)}
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="mb-2">
        <Divider>Background Color</Divider>
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
        />
      </div>

      {/* Border Style */}
      <div className="mb-2">
        <Divider>Border</Divider>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1">Style</small>
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
          />
        </div>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1">Width</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={20}
            value={styles.posterWrapper.borderWidth}
            onChange={(value) =>
              updateStyles("posterWrapper.borderWidth", value || 0)
            }
          />
        </div>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1">Radius</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={50}
            value={styles.posterWrapper.borderRadius}
            onChange={(value) =>
              updateStyles("posterWrapper.borderRadius", value || 0)
            }
          />
        </div>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1">Color</small>
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
          />
        </div>
      </div>
    </>
  );
};

export default PosterWrapperSetting;
