import { LuRectangleVertical } from "react-icons/lu";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { GiOrbital } from "react-icons/gi";
import { MdOutlineTextRotateVertical } from "react-icons/md";
import { GoDesktopDownload } from "react-icons/go";
import { FaStarAndCrescent } from "react-icons/fa";

import { CiImageOff, CiText } from "react-icons/ci";
import { Tooltip } from "antd";
import { BiHide } from "react-icons/bi";

const Sidebar = ({ loading, showDrawer, handleScreenShot }) => {
  return (
    <>
      <aside className="sidebar">
        <Tooltip
          placement="right"
          title="Show / Hide Element."
          color="geekblue"
        >
          <button
            className="btn p-0 sidebarIcon"
            disabled={loading}
            onClick={() => showDrawer("show_hide")}
          >
            <BiHide />
          </button>
        </Tooltip>
        <Tooltip placement="right" title="Edit Poster" color="geekblue">
          <button
            className="btn p-0 sidebarIcon"
            disabled={loading}
            onClick={() => showDrawer("poster")}
          >
            <LuRectangleVertical />
          </button>
        </Tooltip>
        <Tooltip
          placement="right"
          title="Edit Map / Content Inner Body"
          color="geekblue"
        >
          <button
            className="btn p-0 sidebarIcon"
            disabled={loading}
            onClick={() => showDrawer("posterWrapper")}
          >
            <HiOutlineRectangleGroup />
          </button>
        </Tooltip>
        <Tooltip
          placement="right"
          title="Edit Map / Mask Shape"
          color="geekblue"
        >
          <button
            className="btn p-0 sidebarIcon"
            disabled={loading}
            onClick={() => showDrawer("map")}
          >
            <FaStarAndCrescent />
          </button>
        </Tooltip>

        {/* <Tooltip
          placement="right"
          title="Edit Custom Image / Text"
          color="geekblue"
          onClick={() => showDrawer("CustomImg")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <CiImageOff />
          </button>
        </Tooltip> */}
        <Tooltip
          placement="right"
          title="Edit Content / Text"
          color="geekblue"
          onClick={() => showDrawer("content")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <MdOutlineTextRotateVertical />
          </button>
        </Tooltip>
        <Tooltip
          placement="right"
          title="Edit Title "
          color="geekblue"
          onClick={() => showDrawer("title")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <CiText />
          </button>
        </Tooltip>
        <Tooltip placement="right" title="Download File" color="geekblue">
          <button
            className="btn p-0 sidebarIcon"
            disabled={loading}
            onClick={handleScreenShot}
          >
            <GoDesktopDownload />
          </button>
        </Tooltip>
      </aside>
    </>
  );
};
export default Sidebar;
