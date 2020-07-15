import React, { useEffect } from 'react';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, Button, Container, Collapse, FormControl, FormHelperText, Grid, IconButton, Input, InputLabel, MenuItem, Paper, 
    Select, Typography, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Tooltip } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
    textAlign: 'center'
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

const camposFuncionalidade = [ {'nome': '--', 'tipo': '' }, {'nome': 'Nome', 'tipo': 'name' }];

let pageLoaded = false;

function handleAtualizarFuncionalidade(event, i) {
  console.log("Atualizar Funcionalidade: ", i, event);
}

function handleVisualizarFuncionalidade(event, i) {
  console.log("Visualizar Funcionalidade: ", i, event);
}

export default function CriarFuncionalidadePanel() {
  const classes = useStyles();
  const [funcionalidades, setFuncionalidade] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [msgErro, setMsgErro] = React.useState('');
  const [campo, setCampo] = React.useState('');

  const handleChangeCampo = event => {
    setCampo(event.target.value);
  } 

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
        setFuncionalidade(result);
        pageLoaded = true;
      }
    });
  }, [funcionalidades]);

  const handleFiltrarSubmit = event => {
    event.preventDefault();
    let endpoint = '/api/funcionalidade/filtrar';
    const filtro = document.getElementById('filtro').value;
    if (!filtro || !campo) {
      endpoint = '/api/funcionalidade';
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
      if (response.ok && (response.status === 200)) {
        response.json().then((result) => {
          setFuncionalidade(result);
        });
      } else {
        response.json().then((error) => {
          setOpen(true);
          setMsgErro((error && error.message) || 'Oops! Something went wrong. Please try again!' );
        });
      }
    }).catch(error => {
      setOpen(true);
      setMsgErro( (error && error.message) || 'Oops! Something went wrong. Please try again!' );
      console.log(">>ERRO<<", error);
    });
  };

  const handleExcluirFuncionalidade = (event, funcionalidade) => {
    fetch('/api/funcionalidade/' + funcionalidade.id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      credentials: 'include'
    }).then(response => {
      if (response.ok && (response.status === 202)) {
        const value = [];
        if (funcionalidades && (funcionalidades.length > 0)) {
          for (let i = 0; i < funcionalidades.length; i++) {
            if (funcionalidades[i].id !== funcionalidade.id) {
              value.push(funcionalidades[i]);
            }
          }
        }
        setFuncionalidade(value);
      } else {
        response.json().then((error) => {
          setOpen(true);
          setMsgErro((error && error.message) || 'Oops! Something went wrong. Please try again!' );
        });
      }
    }).catch(error => {
      setOpen(true);
      setMsgErro( (error && error.message) || 'Oops! Something went wrong. Please try again!' );
      console.log(">>ERRO<<", error);
    });
  }

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
      <form className={classes.root} noValidate autoComplete="off" actuion="#" method="post" onSubmit={handleFiltrarSubmit} >
        <Grid container className={classes.root} spacing={3}>
          <Grid item sm={12}>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h5" gutterBottom>Funcionalidades</Typography>
            </Paper>
            <Grid className={classes.gridControl} container direction="row" spacing={2}>
              <Grid item sm={3}>
                <FormControl className={classes.formControl} fullWidth >
                  <InputLabel htmlFor="name">Campo</InputLabel>
                  <Select label="Campo filtro" placceholder="Campo" onChange={handleChangeCampo} defaultValue={''} >
                    {
                      camposFuncionalidade.map((campo, i) => (
                        <MenuItem key={i} value={camposFuncionalidade[i].tipo}>{camposFuncionalidade[i].nome}</MenuItem>
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
              <StyledTableCell>Nome da Funcionalidade</StyledTableCell>
              <StyledTableCell>Endereço de funcionalidades</StyledTableCell>
              <StyledTableCell>Ação</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { ((funcionalidades && (funcionalidades.length > 0)) ? funcionalidades.map((row, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell component="td" scope="col">{ row.name }</StyledTableCell>
                <StyledTableCell component="td" scope="col">{ row.endereco }</StyledTableCell>
                <StyledTableCell component="td" scope="col">
                  <Box>
                    <Tooltip title="Remover funcionalidade">
                      <IconButton onClick={ (event) => handleExcluirFuncionalidade(event, row)}><DeleteIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Atualizar funcionalidade">
                      <IconButton onClick={ (event) => handleAtualizarFuncionalidade(event, i)}><UpdateIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Visualizar funcionalidade">
                      <IconButton onClick={ (event) => handleVisualizarFuncionalidade(event, i)}><VisibilityIcon /></IconButton>
                    </Tooltip>
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
              )) :
              (<StyledTableRow><TableCell colSpan={3}><center>Nenhuma Funcionalidade cadastrada</center></TableCell></StyledTableRow>)) 
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container item sm={12} justify="flex-end" >
        <Button variant="outlined" color="primary" href="/CadastrarFuncionalidade">
          Cadastrar Funcionalidade
        </Button>
      </Grid>
    </Container>
  )
}
