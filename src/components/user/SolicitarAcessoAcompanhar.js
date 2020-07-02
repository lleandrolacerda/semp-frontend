import React, {useState} from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
      width: '100%',
    },
    paper: {
      padding: theme.spacing(2),
      // textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      width: '50%',
      justifyContent: 'center',
      alignItems: 'center'

    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },

  }),
);
export default function SolicitarAcessoAcompanhar() {
    const classes = useStyles();
    let { id } = useParams();
    return (
        <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography variant="subtitle1" gutterBottom>
                    F01 – Solicitar acesso (Apenas para usuários externos)
                    Funcionalidade para permitir que empresários solicitem acesso, preenchendo formulário e enviando documentação necessária para as devidas comprovações.
                </Typography>
                <center><h2>Acopanhar Solicitação não implementado</h2></center>
                <h3>id: {id}</h3>
                  
                </Paper>
              </Grid>

            </Grid>
    )

}