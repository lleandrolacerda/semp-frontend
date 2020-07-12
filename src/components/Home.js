import React, {useState} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {Container, Backdrop, CircularProgress} from '@material-ui/core';
import { useCurrentUser } from "../server/UseCurrentUser";

import SolicitarAcessoForm from "./user/SolicitarAcessoForm";
import SolicitarAcessoAcompanhar from "./user/SolicitarAcessoAcompanhar";
import RecuperarSenhaForm from "./user/RecuperarSenhaForm";
import { Redirect } from 'react-router-dom';

import {
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      "margin-top": "15px"
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },

    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

function Home() {
    const [user, loading] = useCurrentUser();
    const classes = useStyles();
    const [wait, setWait] = useState(false);
    const match = useRouteMatch();

    function isPerfilAdm(){
      return user && user.perfis && user.perfis.find(item => item === 'fazenda');
    }

    return (
      <Container maxWidth='xl' className={classes.root}>
        { !loading &&
            user && <h2>Ola: {user.name}</h2>
        }
        <Backdrop className={classes.backdrop} open={loading || wait}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Switch>

          <Route path={`${match.path}/solicitarAcesso/:id`}>
            <SolicitarAcessoAcompanhar/>
          </Route>

          <Route path={`${match.path}/solicitarAcesso`}>
            <SolicitarAcessoForm />
          </Route>

          <Route path={`${match.path}/recuperarSenha`}>
            <RecuperarSenhaForm/>
          </Route>

          <Route path={match.path}>
            {
              !localStorage.accessToken && <Redirect to="/login" />
            }
          </Route>
        </Switch>
      </Container>
    )
  }

export default Home;
