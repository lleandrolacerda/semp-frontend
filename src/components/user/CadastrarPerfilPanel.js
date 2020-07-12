import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Collapse, Container, FormControl, FormHelperText, Grid, IconButton, Input, InputLabel, Typography } 
    from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function CriarPerfilPanel() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [msgErro, setMsgErro] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/api/perfil/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({name: document.getElementById('name').value}),
      credentials: 'include'
    }).then(response => {
      if (response.ok && (response.status == 202)) {
        history.push('/criarPerfil');
      } else {
        response.json().then((error) => {
          setOpen(true);
          setMsgErro((error && error.message) || 'Oops! Something went wrong. Please try again!' );
        });
      }
      console.log(response);
    }).catch(error => {
      setOpen(true);
      setMsgErro( (error && error.message) || 'Oops! Something went wrong. Please try again!' );
      console.log(">>ERRO<<", error);
    });
  }

  return (
    <Container maxWidth="sm">
      <div className={classes.root}>
        <Collapse in={open}>
          <Alert
          action={
            <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
                setOpen(false);
            }}
            >
            <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          >
          {msgErro}
          </Alert>
        </Collapse>
      </div>

      <form className={classes.root} noValidate autoComplete="off" action="/api/perfil/cadastrar" method="post" onSubmit={handleSubmit} >
        <Grid container className={classes.root} spacing={3}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              Cadastrar perfil
            </Typography>
            <FormControl fullWidth >
              <InputLabel htmlFor="name">Nome</InputLabel>
              <Input id="name" name="name" aria-describedby="nome-helper-text" />
              <FormHelperText id="nome-helper-text">Nome do perfil</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} className={classes.paper} >
            <Button variant="outlined" color="primary" onClick={handleSubmit} type="submit">
              Ok
            </Button>
            <Button href="/criarPerfil" variant="outlined" color="secondary">
              Sair
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
