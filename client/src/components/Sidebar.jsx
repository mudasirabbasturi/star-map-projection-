import { LuRectangleVertical } from "react-icons/lu";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { GiOrbital } from "react-icons/gi";
import { MdOutlineTextRotateVertical } from "react-icons/md";
import { CiFolderOff } from "react-icons/ci";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { CiImport } from "react-icons/ci";
import { CiExport } from "react-icons/ci";
import { Tooltip } from "antd";

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
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <HiOutlineRectangleGroup />
          </button>
        </Tooltip>
        <Tooltip
          placement="right"
          title="Edit Map / Mask Shape"
          color="geekblue"
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <GiOrbital />
          </button>
        </Tooltip>

        <Tooltip
          placement="right"
          title="Edit Content / Text"
          color="geekblue"
          onClick={() => showDrawer("showImportFiles")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <MdOutlineTextRotateVertical />
          </button>
        </Tooltip>

        <Tooltip
          placement="right"
          title="View Download Files"
          color="geekblue"
          onClick={() => showDrawer("showDownloadFiles")}
        >
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <CiFolderOff />
          </button>
        </Tooltip>
        <Tooltip placement="right" title="Import Style" color="geekblue">
          <button className="btn p-0 sidebarIcon" disabled={loading}>
            <label htmlFor="importFile">
              <CiImport />
            </label>
          </button>
          <input
            type="file"
            accept="application/json"
            style={{
              visibility: "hidden",
              position: "absolute",
              width: 0,
              height: 0,
              margin: 0,
              padding: 0,
            }}
            id="importFile"
            onChange={handleImport}
          />
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
            <LiaFileDownloadSolid />
          </button>
        </Tooltip>
      </aside>
    </>
  );
};
export default Sidebar;
