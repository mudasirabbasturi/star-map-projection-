import { Input, ColorPicker, Select, InputNumber, DatePicker } from "antd";
const Moment = () => {
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
      <small>Search The Place Of Your Moment.</small>
      <hr className="mb-1 mt-1" />
      <div className="d-flex align-items-center mb-1">
        <small className="me-1" style={{ whiteSpace: "nowrap" }}>
          Moment:
        </small>
        <Input value="London, United Kingdom" size="small" />
      </div>
      <div className="d-flex align-items-center mb-1">
        <small className="me-1" style={{ whiteSpace: "nowrap" }}>
          Text Color:
        </small>
        <ColorPicker
          defaultValue={DEFAULT_COLOR}
          allowClear
          size="small"
          mode={["single"]}
          onChangeComplete={(color) => {
            console.log(color.toCssString());
          }}
        />
      </div>
      {/* <div className="d-flex flex-column">
        <small className="mb-1" style={{ whiteSpace: "nowrap" }}>
          Select The Date Of Your Moment.
        </small>
        <DatePicker showTime size="small" />
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
      <hr className="mb-1 mt-1" /> */}
    </>
  );
};
export default Moment;
