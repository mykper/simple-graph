import React, { useReducer } from "react";
import "./App.css";
import { Typography, ThemeProvider, createMuiTheme } from "@material-ui/core";
import { Domain, GraphEntity } from "./GraphEntity";
import { GraphContext } from "./components/GraphContext";
import ACTIONS from "./Actions";
import ControlGroup from "./components/ControlGroup";
import { GraphView } from "./components/GraphView";
import { amber } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: amber[100],
    },
  },
  typography: {
    fontFamily: ["Teko", "sans-serif"],
  },
});

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_DIST: {
      const { index, value } = action.payload;
      let delta = value - state.control[index];
      let a = [...state.control];
      a[index] = 0;
      let sum = a.reduce((s, p) => s + p, 0);
      if (sum !== 0) {
        a = a.map((p) => p * (1 - delta / sum));
        a[index] = value;
      } else {
        a = a.map((x) => -delta / 4);
        a[index] = value;
      }
      return { ...state, control: a };
    }
    case ACTIONS.CREATE_GRAPH: {
      const graph = new GraphEntity(state.graph.domain, state.graph.pattern);
      graph.construct(state.control);
      return { ...state, graph: graph };
    }
    default:
      return state;
  }
}

function App() {
  function init() {
    const domain = new Domain(10);
    [...Array(4).keys()].forEach((y) => {
      [...Array(4).keys()].forEach((x) => {
        const index = domain.hash([y + 3, x + 3]);
        if (domain.set.has(index)) {
          domain.set.delete(index);
        }
      });
    });

    const pattern = [
      [0, -1],
      [-1, 0],
      [0, 1],
      [1, 0],
    ];

    const dist = [0.0, 0.2, 0.5, 0.25, 0.05];

    return { graph: new GraphEntity(domain, pattern), control: dist };
  }

  const [state, dispatch] = useReducer(reducer, undefined, init);

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <div className="column">
          <div className="container">
            <GraphContext.Provider value={{ state, dispatch }}>
              <GraphView />
              <div className="logo">
                <Typography variant="h1">SG</Typography>
              </div>
              <ControlGroup />
            </GraphContext.Provider>
          </div>
          <footer>
            <Typography className="copy" variant="body1">
              © 2020 mykper
            </Typography>
          </footer>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
