import React, { useContext } from "react";
import { Slider } from "@material-ui/core";
import { GraphContext } from "./GraphContext";
import ACTIONS from "../Actions";

export const VerticalControlGroup = () => {
  const { state, dispatch } = useContext(GraphContext);
  return (
    <div className="vertical-control-group">
      {[...Array(5).keys()].map((value) => {
        return (
          <Slider
            max={1}
            step={0.001}
            key={value}
            style={{
              gridColumn: value + 2,
              gridRow: 1,
              margin: "auto",
            }}
            orientation="vertical"
            value={state.control[value]}
            onChange={(_, v) => {
              dispatch({
                type: ACTIONS.UPDATE_DIST,
                payload: { index: value, value: v },
              });
            }}
          />
        );
      })}
    </div>
  );
};
