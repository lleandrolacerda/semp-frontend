import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LoginModal from "../../LoginModal";
import SolicitarAcessoForm from "../SolicitarAcessoForm";


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

export default function Anonimo() {

  const classes = useStyles();
  const [openLogin, setOpenLogin] = React.useState(false);

  const handleLogin = () => {
    setOpenLogin(!openLogin);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Bem vindo ao sistema PRODF-SEMP
      </Typography>
      <Typography variant="body1" gutterBottom>
        Aqui poderá solicitar <a href="/home/solicitarAcesso">acesso para fazer solicitações</a>, 
        se ja tiver um acesso ao sistema poderá <a href="#" onClick={handleLogin}>logar</a> e acompanhar suas solicitações
      </Typography>
      
      <LoginModal open={openLogin} onchange={handleLogin}/>
    </div>
  );
}
