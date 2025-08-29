import { MdEdit } from "react-icons/md";
const Coordinate = ({ showDrawer }) => {
  return (
    <>
      <div className={`textNode  glb`}>
        <div
          className="editIconWrapper"
          onClick={() => showDrawer("coordinate")}
        >
          <MdEdit className="editIcon" />
        </div>
        51.5073° N, 0.1276° W
      </div>
    </>
  );
};

export default Coordinate;
