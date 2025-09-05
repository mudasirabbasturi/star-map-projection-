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
  content,
  onChangeContent,
  globalContentStyle, // Added prop for global content style
}) => {
  // For node settings, merge global and node styles for display
  const getMergedNodeStyles = (nodeKey) => {
    if (!globalContentStyle || !styles) return styles;

    return {
      ...globalContentStyle.nodes[nodeKey],
      ...styles,
    };
  };

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
          content={content}
          onChangeContent={onChangeContent}
          styles={styles}
          setStyles={setStyles}
          fontFamilies={fontFamilies}
        />
      ) : drawerMode === "message" ? (
        <Message
          content={content}
          onChangeContent={onChangeContent}
          styles={getMergedNodeStyles("message")}
          setStyles={(s) => updateSectionStyle("content.nodes.message", s)}
          fontFamilies={fontFamilies}
          globalStyle={globalContentStyle}
        />
      ) : drawerMode === "title" ? (
        <Title
          content={content}
          onChangeContent={onChangeContent}
          styles={getMergedNodeStyles("title")}
          setStyles={(s) => updateSectionStyle("content.nodes.title", s)}
          fontFamilies={fontFamilies}
          globalStyle={globalContentStyle}
        />
      ) : drawerMode === "address" ? (
        <Address
          content={content}
          onChangeContent={onChangeContent}
          styles={getMergedNodeStyles("address")}
          setStyles={(s) => updateSectionStyle("content.nodes.address", s)}
          fontFamilies={fontFamilies}
          globalStyle={globalContentStyle}
        />
      ) : drawerMode === "date" ? (
        <Date
          content={content}
          onChangeContent={onChangeContent}
          styles={getMergedNodeStyles("date")}
          setStyles={(s) => updateSectionStyle("content.nodes.date", s)}
          fontFamilies={fontFamilies}
          globalStyle={globalContentStyle}
        />
      ) : drawerMode === "coordinate" ? (
        <Coordinate
          content={content}
          onChangeContent={onChangeContent}
          styles={getMergedNodeStyles("coordinate")}
          setStyles={(s) => updateSectionStyle("content.nodes.coordinate", s)}
          fontFamilies={fontFamilies}
          globalStyle={globalContentStyle}
        />
      ) : null}
    </>
  );
};

export default Sections;
