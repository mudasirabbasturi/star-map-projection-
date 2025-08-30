import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Map = () => {
  const mapRef = useRef();

  useEffect(() => {
    const width = 800;
    const height = 800;

    // Projection
    const projection = d3
      .geoStereographic()
      .scale((width - 120) * 0.5)
      .translate([width / 2, height / 2])
      .rotate([0, -90])
      .precision(0.1);

    const path = d3.geoPath(projection);

    // Graticule & outline
    const graticule = d3.geoGraticule10();
    const outline = { type: "Sphere" };

    // Clear any previous content
    d3.select(mapRef.current).selectAll("*").remove();

    // SVG
    const svg = d3
      .select(mapRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("display", "block");

    // Draw graticule lines
    svg
      .append("path")
      .datum(graticule)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", path);

    // Outline (globe edge)
    svg
      .append("path")
      .datum(outline)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("d", path);

    // Add latitude labels (every 10°)
    const latitudes = d3.range(-80, 81, 10);
    const longitudes = [-90, 90]; // left & right sides

    const formatLatitude = (d) => `${d}°`;

    // For each lat, add labels on left/right edges
    latitudes.forEach((lat) => {
      longitudes.forEach((lon) => {
        const point = projection([lon, lat]);
        if (point) {
          svg
            .append("text")
            .attr("x", point[0] + (lon === 90 ? 6 : -6))
            .attr("y", point[1])
            .attr("dy", "0.35em")
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .attr("text-anchor", lon === 90 ? "start" : "end")
            .text(formatLatitude(lat));
        }
      });
    });
  }, []);

  return <svg ref={mapRef}></svg>;
};

export default Map;
