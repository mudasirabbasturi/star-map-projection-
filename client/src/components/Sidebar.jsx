import { LuRectangleVertical } from "react-icons/lu";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { GiOrbital } from "react-icons/gi";
import { MdOutlineTextRotateVertical } from "react-icons/md";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { GoDesktopDownload } from "react-icons/go";
import { AiFillFilePdf } from "react-icons/ai";
import { FaRegImage } from "react-icons/fa6";

import {
  CiImport,
  CiImageOff,
  CiExport,
  CiFolderOff,
  CiText,
} from "react-icons/ci";
import { Tooltip } from "antd";
import { BiHide } from "react-icons/bi";

const Sidebar = ({
  loading,
  showDrawer,
  handleScreenShot,
  handleExport,
  handleImport,
}) => {
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
            <GiOrbital />
          </button>
        </Tooltip>

        <Tooltip
          placement="right"
          title="Edit Custom Image / Text"
          color="geekblue"
          onClick={() => showDrawer("CustomImg")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <CiImageOff />
          </button>
        </Tooltip>
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
        {/* <Tooltip
          placement="right"
          title="View Downloaded jpeg,jgp,png Files"
          color="geekblue"
          onClick={() => showDrawer("showDownloadFiles")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <CiFolderOff />
          </button>
        </Tooltip>
        <Tooltip
          placement="right"
          title="View Downloaded Pdf Files"
          color="geekblue"
          onClick={() => showDrawer("showDownloadFiles")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <AiFillFilePdf />
          </button>
        </Tooltip> */}
        <Tooltip
          placement="right"
          title="View Downloaded jpeg,jpg,png Files"
          color="geekblue"
          onClick={() => showDrawer("showDownloadImageFiles")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <FaRegImage />
          </button>
        </Tooltip>

        <Tooltip
          placement="right"
          title="View Downloaded Pdf Files"
          color="geekblue"
          onClick={() => showDrawer("showDownloadPdfFiles")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <AiFillFilePdf />
          </button>
        </Tooltip>

        <Tooltip
          placement="right"
          title="Import Style"
          color="geekblue"
          onClick={() => showDrawer("showImportFiles")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <CiImport />
          </button>
        </Tooltip>
        <Tooltip placement="right" title="Export Style" color="geekblue">
          <button
            className="btn p-0 sidebarIcon"
            disabled={loading}
            onClick={handleExport}
          >
            <CiExport />
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
