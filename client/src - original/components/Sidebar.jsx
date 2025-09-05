import { FaPenToSquare } from "react-icons/fa6";
import { LuCloudUpload } from "react-icons/lu";
import { MdOutlineEditNote, MdEdit } from "react-icons/md";
import { CiUndo } from "react-icons/ci";
import { FaDownload } from "react-icons/fa";
const Sidebar = ({ handleScreenShot }) => {
  return (
    <>
      <div className="sidebar">
        <button className="btn btn-sm btn-primary" onClick={handleScreenShot}>
          <FaDownload />
        </button>
      </div>
    </>
  );
};
export default Sidebar;
