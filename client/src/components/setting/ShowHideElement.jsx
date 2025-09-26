// src/components/setting/ShowHideElement.jsx
import { Divider, Checkbox } from "antd";

const ShowHideElement = ({ showStyles, updateShowStyles }) => {
  return (
    <>
      {/* Checkbox show/hide Content */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Show / Hide Element</Divider>
        <div>
          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.starMap}
            onChange={(e) => updateShowStyles("starMap", e.target.checked)}
            disabled
          >
            Star Map
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.title}
            onChange={(e) => updateShowStyles("title", e.target.checked)}
          >
            Title
          </Checkbox>

          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.content}
            onChange={(e) => updateShowStyles("content", e.target.checked)}
          >
            Content
          </Checkbox>

          {/* <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.CustomImg}
            onChange={(e) => updateShowStyles("CustomImg", e.target.checked)}
          >
            Custom Image
          </Checkbox> */}
          <Checkbox
            className="text-muted fst-italic"
            checked={showStyles.moonMap}
            onChange={(e) => updateShowStyles("moonMap", e.target.checked)}
            disabled
          >
            Moon Map
          </Checkbox>
        </div>
      </div>
    </>
  );
};

export default ShowHideElement;
