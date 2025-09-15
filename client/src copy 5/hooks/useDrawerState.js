import { useState } from "react";

export default function useDrawerState() {
  const [open, setOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null);

  const showDrawer = (mode) => {
    setOpen(true);
    setDrawerMode(mode);
  };

  const closeDrawer = () => {
    setOpen(false);
    setDrawerMode(null);
  };

  return { open, drawerMode, showDrawer, closeDrawer };
}
