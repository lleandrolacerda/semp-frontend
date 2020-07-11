import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Grid, Paper, FormControl, InputLabel, Input, FormHelperText, Select } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
    flexGrow: 1,
    width: '100%',
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    //color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const camposPerfil = [ {'nome': 'Nome do perfil', 'tipo': 'name' }];

let pageLoaded = false;

export default function CriarPerfilPanel() {
  const classes = useStyles();
  const [perfil, setPerfil] = React.useState({
    perfis: []
  });

  useEffect(() => {
    fetch("/api/perfil",
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${localStorage.accessToken}`
      }
    }).then(res => res.json()).then((result) => {
debugger;
      if (!pageLoaded) {
        setPerfil(result);
        pageLoaded = true;
      }
    });
  }, [perfil]);

  const handleFiltrarSubmit = e => {
console.log("Filtra perfil")
  };

  return (
    <Container  className={classes.root} maxWidth="md">
      <form className={classes.root} noValidate autoComplete="off" action="/api/perfil/filtrar" method="post" onSubmit={handleFiltrarSubmit} >
        <Grid container className={classes.root} spacing={3}>
          <Grid item sm={12}>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h5" gutterBottom>Perfis</Typography>
            </Paper>
            <Grid item sm={4}>
              <FormControl fullWidth >
                <InputLabel htmlFor="name">Campo</InputLabel>
                <Input name="name" aria-describedby="nome-helper-text" />
                <FormHelperText id="nome-helper-text">Campo do Filtro</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}
