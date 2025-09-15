// TextSetting.jsx
import React, { useState } from "react";
import {
  Divider,
  Input,
  InputNumber,
  Select,
  ColorPicker,
  Button,
  Space,
  Collapse,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

const fonts = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Georgia",
  "Tahoma",
  "Trebuchet MS",
];

const TextSetting = ({ texts, setTexts, activeText, setActiveText }) => {
  const [textElements, setTextElements] = useState(texts || []);
  const [visibleElements, setVisibleElements] = useState(
    texts ? texts.map(() => true) : []
  );

  const handleAddText = () => {
    const newText = {
      id: Date.now(),
      text: "New Text",
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      top: 100,
      left: 100,
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "left",
      opacity: 1,
      visible: true,
    };

    const updatedTexts = [...textElements, newText];
    setTextElements(updatedTexts);
    setTexts(updatedTexts);
    setActiveText(updatedTexts.length - 1);

    setVisibleElements([...visibleElements, true]);
  };

  const handleRemoveText = (index) => {
    const updatedTexts = textElements.filter((_, i) => i !== index);
    setTextElements(updatedTexts);
    setTexts(updatedTexts);

    const updatedVisibility = visibleElements.filter((_, i) => i !== index);
    setVisibleElements(updatedVisibility);

    if (activeText === index) {
      setActiveText(null);
    } else if (activeText > index) {
      setActiveText(activeText - 1);
    }
  };

  const updateTextProperty = (index, property, value) => {
    const updatedTexts = [...textElements];
    updatedTexts[index] = {
      ...updatedTexts[index],
      [property]: value,
    };
    setTextElements(updatedTexts);
    setTexts(updatedTexts);
  };

  const toggleVisibility = (index) => {
    const updatedVisibility = [...visibleElements];
    updatedVisibility[index] = !updatedVisibility[index];
    setVisibleElements(updatedVisibility);

    updateTextProperty(index, "visible", updatedVisibility[index]);
  };

  return (
    <>
      <Divider>Text Elements</Divider>
      <Button
        block
        type="primary"
        onClick={handleAddText}
        style={{ marginBottom: 16 }}
      >
        + Add Text
      </Button>

      <Collapse accordion>
        {textElements.map((text, index) => (
          <Panel
            key={text.id || index}
            header={
              <span>
                {text.text || "Empty Text"}
                {!visibleElements[index] && " (Hidden)"}
              </span>
            }
            extra={
              <Space>
                <Button
                  type="text"
                  icon={
                    visibleElements[index] ? (
                      <EyeOutlined />
                    ) : (
                      <EyeInvisibleOutlined />
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(index);
                  }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveText(index);
                  }}
                />
              </Space>
            }
          >
            <div style={{ padding: "10px 0" }}>
              <div className="mb-2">
                <small>Text Content:</small>
                <Input
                  value={text.text}
                  onChange={(e) =>
                    updateTextProperty(index, "text", e.target.value)
                  }
                />
              </div>

              <Row gutter={8}>
                <Col span={12}>
                  <div className="mb-2">
                    <small>Font Family:</small>
                    <Select
                      className="w-100"
                      size="small"
                      value={text.fontFamily}
                      options={fonts.map((f) => ({ label: f, value: f }))}
                      onChange={(val) =>
                        updateTextProperty(index, "fontFamily", val)
                      }
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-2">
                    <small>Font Size:</small>
                    <InputNumber
                      className="w-100"
                      size="small"
                      min={8}
                      max={120}
                      value={text.fontSize}
                      onChange={(val) =>
                        updateTextProperty(index, "fontSize", val)
                      }
                    />
                  </div>
                </Col>
              </Row>

              <div className="mb-2">
                <small>Text Color:</small>
                <ColorPicker
                  style={{ width: "100%" }}
                  value={text.color}
                  onChangeComplete={(c) =>
                    updateTextProperty(index, "color", c.toHexString())
                  }
                />
              </div>

              <Row gutter={8}>
                <Col span={8}>
                  <div className="mb-2">
                    <small>Font Weight:</small>
                    <Select
                      className="w-100"
                      size="small"
                      value={text.fontWeight}
                      options={[
                        { label: "Normal", value: "normal" },
                        { label: "Bold", value: "bold" },
                        { label: "Lighter", value: "lighter" },
                        { label: "Bolder", value: "bolder" },
                      ]}
                      onChange={(val) =>
                        updateTextProperty(index, "fontWeight", val)
                      }
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div className="mb-2">
                    <small>Font Style:</small>
                    <Select
                      className="w-100"
                      size="small"
                      value={text.fontStyle}
                      options={[
                        { label: "Normal", value: "normal" },
                        { label: "Italic", value: "italic" },
                        { label: "Oblique", value: "oblique" },
                      ]}
                      onChange={(val) =>
                        updateTextProperty(index, "fontStyle", val)
                      }
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div className="mb-2">
                    <small>Text Align:</small>
                    <Select
                      className="w-100"
                      size="small"
                      value={text.textAlign}
                      options={[
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                        { label: "Justify", value: "justify" },
                      ]}
                      onChange={(val) =>
                        updateTextProperty(index, "textAlign", val)
                      }
                    />
                  </div>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={12}>
                  <div className="mb-2">
                    <small>Position X:</small>
                    <InputNumber
                      className="w-100"
                      size="small"
                      value={text.left}
                      onChange={(val) => updateTextProperty(index, "left", val)}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-2">
                    <small>Position Y:</small>
                    <InputNumber
                      className="w-100"
                      size="small"
                      value={text.top}
                      onChange={(val) => updateTextProperty(index, "top", val)}
                    />
                  </div>
                </Col>
              </Row>

              <div className="mb-2">
                <small>Opacity:</small>
                <InputNumber
                  className="w-100"
                  size="small"
                  min={0}
                  max={1}
                  step={0.1}
                  value={text.opacity}
                  onChange={(val) => updateTextProperty(index, "opacity", val)}
                />
              </div>
            </div>
          </Panel>
        ))}
      </Collapse>
    </>
  );
};

export default TextSetting;
