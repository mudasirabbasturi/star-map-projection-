import { LuRectangleVertical } from "react-icons/lu";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { GiOrbital } from "react-icons/gi";
import { MdOutlineTextRotateVertical } from "react-icons/md";
import { CiFolderOff } from "react-icons/ci";
import { LiaFileDownloadSolid } from "react-icons/lia";

const Sidebar = ({ handleScreenShot, showDrawer }) => {
  return (
    <>
      <div className="sidebar">
        <LuRectangleVertical
          className="sidebarIcon"
          onClick={() => showDrawer("poster")}
        />
        <HiOutlineRectangleGroup
          className="sidebarIcon"
          onClick={() => showDrawer("posterWrapper")}
        />
        <GiOrbital className="sidebarIcon" onClick={() => showDrawer("map")} />
        <MdOutlineTextRotateVertical
          className="sidebarIcon"
          onClick={() => showDrawer("content")}
        />
        <CiFolderOff className="sidebarIcon" />
        <LiaFileDownloadSolid
          className="sidebarIcon"
          onClick={handleScreenShot}
        />
      </div>
    </>
  );
};
export default Sidebar;
