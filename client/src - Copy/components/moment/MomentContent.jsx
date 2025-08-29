import { MdEdit } from "react-icons/md";
import { PiHandGrabbing } from "react-icons/pi";

const MomentContent = ({
  styles,
  handleMouseDown,
  positions,
  getFinalStyle,
  showDrawer,
}) => {
  return (
    <>
      <div
        className="momentContent glb"
        style={{
          left: positions.momentContent.x,
          top: positions.momentContent.y,
          backgroundColor: styles.bgColor,
          width: styles.width + "%",
        }}
      >
        <div
          className="editIconWrapper"
          onClick={() => showDrawer("momentContent")}
        >
          <MdEdit className="editIcon" />
        </div>
        <div
          className="grabbingIconWrapper"
          onMouseDown={(e) => handleMouseDown(e, "momentContent")}
        >
          <PiHandGrabbing className="grabbingIcon" />
        </div>

        {Object.keys(styles.visibleNodes).map(
          (node) =>
            styles.visibleNodes[node] && (
              <div
                key={node}
                className="textNode glb"
                onMouseDown={(e) => handleMouseDown(e, node)}
                style={{
                  left: positions[node].x,
                  top: positions[node].y,
                  cursor: "grabbing",
                  color: getFinalStyle(node).textColor,
                  fontFamily: getFinalStyle(node).fontFamily,
                  fontSize: getFinalStyle(node).fontSize,
                  fontWeight: getFinalStyle(node).fontWeight,
                  fontStyle: getFinalStyle(node).fontStyle,
                  textDecoration: getFinalStyle(node).textDecoration,
                }}
              >
                <div
                  className="editIconWrapper"
                  onClick={() => showDrawer(node)}
                >
                  <MdEdit className="editIcon" />
                </div>
                {node === "address" && "London, United Kingdom"}
                {node === "date" && "20th September 2021 - 12:00 AM"}
                {node === "message" && "Magical Night Sky"}
                {node === "title" && "Abbas turi london."}
                {node === "coordinate" && "51.5073° N, 0.1276° W"}
              </div>
            )
        )}
      </div>
    </>
  );
};
export default MomentContent;
