// src/components/setting/ShowHideElement.jsx
import { Divider, Checkbox } from "antd";

const ShowHideElement = ({ styles, updateStyles }) => {
  return (
    <>
      {/* Checkbox show/hide Content */}
      <div className="pb-2">
        <Divider style={{ fontStyle: "italic" }}>Show / Hide Element</Divider>
        <div>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.show.starMap}
            onChange={(e) => updateStyles("show.starMap", e.target.checked)}
            disabled
          >
            Star Map
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.show.title}
            onChange={(e) => updateStyles("show.title", e.target.checked)}
          >
            Title
          </Checkbox>

          <Checkbox
            className="text-muted fst-italic"
            checked={styles.show.content}
            onChange={(e) => updateStyles("show.content", e.target.checked)}
          >
            Content
          </Checkbox>

          <Checkbox
            className="text-muted fst-italic"
            checked={styles.show.CustomImg}
            onChange={(e) => updateStyles("show.CustomImg", e.target.checked)}
          >
            Custom Image
          </Checkbox>
          <Checkbox
            className="text-muted fst-italic"
            checked={styles.show.moonMap}
            onChange={(e) => updateStyles("show.moonMap", e.target.checked)}
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
