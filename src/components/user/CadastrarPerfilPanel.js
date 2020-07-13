import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Collapse, Container, FormControl, FormHelperText, Grid, IconButton, Input, InputLabel, 
    Paper, Select, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from "react-router-dom";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLefttIcon from '@material-ui/icons/KeyboardArrowLeft';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

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
  gridControl: {
    marginLeft: '5px',
    marginRight: '5px'
  },
  select: {
    height: '300px'
  },
  doubleArrowLeft: {
    transform: 'rotate(180deg)'
  },
  middlePane: {
    display: 'grid'
  },
  middlePaneItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

function getIndex(list, value) {
  if (list && (list.length > 0)) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === value) {
        return i;
      }
    }
  }
  return -1;
}

let pageLoaded = false;

export default function CriarPerfilPanel() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [msgErro, setMsgErro] = React.useState('');
  const [painelDisponiveis, setPainelDisponiveis] = React.useState([]);
  const [painelSelecionadas, setPainelSelecionadas] = React.useState([]);
  const [disponiveis, setDisponiveis] = React.useState([]);
  const [selecionadas, setSelecionadas] = React.useState([]);

  useEffect(() => {
    fetch("/api/funcionalidade",
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${localStorage.accessToken}`
      }
    }).then(res => res.json()).then((result) => {
      if (!pageLoaded) {
        setPainelDisponiveis(result);
        pageLoaded = true;
      }
    });
  }, [painelDisponiveis]);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/api/perfil/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({name: document.getElementById('name').value, funcionalidades: painelSelecionadas}),
      credentials: 'include'
    }).then(response => {
      if (response.ok && (response.status === 201)) {
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

  const handleFuncionalidadesDisponiveis = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setDisponiveis(value);
  }

  const handleFuncionalidadesSelecionadas = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelecionadas(value);
  }

  const handleSelecionaFuncionalidade = () => {
    const valueSelecionadas = (painelSelecionadas || []);
    const valueDisponiveis = (painelDisponiveis || []);
    if (disponiveis && (disponiveis.length > 0)) {
      for (let i = 0; i < disponiveis.length; i++) {
        const value = valueDisponiveis.splice(getIndex(valueDisponiveis, disponiveis[i]), 1);
        valueSelecionadas.push(value[0]);
      }
    }
    setDisponiveis([]);
    setSelecionadas([]);
    setPainelDisponiveis(valueDisponiveis);
    setPainelSelecionadas(valueSelecionadas);
  }

  const handleSelecionaTodasFuncionalidades = () => {
    const valueSelecionadas = (painelSelecionadas || []);
    if (painelDisponiveis && (painelDisponiveis.length > 0)) {
      for (let i = 0; i < painelDisponiveis.length; i++) {
        valueSelecionadas.push(painelDisponiveis[i]);
      }
    }
    setDisponiveis([]);
    setSelecionadas([]);
    setPainelDisponiveis([]);
    setPainelSelecionadas(valueSelecionadas);
  }

  const handleDeselecionaFuncionalidade = () => {
    const valueDisponiveis = (painelDisponiveis || []);
    const valueSelecionadas = (painelSelecionadas || []);
    if (selecionadas && (selecionadas.length > 0)) {
      for (let i = 0; i < selecionadas.length; i++) {
        const value = valueSelecionadas.splice(getIndex(valueSelecionadas, selecionadas[i]), 1);
        valueDisponiveis.push(value[0]);
      }
    }
    setDisponiveis([]);
    setSelecionadas([]);
    setPainelDisponiveis(valueDisponiveis);
    setPainelSelecionadas(valueSelecionadas);
  }

  const handleDeselecionaTodasFuncionalidades = () => {
    const valueDisponiveis = (painelDisponiveis || []);
    if (painelSelecionadas && (painelSelecionadas.length > 0)) {
      for (let i = 0; i < painelSelecionadas.length; i++) {
        valueDisponiveis.push(painelSelecionadas[i]);
      }
    }
    setDisponiveis([]);
    setSelecionadas([]);
    setPainelDisponiveis(valueDisponiveis);
    setPainelSelecionadas([]);
  }

  return (
    <Container className={classes.root} maxWidth="md">
      <form className={classes.root} noValidate autoComplete="off" action="/api/perfil/cadastrar" method="post" 
          onSubmit={handleSubmit} >
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
          </Grid>
        </Container>

        <Grid container className={classes.root} spacing={3}>
          <Grid item sm={12}>
            <Grid className={classes.gridControl} container direction="row" spacing={2}>
              <Grid item sm={5}>
                <Paper className={classes.paper}>
                  <Typography component="h5" variant="h6">Funcionalidades disponíveis:</Typography>
                </Paper>
                <FormControl className={classes.formControl} fullWidth >
                  <Select className={classes.select} multiple native onChange={handleFuncionalidadesDisponiveis}
                      value={disponiveis} inputProps={{id: 'select-multiple-disponiveis'}} >
                    {painelDisponiveis.map((funcionalidade, i) => (
                      <option key={i} value={funcionalidade.id}>{funcionalidade.name}</option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid className={classes.middlePane} item sm={2}>
                <Grid className={classes.middlePaneItem}>
                  <IconButton onClick={handleSelecionaFuncionalidade}>
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Grid>
                <Grid className={classes.middlePaneItem}>
                  <IconButton onClick={handleSelecionaTodasFuncionalidades}>
                    <DoubleArrowIcon />
                  </IconButton>
                </Grid>
                <Grid className={classes.middlePaneItem}>
                  <IconButton onClick={handleDeselecionaFuncionalidade}>
                    <KeyboardArrowLefttIcon />
                  </IconButton>
                </Grid>
                <Grid className={classes.middlePaneItem}>
                  <IconButton onClick={handleDeselecionaTodasFuncionalidades}>
                    <DoubleArrowIcon className={classes.doubleArrowLeft} />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid item sm={5}>
                <Paper className={classes.paper}>
                  <Typography component="h5" variant="h6">Funcionalidades selecionadas:</Typography>
                </Paper>
                <FormControl className={classes.formControl} fullWidth >
                  <Select className={classes.select} multiple native onChange={handleFuncionalidadesSelecionadas}
                      value={selecionadas} inputProps={{id: 'select-multiple-selecionadas'}} >
                    {painelSelecionadas.map((funcionalidade, i) => (
                      <option key={i} value={funcionalidade.id}>{funcionalidade.name}</option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Container maxWidth="sm">
          <Grid item xs={12} className={classes.paper} >
            <Button variant="outlined" color="primary" onClick={handleSubmit} type="submit">
              Ok
            </Button>
            <Button href="/criarPerfil" variant="outlined" color="secondary">
              Sair
            </Button>
          </Grid>
        </Container>
      </form>
    </Container>
  );
}
