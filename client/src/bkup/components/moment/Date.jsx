import { MdEdit } from "react-icons/md";
const Date = ({ showDrawer }) => {
  return (
    <>
      <div className={`textNode  glb`}>
        <div className="editIconWrapper" onClick={() => showDrawer("date")}>
          <MdEdit className="editIcon" />
        </div>
        20th September 2021 - 12:00 AM
      </div>
    </>
  );
};
export default Date;
