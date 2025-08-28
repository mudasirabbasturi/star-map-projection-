import { Button, Tooltip } from "antd";
import { CiUndo } from "react-icons/ci";
import { FaDownload, FaRegFilePdf, FaRegFileImage } from "react-icons/fa";
import { FaFileImport } from "react-icons/fa6";
import { SiPlaycanvas, SiStyledcomponents } from "react-icons/si";
import { IoTextOutline } from "react-icons/io5";

const Sidebar = ({ loading, handleScreenshot, showDrawer }) => {
  return (
    <>
      <div className="sidebar">
        <Tooltip placement="right" title="Manage Canvas" color="purple">
          <Button
            style={{ marginBottom: "4px" }}
            color="purple"
            variant="solid"
            icon={<SiPlaycanvas />}
            disabled={loading}
            onClick={() => showDrawer("canvas")}
          />
        </Tooltip>
        <Tooltip placement="right" title="Poster Map" color="purple">
          <Button
            style={{ marginBottom: "4px" }}
            color="purple"
            variant="solid"
            icon={<SiStyledcomponents />}
            disabled={loading}
            onClick={() => showDrawer("map")}
          />
        </Tooltip>
        <Tooltip placement="right" title="Moment & Text Manager" color="purple">
          <Button
            style={{ marginBottom: "4px" }}
            color="purple"
            variant="solid"
            icon={<IoTextOutline />}
            disabled={loading}
            onClick={() => showDrawer("moment")}
          />
        </Tooltip>
        <Tooltip placement="right" title="Use Save Style" color="purple">
          <Button
            style={{ marginBottom: "4px" }}
            color="purple"
            variant="solid"
            icon={<FaFileImport />}
            disabled={loading}
            onClick={() => showDrawer("saveStyle")}
          />
        </Tooltip>

        <Button
          style={{ marginBottom: "4px" }}
          color="purple"
          variant="solid"
          icon={<FaDownload />}
          onClick={handleScreenshot}
          disabled={loading}
        />
        <Button
          style={{ marginBottom: "4px" }}
          color="purple"
          variant="solid"
          icon={<FaRegFileImage />}
          disabled={loading}
        />
        <Button
          style={{ marginBottom: "4px" }}
          color="purple"
          variant="solid"
          icon={<FaRegFilePdf />}
          disabled={loading}
        />
        <Button
          style={{ marginBottom: "4px" }}
          color="purple"
          variant="solid"
          icon={<CiUndo />}
          disabled={loading}
        />
      </div>
    </>
  );
};
export default Sidebar;
