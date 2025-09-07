import { LuRectangleVertical } from "react-icons/lu";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { GiOrbital } from "react-icons/gi";
import { MdOutlineTextRotateVertical } from "react-icons/md";
import { CiFolderOff } from "react-icons/ci";
import { LiaFileDownloadSolid } from "react-icons/lia";

const Sidebar = ({ loading, handleScreenShot }) => {
  return (
    <>
      <aside className="sidebar">
        <button className="btn p-0 sidebarIcon" disabled={loading}>
          <LuRectangleVertical />
        </button>
        <button className="btn p-0 sidebarIcon" disabled={loading}>
          <HiOutlineRectangleGroup />
        </button>
        <button className="btn p-0 sidebarIcon" disabled={loading}>
          <GiOrbital />
        </button>
        <button className="btn p-0 sidebarIcon" disabled={loading}>
          <MdOutlineTextRotateVertical />
        </button>
        <button className="btn p-0 sidebarIcon" disabled={loading}>
          <CiFolderOff />
        </button>
        <button
          className="btn p-0 sidebarIcon"
          disabled={loading}
          onClick={handleScreenShot}
        >
          <LiaFileDownloadSolid />
        </button>
      </aside>
    </>
  );
};
export default Sidebar;
