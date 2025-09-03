// src/components/Sections.jsx
import { lazy } from "react";
const Poster = lazy(() => import("@components/setting/Poster"));
const PosterWrapper = lazy(() => import("@components/setting/PosterWrapper"));
const Map = lazy(() => import("@components/setting/Map"));
const Content = lazy(() => import("@components/setting/Content"));
const Message = lazy(() => import("@components/setting/Message"));
const Title = lazy(() => import("@components/setting/Title"));
const Address = lazy(() => import("@components/setting/Address"));
const Date = lazy(() => import("@components/setting/Date"));
const Coordinate = lazy(() => import("@components/setting/Coordinate"));

const Sections = ({
  drawerMode,
  styles,
  setStyles,
  fontFamilies,
  updateSectionStyle,
}) => {
  return (
    <>
      {drawerMode === "poster" ? (
        <Poster
          styles={styles}
          setStyles={setStyles}
          fontFamilies={fontFamilies}
        />
      ) : drawerMode === "posterWrapper" ? (
        <PosterWrapper
          styles={styles}
          setStyles={setStyles}
          fontFamilies={fontFamilies}
        />
      ) : drawerMode === "map" ? (
        <Map
          styles={styles}
          setStyles={setStyles}
          fontFamilies={fontFamilies}
        />
      ) : drawerMode === "content" ? (
        <Content
          styles={styles}
          setStyles={setStyles}
          fontFamilies={fontFamilies}
        />
      ) : drawerMode === "message" ? (
        <Message
          styles={styles}
          setStyles={(s) => updateSectionStyle("content.nodes.message", s)}
          fontFamilies={fontFamilies}
        />
      ) : drawerMode === "title" ? (
        <Title
          styles={styles}
          setStyles={(s) => updateSectionStyle("content.nodes.title", s)}
          fontFamilies={fontFamilies}
        />
      ) : drawerMode === "address" ? (
        <Address
          styles={styles}
          setStyles={(s) => updateSectionStyle("content.nodes.address", s)}
          fontFamilies={fontFamilies}
        />
      ) : drawerMode === "date" ? (
        <Date
          styles={styles}
          setStyles={(s) => updateSectionStyle("content.nodes.date", s)}
          fontFamilies={fontFamilies}
        />
      ) : drawerMode === "coordinate" ? (
        <Coordinate
          styles={styles}
          setStyles={(s) => updateSectionStyle("content.nodes.coordinate", s)}
          fontFamilies={fontFamilies}
        />
      ) : null}
    </>
  );
};

export default Sections;
