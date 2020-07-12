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
    color: theme.palette.text.secondary,
  },
}));

export default function CriarFuncionalidadePanel() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [msgErro, setMsgErro] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/api/funcionalidade/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify(
          {
          name: document.getElementById('name').value,
          endereco: document.getElementById('endereco').value
          }
        ),
      credentials: 'include'
    }).then(response => {
      if (response.ok && (response.status == 202)) {
        history.push('/criarFuncionalidade');
      } else {
        response.json().then((error) => {
          setOpen(true);
          setMsgErro((error && error.message) || 'Oops! Something went wrong. Please try again!' );
        });
      }
    }).catch(error => {
      setOpen(true);
      setMsgErro( (error && error.message) || 'Oops! Something went wrong. Please try again!' );
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

      <form className={classes.root} noValidate autoComplete="off" action="/api/funcionalidade/cadastrar" method="post" onSubmit={handleSubmit} >
        <Grid container className={classes.root} spacing={3}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              Cadastrar funcionalidade
            </Typography>
            <FormControl fullWidth >
              <InputLabel htmlFor="name">Nome</InputLabel>
              <Input id="name" name="name" aria-describedby="nome-helper-text" />
              <FormHelperText id="nome-helper-text">Nome do funcionalidade</FormHelperText>
            </FormControl>
            <FormControl fullWidth >
              <InputLabel htmlFor="endereco">Endereço</InputLabel>
              <Input id="endereco" name="endereco" aria-describedby="nome-helper-text" />
              <FormHelperText id="nome-helper-text">Endereço do funcionalidade</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} className={classes.paper} >
            <Button variant="outlined" color="primary" onClick={handleSubmit} type="submit">
              Ok
            </Button>
            <Button href="/criarFuncionalidade" variant="outlined" color="secondary">
              Sair
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
