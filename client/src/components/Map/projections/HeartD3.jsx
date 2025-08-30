import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const HeartD3 = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 300;
    const height = 300;
    // Generate heart points
    const points = [];
    for (let t = 0; t < Math.PI * 2; t += 0.01) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );
      points.push([x, y]);
    }

    // Create line generator
    const line = d3
      .line()
      .x((d) => d[0])
      .y((d) => d[1]);

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "-20 -20 40 40") // auto center & scale
      .style("background", "black");

    // Draw heart
    svg
      .append("path")
      .datum(points)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5);
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default HeartD3;
