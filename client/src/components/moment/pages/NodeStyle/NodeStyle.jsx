import { InputNumber, Select, Slider, ColorPicker, Checkbox } from "antd";
const NodeStyle = ({ styles, setStyles, fontFamilies }) => {
  return (
    <>
      <hr className="mb-1 mt-1" />
      <div className="d-flex align-items-center">
        <small className="me-2">BackGround Color:</small>
        <ColorPicker
          allowClear
          size="small"
          value={styles.bgColor}
          onChangeComplete={(color) =>
            setStyles({ ...styles, bgColor: color.toCssString() })
          }
        />
      </div>
      <div className="d-flex align-items-center">
        <small className="me-2">Text Color:</small>
        <ColorPicker
          allowClear
          size="small"
          value={styles.textColor}
          onChangeComplete={(color) =>
            setStyles({ ...styles, textColor: color.toCssString() })
          }
        />
      </div>
      <hr className="mb-1 mt-1" />
      <div className="d-flex align-items-center">
        <small className="me-2" style={{ whiteSpace: "nowrap" }}>
          Width:
        </small>
        <Slider
          className="me-3"
          min={10}
          max={100}
          style={{ width: "100%" }}
          value={styles.width}
          onChange={(val) => setStyles({ ...styles, width: val })}
        />
        <InputNumber
          style={{ width: "90%" }}
          min={10}
          max={100}
          value={styles.width}
          onChange={(val) => setStyles({ ...styles, width: val })}
          size="small"
          suffix="%"
        />
      </div>
      <hr className="mb-1 mt-1" />
      <div className="d-flex align-items-center mb-1">
        <small className="me-2" style={{ whiteSpace: "nowrap" }}>
          Font Family:
        </small>
        <Select
          className="w-100"
          value={styles.fontFamily}
          onChange={(val) => setStyles({ ...styles, fontFamily: val })}
          options={fontFamilies}
          size="small"
        />
      </div>
      <div className="d-flex align-items-center mb-1">
        <small className="me-2" style={{ whiteSpace: "nowrap" }}>
          Font Style:
        </small>
        <Select
          className="w-100"
          value={styles.fontStyle}
          onChange={(val) => setStyles({ ...styles, fontStyle: val })}
          options={[
            { label: "Normal", value: "normal" },
            { label: "Italic", value: "italic" },
          ]}
          size="small"
        />
      </div>
      <div className="d-flex align-items-center mb-1">
        <small className="me-2" style={{ whiteSpace: "nowrap" }}>
          Font Weight:
        </small>
        <Select
          className="w-100"
          value={styles.fontWeight}
          onChange={(val) => setStyles({ ...styles, fontWeight: val })}
          options={[
            { label: "Normal", value: "normal" },
            { label: "Bold", value: "bold" },
            { label: "Lighter", value: "lighter" },
          ]}
          size="small"
        />
      </div>
      <div className="d-flex align-items-center mb-1">
        <small className="me-2" style={{ whiteSpace: "nowrap" }}>
          Text Decoration:
        </small>
        <Select
          className="w-100"
          value={styles.textDecoration}
          onChange={(val) => setStyles({ ...styles, textDecoration: val })}
          options={[
            { label: "None", value: "none" },
            { label: "Underline", value: "underline" },
            { label: "Overline", value: "overline" },
            { label: "Line Through", value: "line-through" },
          ]}
          size="small"
        />
      </div>
      <div className="d-flex align-items-center">
        <small className="me-2" style={{ whiteSpace: "nowrap" }}>
          Font Size:
        </small>
        <Slider
          min={8}
          max={72}
          value={styles.fontSize}
          onChange={(val) => setStyles({ ...styles, fontSize: val })}
          className="me-3"
          style={{ width: "100%" }}
        />
        <InputNumber
          min={8}
          max={72}
          value={styles.fontSize}
          onChange={(val) => setStyles({ ...styles, fontSize: val })}
        />
      </div>
    </>
  );
};
export default NodeStyle;
