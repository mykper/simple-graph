import React, { useContext } from "react";
import { Button, Typography, withStyles } from "@material-ui/core";
import { GraphContext } from "./GraphContext";
import ACTIONS from "../Actions";
import { VerticalControlGroup } from "./VerticalControlGroup";

const title = "simple-graph";

const StyledButton = withStyles({
  root: {
    borderRadius: 3,
    border: 0,
    height: "2rem",
    padding: "0 32px",
    fontSize: "1.5rem",
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);

function ControlGroup() {
  const { dispatch } = useContext(GraphContext);
  return (
    <div className="control-group">
      <Typography className="control-title" variant="h3">
        {title}
      </Typography>
      <VerticalControlGroup />
      <div>
        <StyledButton
          variant="contained"
          onClick={() =>
            dispatch({ type: ACTIONS.CREATE_GRAPH, payload: null })
          }
        >
          Create
        </StyledButton>
      </div>
    </div>
  );
}

export default ControlGroup;
