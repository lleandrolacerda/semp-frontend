import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SignIn from '../../SignIn';


const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

export default function Login() {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SignIn />
    </div>
  );
}
