import React, {useState, useEffect} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {Container, Backdrop, CircularProgress} from '@material-ui/core';
import { useCurrentUser } from "../server/UseCurrentUser";
import Anonimo from "./user/home/Anonimo";
import SolicitarAcessoForm from "./user/SolicitarAcessoForm";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
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

function Topic() {
  let { topicId } = useParams();
  return <h3>Requested topic ID: {topicId}</h3>;
}

function TesteInfo(){

  useEffect(()=>{
   if( !info){
    fetch("/api/info")
    .then(res => res.json())
    .then(
      (result) => {
        // const ret = JSON.stringify(result) ;
        console.log( result.cadGastoFixo );
        setInfo(result.cadGastoFixo);
      },
      (error) => {
        console.log( error );
      }
    )
   } 
  });
  

  const [info, setInfo] = useState();
  return(
    <div>
      <h3>Dados do backend</h3>
      { 
      info && <div>
          <p><b>Titulo:</b> {info.titulo}</p>
          <p><b>Descricao:</b> {info.descricao}</p>
          </div>
      }
    </div>
  )
}

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
        <Route path={`${match.path}/solicitarAcesso`}>
          <SolicitarAcessoForm />
        </Route>
        <Route path={`${match.path}/testeInfo`}>
          <TesteInfo />
        </Route>
        
        <Route path={match.path}>
          {
            !user && <Anonimo/>
          }
        </Route>
      </Switch>
    </Container>
    )
  }

export default Home;
