import React, { useContext } from "react";
import GridMarker from "./GridMarker";
import { GraphContext } from "./GraphContext";

const offset = { x: 0.1, y: 0.1 };
const step = { x: 0.1, y: 0.1 };
const nodeRadius = 0.03;

export const InnerGraphView = React.memo(({ graph }) => {
  const indexToPosition = ([y, x]) => [
    offset.y + y * step.y,
    offset.x + x * step.x,
  ];
  const grid = graph
    .getDomainList()
    .map((index) => indexToPosition(graph.domain.revHash(index)));

  const edges = graph
    .getEdgeList()
    .map(([v0, v1]) => [indexToPosition(v0), indexToPosition(v1)]);

  //Show upto 5 components containing more than 4 vertices
  const components = graph
    .getComponents()
    .sort((c0, c1) => c1.length - c0.length)
    .filter((c) => c.length > 4)
    .slice(0, 5);

  const vertexCompomentMap = new Map(
    components.map((c, i) => c.map((v) => [v, i])).flat()
  );

  const nodes = graph.getVertexList().map((vertex) => ({
    pos: indexToPosition(graph.domain.revHash(vertex)),
    label: vertexCompomentMap.get(vertex) ?? -1,
  }));

  return (
    <div className="svg-grid">
      <svg width="100%" height="100%" viewBox="0 0 1.1 1.1">
        {
          //Grid markers
          nodes.length === 0 &&
            grid.map(([y, x], index) => <GridMarker key={index} y={y} x={x} />)
        }
        {
          //Grid edges
          edges.map(([v0, v1], index) => {
            return (
              <line
                className="edge-line"
                key={index}
                x1={v0[1]}
                x2={v1[1]}
                y1={v0[0]}
                y2={v1[0]}
                strokeWidth={0.025}
              />
            );
          })
        }
        {
          //Grid vertices
          nodes.map(({ pos: [y, x], label }, index) => {
            return (
              <circle
                className={`graph-node label-${label + 1}`}
                key={index}
                cx={x}
                cy={y}
                r={nodeRadius}
              />
            );
          })
        }
      </svg>
    </div>
  );
});

export const GraphView = () => {
  const { state } = useContext(GraphContext);
  return <InnerGraphView graph={state.graph} />;
};
