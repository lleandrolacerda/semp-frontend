import React, { useEffect } from 'react';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { Button, Container, FormControl, FormHelperText, Grid, Input, InputLabel, Paper, Select, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

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
  table: {
    minWidth: 700,
  },
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

function createCampoPerfis() {
  let items = [];
  for (let i = 0; i < camposPerfil.length; i++) {
    items.push(<option key={i} value={camposPerfil[i].tipo}>{camposPerfil[i].nome}</option>)
  }
  return items;
}

function createTable(perfis) {
  if (perfis && (perfis.length > 0)) {
    return (
      <TableBody>
        {perfis.map((row, i) => (
          <StyledTableRow key={i}>
            <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
            <StyledTableCell component="th" scope="row">Cell2</StyledTableCell>
            <StyledTableCell component="th" scope="row">Cell3</StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    );
  } else {
    return (
      <StyledTableRow><TableCell colSpan={3}><center>Nenhum Perfil cadastrado</center></TableCell></StyledTableRow>
    );
  }
}

export default function CriarPerfilPanel() {
  const classes = useStyles();
  const [perfis, setPerfil] = React.useState([]);

  useEffect(() => {
    fetch("/api/perfil",
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${localStorage.accessToken}`
      }
    }).then(res => res.json()).then((result) => {
      if (!pageLoaded) {
        setPerfil(result);
        pageLoaded = true;
      }
    });
  }, [perfis]);

  const handleFiltrarSubmit = e => {
console.log("Filtra perfil")
  };

  return (
    <Container className={classes.root} maxWidth="md">
      <form className={classes.root} noValidate autoComplete="off" actuion="#" method="post" onSubmit={handleFiltrarSubmit} >
        <Grid container className={classes.root} spacing={3}>
          <Grid item sm={12}>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h5" gutterBottom>Perfis</Typography>
            </Paper>
            <Grid className={classes.gridControl} container direction="row" sm={12} spacing={2}>
              <Grid item sm={3}>
                <FormControl className={classes.formControl} fullWidth >
                  <InputLabel htmlFor="name">Campo</InputLabel>
                  <Select label="Campo filtro" placceholder="Campo">
                    {createCampoPerfis()}
                  </Select>
                  <FormHelperText id="nome-helper-text">Campo filtro</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={7}>
                <FormControl className={classes.formControl} fullWidth >
                  <InputLabel htmlFor="filtro"></InputLabel>
                  <Input name="filtro" aria-describedby="filtro-helper-text" />
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
            { createTable(perfis) }
          </TableHead>
        </Table>
      </TableContainer>
      <Grid container item sm={12} justify="flex-end" >
            <Button variant="outlined" color="primary" onClick={handleFiltrarSubmit} type="submit" >
              Cadastrar Perfil
            </Button>
      </Grid>
    </Container>
  )
}
