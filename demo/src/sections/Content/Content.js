import React from "react";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import config from "config";

import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import Editor from "sections/Editor";
import Settings from "../Settings";

import DiffEditor from "sections/DiffEditor";

import classNames from "classnames";
import useStyles from "./useStyles";

const Content = _ => {
  const classes = useStyles();

  return (
    <Paper
      elevation={0}
      square={true}
      className={classNames("full-size", classes.root)}
    >
      <Settings />

      <div className={classes.editor}>
        <Typography variant="h4" className={classes.title}>
          Editor
        </Typography>
        <Divider />
        {/* <Editor /> */}
      </div>
      <div className={classes.diffEditor}>
        <Typography variant="h4" className={classes.title}>
          Diff Editor
        </Typography>
        <Divider />
        <TextField
          select
          variant="filled"
          // value={monacoTheme}
          onChange={ev => {
            console.log("changed!");
            console.log(this);
            console.log(ev);
          }}
          className="full-width"
          label="File"
          // label="Theme"
        >
          {config.monacoThemes2.map(theme => (
            <MenuItem key={theme} value={theme}>
              {theme}
            </MenuItem>
          ))}
        </TextField>
        <DiffEditor />
      </div>
    </Paper>
  );
};

export default Content;
