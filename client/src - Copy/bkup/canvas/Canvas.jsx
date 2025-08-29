import { ColorPicker, Select, InputNumber } from "antd";
const Canvas = () => {
  const DEFAULT_COLOR = [
    {
      color: "#108ee9ff",
      percent: 0,
    },
    {
      color: "#87d068ff",
      percent: 100,
    },
  ];

  return (
    <>
      <hr className="mb-1 mt-1" />
      <div className="d-flex align-items-center">
        <small className="me-2" style={{ whiteSpace: "nowrap" }}>
          Paper Size:
        </small>
        <Select
          className="w-100"
          value="210x297"
          optionFilterProp="label"
          showSearch
          size="small"
          options={[
            { label: "A0", value: "841x1189", disabled: "disabled" },
            { label: "A1", value: "594x841", disabled: "disabled" },
            { label: "A2", value: "420x594", disabled: "disabled" },
            { label: "A3", value: "297x420", disabled: "disabled" },
            { label: "A4", value: "210x297" },
            { label: "A5", value: "148x210" },
            { label: "A6", value: "105x148" },
            { label: "B0", value: "1000x1414" },
            { label: "B1", value: "707x1000" },
            { label: "B2", value: "500x707" },
            { label: "B3", value: "353x500" },
            { label: "B4", value: "250x353" },
            { label: "B5", value: "176x250" },
            { label: "C0", value: "917x1297" },
            { label: "C1", value: "648x917" },
            { label: "C2", value: "458x648" },
            { label: "C3", value: "324x458" },
            { label: "C4", value: "229x324" },
            { label: "C5", value: "162x229" },
            { label: "Letter", value: "216x279" },
            { label: "Legal", value: "216x356" },
            { label: "Tabloid", value: "279x432" },
          ]}
        />
      </div>
      <hr className="mb-1 mt-1" />
      <div className="d-flex align-items-center">
        <small className="me-2">BackGround Color:</small>
        <ColorPicker
          defaultValue={DEFAULT_COLOR}
          allowClear
          size="small"
          mode={["single", "gradient"]}
          onChangeComplete={(color) => {
            console.log(color.toCssString());
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
          value="None"
          optionFilterProp="label"
          size="small"
          options={[
            { label: "Solid", value: "841x1189" },
            { label: "Dashed", value: "594x841" },
            { label: "Dotted", value: "420x594" },
            { label: "None", value: "297x420" },
          ]}
        />
      </div>
      <div className="d-flex align-items-center mb-1">
        <small className="me-2" style={{ whiteSpace: "nowrap" }}>
          Border Width:
        </small>
        <InputNumber className="w-100" size="small" />
      </div>
      <div className="d-flex align-items-center">
        <small className="me-2" style={{ whiteSpace: "nowrap" }}>
          Border Color:
        </small>
        <ColorPicker
          defaultValue={DEFAULT_COLOR}
          allowClear
          size="small"
          mode={["single", "gradient"]}
          onChangeComplete={(color) => {
            console.log(color.toCssString());
          }}
        />
      </div>
      <hr className="mb-1 mt-1" />
    </>
  );
};
export default Canvas;
