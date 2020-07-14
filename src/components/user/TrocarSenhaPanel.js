import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Collapse, Container, FormControl, FormHelperText, Grid, IconButton, Input, InputLabel, Typography } 
    from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from "react-router-dom";
import { useCurrentUser } from "../../server/UseCurrentUser";

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

export default function TrocarSenhaPanel() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [msgErro, setMsgErro] = React.useState('');
  let [user] = useCurrentUser();

  const handleAlteraNovaSenha = (event) => {
    if (!document.getElementById('nova').value || !document.getElementById('confirmar').value) {
      setOpen(false);
      setMsgErro("");
    } else {
      if (event.target.value === document.getElementById('confirmar').value) {
        setOpen(false);
        setMsgErro("");
      } else {
        setOpen(true);
        setMsgErro("As senhas novas não coincidem.");
      }
    }
  }

  const handleAlteraConfirmacao = (event) => {
    if (!document.getElementById('nova').value || !document.getElementById('confirmar').value) {
      setOpen(false);
      setMsgErro("");
    } else {
      if (event.target.value === document.getElementById('nova').value) {
        setOpen(false);
        setMsgErro("");
      } else {
        setOpen(true);
        setMsgErro("As senhas novas não coincidem.");
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (document.getElementById('atual').value && document.getElementById('nova').value && 
        document.getElementById('confirmar').value && 
        (document.getElementById('nova').value === document.getElementById('confirmar').value)) {
      fetch('/api/trocarsenha', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.accessToken}`
        },
        body: JSON.stringify({
          id: user.id,
          antiga: document.getElementById('atual').value,
          nova: document.getElementById('nova').value
        }),
        credentials: 'include'
      }).then(response => {
        if (response.ok && (response.status === 202)) {
          history.push('/home');
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
    } else {
      setMsgErro("Todos os campos são obrigatórios e a nova senha deve coincidir com sua confirmação");
      setOpen(true);
    }
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

      <form className={classes.root} noValidate autoComplete="off" action="/api/trocarsenha" method="post" onSubmit={handleSubmit} >
        <Grid container className={classes.root} spacing={3}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              <center>Trocar Senha</center>
            </Typography>
            <Typography component="h5" variant="h6">
              <center>A troca da senha é exclusiva para usuários externos a SDE e a SEMP.</center>
            </Typography>
            <FormControl fullWidth >
              <InputLabel htmlFor="atual">Senha atual</InputLabel>
              <Input id="atual" name="atual" type="password" aria-describedby="atual-helper-text" />
              <FormHelperText id="atual-helper-text">Senha Atual</FormHelperText>
            </FormControl>
            <FormControl fullWidth >
              <InputLabel htmlFor="nova">Nova senha</InputLabel>
              <Input id="nova" name="nova" type="password" aria-describedby="nova-helper-text" onChange={handleAlteraNovaSenha} />
              <FormHelperText id="nova-helper-text">Nova senha</FormHelperText>
            </FormControl>
            <FormControl fullWidth >
              <InputLabel htmlFor="confirmar">Confirmar nova senha</InputLabel>
              <Input id="confirmar" name="confirmar" type="password" aria-describedby="confirmar-helper-text" onChange={handleAlteraConfirmacao} />
              <FormHelperText id="confirmar-helper-text">Confirmar nova senha</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} className={classes.paper} >
            <Button variant="outlined" color="primary" onClick={handleSubmit} type="submit">
              Ok
            </Button>
            <Button href="/home" variant="outlined" color="secondary">
              Sair
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
