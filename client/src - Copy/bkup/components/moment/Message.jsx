import { MdEdit } from "react-icons/md";
const Message = ({ showDrawer }) => {
  return (
    <>
      <div className={`textNode  glb`}>
        <div className="editIconWrapper" onClick={() => showDrawer("message")}>
          <MdEdit className="editIcon" />
        </div>
        Magical Night Sky
      </div>
    </>
  );
};

export default Message;
