import React, { useEffect } from 'react';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, Button, Container, Collapse, FormControl, FormHelperText, Grid, IconButton, Input, InputLabel, Paper, 
    Select, Typography, Table, TableBody, TableContainer, TableHead, TableRow, TableCell } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import PageviewIcon from '@material-ui/icons/Pageview';

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
  gridControl: {
    marginLeft: '5px',
    marginRight: '5px'
  },
  gridButton: {
    alignItems: 'center',
    display: 'flex'
  }
}));

const StyledTableCell = withStyles((theme) => createStyles({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => createStyles({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    }
  }
}))(TableRow);

const camposPerfil = [ {'nome': '--', 'tipo': '' }, {'nome': 'Nome do perfil', 'tipo': 'name' }];

let pageLoaded = false;

function createTable(perfis) {
  if (perfis && (perfis.length > 0)) {
    return (
      <TableBody>
        {perfis.map((row, i) => (
          <StyledTableRow key={i}>
            <StyledTableCell component="td" scope="col">{ row.name }</StyledTableCell>
            <StyledTableCell component="td" scope="col">Cell2</StyledTableCell>
            <StyledTableCell component="td" scope="col">
              <Box>
                <IconButton onClick={ (event) => handleExcluirPerfil(event, i)}><DeleteIcon /></IconButton>
                <IconButton onClick={ (event) => handleAtualizarPerfil(event, i)}><UpdateIcon /></IconButton>
                <IconButton onClick={ (event) => handleVisualizarPerfil(event, i)}><PageviewIcon /></IconButton>
              </Box>
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    );
  } else {
    return (
      <TableBody>
        <StyledTableRow><TableCell colSpan={3}><center>Nenhum Perfil cadastrado</center></TableCell></StyledTableRow>
      </TableBody>
    );
  }
}

function handleExcluirPerfil(event, i) {
console.log("Excluir Perfil: ", i, event);
}

function handleAtualizarPerfil(event, i) {
console.log("Atualizar Perfil: ", i, event);
}

function handleVisualizarPerfil(event, i) {
console.log("Visualizar Perfil: ", i, event);
}

export default function CriarPerfilPanel() {
  const classes = useStyles();
  const [perfis, setPerfil] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [msgErro, setMsgErro] = React.useState('');
  const [campo, setCampo] = React.useState('');

  const handleChangeCampo = event => {
    setCampo(event.target.value);
  } 

  useEffect(() => {
    fetch("/api/perfil",
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    }).then(res => res.json()).then((result) => {
      if (!pageLoaded) {
        setPerfil(result);
        pageLoaded = true;
      }
    });
  }, [perfis]);

  const handleFiltrarSubmit = event => {
    event.preventDefault();
    let endpoint = '/api/perfil/filtrar';
    const filtro = document.getElementById('filtro').value;
    if (!filtro || !campo) {
      endpoint = '/api/perfil';
    } else {
      endpoint = endpoint + '/' + campo + '/' + filtro;
    }

    fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      credentials: 'include'
    }).then(response => {
      if (response.ok && (response.status == 200)) {
        response.json().then((result) => {
          setPerfil(result);
        });
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
  };
console.log("Campo: " + campo);
  return (
    <Container className={classes.root} maxWidth="md">
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

      <form className={classes.root} noValidate autoComplete="off" action="/api/perfil/filtrar" method="get" onSubmit={handleFiltrarSubmit} >
        <Grid container className={classes.root} spacing={3}>
          <Grid item sm={12}>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h5" gutterBottom>Perfis</Typography>
            </Paper>
            <Grid className={classes.gridControl} container direction="row" spacing={2}>
              <Grid item sm={3}>
                <FormControl className={classes.formControl} fullWidth >
                  <InputLabel htmlFor="name">Campo</InputLabel>
                  <Select label="Campo filtro" placceholder="Campo" onChange={handleChangeCampo} defaultValue={''} >
                    {
                      camposPerfil.map((campo, i) => (
                        <option key={i} value={camposPerfil[i].tipo}>{camposPerfil[i].nome}</option>
                      ))
                    }
                  </Select>
                  <FormHelperText id="nome-helper-text">Campo filtro</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={7}>
                <FormControl className={classes.formControl} fullWidth >
                  <InputLabel htmlFor="filtro"></InputLabel>
                  <Input id="filtro" name="filtro" aria-describedby="filtro-helper-text" />
                  <FormHelperText id="filtro-helper-text"></FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={2} className={classes.gridButton} >&nbsp;&nbsp;&nbsp;&nbsp;
                <Button variant="outlined" color="primary" onClick={handleFiltrarSubmit} type="submit">
                  Ok
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Nome do Perfil</StyledTableCell>
              <StyledTableCell>Qtde de funcionalidades</StyledTableCell>
              <StyledTableCell>Ação</StyledTableCell>
            </TableRow>
          </TableHead>
          { createTable(perfis) }
        </Table>
      </TableContainer>
      <Grid container item sm={12} justify="flex-end" >
        <Button variant="outlined" color="primary" href="/CadastrarPerfil">
          Cadastrar Perfil
        </Button>
      </Grid>
    </Container>
  )
}
