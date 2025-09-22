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

const PosterWrapperSetting = ({
  posterWrapperStyles,
  updatePosterWrapperStyles,
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
      <Divider>Dimension</Divider>
      {/* Width */}
      <div className="mb-1">
        <div className="d-flex align-items-center mb-1">
          <small className="me-1 text-muted fst-italic">Width</small>
          <Slider
            className="w-100 me-2"
            min={30}
            max={100}
            value={posterWrapperStyles.width}
            onChange={(value) => updatePosterWrapperStyles("width", value)}
          />
          <InputNumber
            value={posterWrapperStyles.width}
            size="small"
            min={30}
            max={100}
            onChange={(value) => updatePosterWrapperStyles("width", value)}
          />
        </div>
      </div>
      {/* Height */}
      <div className="mb-1">
        <div className="d-flex align-items-center mb-1">
          <small className="me-1 text-muted fst-italic">Height</small>
          <Slider
            className="w-100 me-2"
            min={0}
            max={100}
            step={0.1}
            value={posterWrapperStyles.height}
            onChange={(value) => updatePosterWrapperStyles("height", value)}
          />
          <InputNumber
            value={posterWrapperStyles.height}
            size="small"
            min={0}
            max={100}
            step={0.1}
            onChange={(value) => updatePosterWrapperStyles("height", value)}
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="mb-2">
        <Divider>Background Color</Divider>
        <ColorPicker
          style={{ width: "100%" }}
          allowClear
          value={posterWrapperStyles.bgColor}
          onChangeComplete={(color) =>
            updatePosterWrapperStyles("bgColor", color.toCssString())
          }
          posterWrapperStyles={{ popupOverlayInner: { width: 480 } }}
          presets={presets}
          panelRender={customPanelRender}
          size="small"
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
            value={posterWrapperStyles.borderStyle}
            onChange={(value) =>
              updatePosterWrapperStyles("borderStyle", value)
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
          <small className="me-1 text-muted fst-italic">Width</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={20}
            value={posterWrapperStyles.borderWidth}
            onChange={(value) =>
              updatePosterWrapperStyles("borderWidth", value || 0)
            }
            disabled={posterWrapperStyles.borderStyle === "none"}
          />
        </div>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1 text-muted fst-italic">Radius</small>
          <InputNumber
            className="w-100"
            size="small"
            min={0}
            max={50}
            value={posterWrapperStyles.borderRadius}
            onChange={(value) =>
              updatePosterWrapperStyles("borderRadius", value || 0)
            }
            disabled={posterWrapperStyles.borderStyle === "none"}
          />
        </div>
        <div className="d-flex align-items-center mb-1">
          <small className="me-1 text-muted fst-italic">Color</small>
          <ColorPicker
            style={{ width: "100%" }}
            allowClear
            value={posterWrapperStyles.borderColor}
            onChangeComplete={(color) =>
              updatePosterWrapperStyles("borderColor", color.toCssString())
            }
            posterWrapperStyles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            disabled={posterWrapperStyles.borderStyle === "none"}
          />
        </div>
      </div>
    </>
  );
};

export default PosterWrapperSetting;
