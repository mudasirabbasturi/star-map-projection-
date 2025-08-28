import { MdEdit } from "react-icons/md";
const Title = ({ showDrawer }) => {
  return (
    <>
      <div className={`textNode  glb`}>
        <div className="editIconWrapper" onClick={() => showDrawer("title")}>
          <MdEdit className="editIcon" />
        </div>
        OUR LUCKY STARS
      </div>
    </>
  );
};

export default Title;
