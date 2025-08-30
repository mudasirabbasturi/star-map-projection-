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
import { Col, ColorPicker, Divider, Row, theme } from "antd";

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const Poster = ({ styles, setStyles }) => {
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
        <div style={{ height: "70vh", overflowY: "auto", paddingRight: 4 }}>
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
      <hr className="mb-1 mt-1" />
      <div className="d-flex align-items-center">
        <small className="me-2">Background Color:</small>
        <ColorPicker
          value={styles.bgColor}
          onChangeComplete={(color) =>
            setStyles({ ...styles, bgColor: color.toCssString() })
          }
          styles={{ popupOverlayInner: { width: 480 } }}
          presets={presets}
          panelRender={customPanelRender}
          size="small"
        />
      </div>
      <hr className="mb-1 mt-1" />
    </>
  );
};

export default Poster;
