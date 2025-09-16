// src/components/setting/MapSetting.jsx
import { useEffect, useRef, useState } from "react";

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
  AutoComplete,
  Input,
  InputNumber,
  Select,
  Slider,
  Checkbox,
  DatePicker,
} from "antd";

import dayjs from "dayjs";

import BackgroundImagePicker from "./BackgroundImagePicker";

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const MapSetting = ({ styles, updateStyles }) => {
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
          style={{ height: 300, overflowY: "auto", padding: "5px 0 5px 4px" }}
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

  const [options, setOptions] = useState([]);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    if (window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      const dummyMap = document.createElement("div");
      placesService.current = new window.google.maps.places.PlacesService(
        dummyMap
      );
    }
  }, []);

  const handleSearch = (value) => {
    if (!value || !autocompleteService.current) {
      setOptions([]);
      return;
    }
    autocompleteService.current.getPlacePredictions(
      { input: value },
      (predictions) => {
        if (predictions) {
          setOptions(
            predictions.map((p) => ({
              value: p.description,
              placeId: p.place_id,
            }))
          );
        } else {
          setOptions([]);
        }
      }
    );
  };

  const handleSelect = (value, option) => {
    if (!placesService.current) return;
    placesService.current.getDetails(
      { placeId: option.placeId },
      (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place.geometry
        ) {
          const lat = place.geometry.location.lat();
          const lon = place.geometry.location.lng();
          updateStyles("map.lat", lat);
          updateStyles("map.lon", lon);
        }
      }
    );
  };

  return (
    <>
      {/* Show/hide checkboxes */}
      <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>Show / Hide Elements</Divider>
        <div>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.map.showStars}
            onChange={(e) => updateStyles("map.showStars", e.target.checked)}
          >
            Show Stars
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.map.showMilkyway}
            onChange={(e) => updateStyles("map.showMilkyway", e.target.checked)}
          >
            Show Milky Way
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.map.showGraticule}
            onChange={(e) =>
              updateStyles("map.showGraticule", e.target.checked)
            }
          >
            Show Graticule
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.map.showConstellations}
            onChange={(e) =>
              updateStyles("map.showConstellations", e.target.checked)
            }
          >
            Show Constellations
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.map.showPlanets}
            onChange={(e) => updateStyles("map.showPlanets", e.target.checked)}
          >
            Show Planets
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.map.showPlanetNames}
            onChange={(e) =>
              updateStyles("map.showPlanetNames", e.target.checked)
            }
          >
            Show Planet Names
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.map.showMoon}
            onChange={(e) => updateStyles("map.showMoon", e.target.checked)}
          >
            Show Moon
          </Checkbox>
        </div>
      </div>
      {/* Projection */}
      <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>Projection</Divider>
        <Select
          className="w-100"
          value={styles.map.projection}
          onChange={(val) => updateStyles("map.projection", val)}
          size="small"
          options={[
            { label: "Orthographic", value: "orthographic" },
            { label: "Stereographic", value: "stereographic" },
            { label: "Aitoff", value: "aitoff" },
          ]}
        />
      </div>
      {/* Background Settings */}
      <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>Background</Divider>

        <div className="d-flex align-items-center mb-2">
          <small className="me-2 text-muted fst-italic">Type:</small>
          <Select
            className="w-100"
            value={styles.map.bgType}
            style={{ width: 160 }}
            onChange={(val) => updateStyles("map.bgType", val)}
            options={[
              { label: "None", value: "none" },
              { label: "Color", value: "color" },
              { label: "Image", value: "image" },
              { label: "Both", value: "both" },
            ]}
            size="small"
          />
        </div>

        {/* 🔹 Show only when bgType = color or both */}
        {(styles.map.bgType === "color" || styles.map.bgType === "both") && (
          <div className="mb-2 d-flex align-items-center">
            <small className="me-2 text-muted fst-italic">Color:</small>
            <ColorPicker
              className="w-100"
              value={styles.map.fill}
              onChangeComplete={(color) =>
                updateStyles("map.fill", color.toCssString())
              }
              presets={presets}
              panelRender={customPanelRender}
              size="small"
              style={{ flex: 1 }}
            />
          </div>
        )}

        {/* 🔹 Show only when bgType = image or both */}
        {(styles.map.bgType === "image" || styles.map.bgType === "both") && (
          <div>
            <BackgroundImagePicker
              styles={{
                bgImage: styles.map.bgImage,
                bgImageOpacity: styles.map.bgImageOpacity,
                bgImageMode: styles.map.bgImageMode,
              }}
              updateStyles={(key, value) => updateStyles(`map.${key}`, value)}
            />
            <Select
              value={styles.map.bgImageMode}
              onChange={(val) => updateStyles("map.bgImageMode", val)}
              style={{ width: "100%", marginTop: 8 }}
              size="small"
              options={[
                { label: "Cover", value: "cover" },
                { label: "Contain", value: "contain" },
                { label: "Stretch", value: "100% 100%" },
              ]}
            />
            <div className="d-flex align-items-center mt-2">
              <small className="me-1 text-muted fst-italic">Opacity:</small>
              <Slider
                className="w-75"
                min={0}
                max={1}
                step={0.05}
                value={styles.map.bgImageOpacity}
                onChange={(val) => updateStyles("map.bgImageOpacity", val)}
                size="small"
              />
              <InputNumber
                className="w-25"
                size="small"
                min={0}
                max={1}
                step={0.05}
                value={styles.map.bgImageOpacity}
                onChange={(val) => updateStyles("map.bgImageOpacity", val)}
              />
            </div>
          </div>
        )}
      </div>
      {/* Mask Shape */}
      <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>Mask Shape</Divider>
        <div className="d-flex align-items-center">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
          >
            {styles.map.maskShape}
          </small>
          <Select
            className="w-100"
            value={styles.map.maskShape}
            onChange={(value) => updateStyles("map.maskShape", value)}
            size="small"
            options={[
              { value: "circle", label: "Circle" },
              { value: "heart", label: "Heart" },
              { value: "triangle", label: "Triangle" },
              { value: "rect", label: "Rectangle" },
              { value: "apple", label: "Apple Inc" },
            ]}
          />
        </div>
      </div>
      {/* BackGround Color */}
      {/* <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>BackGround</Divider>
        <div className="d-flex align-items-center">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Color:
          </small>
          <ColorPicker
            value={styles.map.fill}
            onChangeComplete={(color) =>
              updateStyles("map.fill", color.toCssString())
            }
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            style={{ flex: 1 }}
          />
        </div>
      </div> */}
      {/* Stroke Style */}
      <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>Border</Divider>
        <div className="d-flex align-items-center mb-2">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Style:
          </small>
          <Select
            className="w-100"
            value={styles.map.strokeStyle}
            onChange={(value) => updateStyles("map.strokeStyle", value)}
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
        <div className="d-flex align-items-center mb-2">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Width:
          </small>
          <Slider
            min={0}
            max={20}
            value={styles.map.strokeWidth}
            onChange={(v) => updateStyles("map.strokeWidth", v || 0)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={0}
            max={20}
            value={styles.map.strokeWidth}
            onChange={(v) => updateStyles("map.strokeWidth", v || 0)}
            size="small"
          />
        </div>
        <div className="d-flex align-items-center mb-2">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Color:
          </small>
          <ColorPicker
            value={styles.map.strokeColor}
            onChangeComplete={(color) =>
              updateStyles("map.strokeColor", color.toCssString())
            }
            presets={presets}
            panelRender={customPanelRender}
            size="small"
            style={{ flex: 1 }}
          />
        </div>
      </div>
      {/* Milky Way | Star Size Multiplier | Magnitude Limit */}
      <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>
          Milky Way / Star / Magnitude
        </Divider>
        <div className="d-flex align-items-center mb-1">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Opacity:
          </small>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={styles.map.milkywayOpacity}
            onChange={(v) => updateStyles("map.milkywayOpacity", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={0}
            max={1}
            step={0.05}
            value={styles.map.milkywayOpacity}
            onChange={(v) => updateStyles("map.milkywayOpacity", v)}
            size="small"
          />
        </div>
        <div className="d-flex align-items-center mb-1">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Size Multiplier:
          </small>
          <Slider
            min={0.3}
            max={3}
            step={0.1}
            value={styles.map.sizeMult}
            onChange={(v) => updateStyles("map.sizeMult", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={0.3}
            max={3}
            step={0.1}
            value={styles.map.sizeMult}
            onChange={(v) => updateStyles("map.sizeMult", v)}
            size="small"
          />
        </div>
        <div className="d-flex align-items-center">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Limit:
          </small>
          <Slider
            min={1}
            max={10}
            step={0.1}
            value={styles.map.magLimit}
            onChange={(v) => updateStyles("map.magLimit", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={1}
            max={10}
            step={0.1}
            value={styles.map.magLimit}
            onChange={(v) => updateStyles("map.magLimit", v)}
            size="small"
          />
        </div>
      </div>
      {/* Width / Height */}
      <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>Map Width & Height</Divider>
        <div className="d-flex align-items-center mb-2">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Width:
          </small>
          <Slider
            min={30}
            max={100}
            value={styles.map.width}
            onChange={(v) => updateStyles("map.width", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={30}
            max={100}
            value={styles.map.width}
            onChange={(v) => updateStyles("map.width", v)}
            size="small"
          />
        </div>
        <div className="d-flex align-items-center">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Height:
          </small>
          <Slider
            min={0}
            max={100}
            value={styles.map.height || 0}
            onChange={(v) => updateStyles("map.height", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={0}
            max={100}
            value={styles.map.height || 0}
            onChange={(v) => updateStyles("map.height", v)}
            size="small"
          />
        </div>
      </div>

      <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>Date & Time</Divider>
        <DatePicker
          showTime
          value={dayjs(styles.map.date)}
          onChange={(val) =>
            updateStyles("map.date", val ? val.toISOString() : null)
          }
          style={{ width: "100%" }}
        />
      </div>
      {/* Latitude / Longitude */}
      <div className="mb-2">
        <Divider style={{ fontStyle: "italic" }}>Coordinates</Divider>
        <div className="d-flex align-items-center mb-2">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Location:
          </small>
          <AutoComplete
            style={{ width: "100%" }}
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
          >
            <Input placeholder="Search location..." />
          </AutoComplete>
        </div>
        <div className="d-flex align-items-center mb-2">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Latitude:
          </small>
          <Slider
            min={-90}
            max={90}
            value={styles.map.lat}
            onChange={(v) => updateStyles("map.lat", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={-90}
            max={90}
            value={styles.map.lat}
            onChange={(v) => updateStyles("map.lat", v)}
            size="small"
          />
        </div>
        <div className="d-flex align-items-center">
          <small
            className="me-2 text-muted fst-italic"
            style={{ whiteSpace: "nowrap" }}
          >
            Longitude:
          </small>
          <Slider
            min={-180}
            max={180}
            value={styles.map.lon}
            onChange={(v) => updateStyles("map.lon", v)}
            className="w-100 me-2 mt-0 mb-0"
            size="small"
          />
          <InputNumber
            min={-180}
            max={180}
            value={styles.map.lon}
            onChange={(v) => updateStyles("map.lon", v)}
            size="small"
          />
        </div>
      </div>
    </>
  );
};

export default MapSetting;
