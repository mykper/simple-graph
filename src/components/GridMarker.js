import React from "react";

const markerRadius = 0.005;

const GridMarker = ({ y, x }) => {
  const r = (Math.random() * 90) | 0;
  return (
    <>
      <line
        className="marker-line"
        x1={x + markerRadius}
        x2={x - markerRadius}
        y1={y + markerRadius}
        y2={y - markerRadius}
        strokeWidth={0.0025}
        transform={`rotate(${r} ${x} ${y})`}
      />
      <line
        className="marker-line"
        x1={x + markerRadius}
        x2={x - markerRadius}
        y1={y - markerRadius}
        y2={y + markerRadius}
        strokeWidth={0.0025}
        transform={`rotate(${r} ${x} ${y})`}
      />
    </>
  );
};

export default GridMarker;
