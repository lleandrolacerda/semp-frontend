import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LoginModal from "../../LoginModal";
import SolicitarAcessoForm from "../SolicitarAcessoForm";
import SignIn from '../../SignIn';
import Paper from '@material-ui/core/Paper';


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
  const [openLogin, setOpenLogin] = React.useState(false);

  const handleLogin = () => {
    setOpenLogin(!openLogin);
  };

  return (
    <div className={classes.root}>
      <SignIn />
    </div>
  );
}
