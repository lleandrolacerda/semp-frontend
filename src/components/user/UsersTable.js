import React from 'react';
import { withStyles, createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import UpdateIcon from '@material-ui/icons/Update';
import { useHistory } from "react-router-dom";

const StyledTableCell = withStyles((theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);
const StyledTableRow = withStyles((theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function UsersTable(props) {
  const classes = useStyles();
  const {rows} = props;

  const history = useHistory();

  const handleSituacaoAcao=(e, index) => {
    console.log('>>>acao<<<', index, rows[index] );
    if( rows[index].situacao === 'ativo'){
        history.replace("/revogarAcesso/"+ rows[index].id);
    }
  }

  const handleTrocarPerfil=(e, index) => {
    console.log("Trocar Perfil", e, index);
  }

  function getTituloSituacao(row) {
    return (row.situacao === 'ativo') ? "Revogar" : "Ativar";
  }

  function formataData(data) {
    var dia  = data.getDate().toString(),
    diaF = (dia.length == 1) ? '0'+dia : dia,
    mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length == 1) ? '0'+mes : mes,
    anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell width='200px'>Nome</StyledTableCell>
            <StyledTableCell>Usuário</StyledTableCell>
            <StyledTableCell>Tipo</StyledTableCell>
            <StyledTableCell>Data da ultima atualização</StyledTableCell>
            <StyledTableCell>Perfil</StyledTableCell>
            <StyledTableCell>Situação do acesso</StyledTableCell>
            <StyledTableCell width='100px' align="center">Ação</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell >{row.login}</StyledTableCell>
              <StyledTableCell >{(row.usuarioExterno ? 'Externo' : 'Interno')}</StyledTableCell>
              <StyledTableCell >{ formataData(new Date(row.dataAtualizacao) ) }</StyledTableCell>
              <StyledTableCell >{row.perfil}</StyledTableCell>
              <StyledTableCell >{row.situacao}</StyledTableCell>
              <TableCell>
                <Tooltip title={getTituloSituacao(row)}>
                  <IconButton onClick={ (e) => handleSituacaoAcao(e, i) }>
                  {
                    (row.situacao === 'ativo') ? <PersonAddDisabledIcon /> : <PersonAddIcon />
                  }
                  </IconButton>
                </Tooltip>
                <Tooltip title="Trocar perfil">
                  <IconButton onClick={ (e) => handleTrocarPerfil(e, i) }><UpdateIcon /></IconButton>
                </Tooltip>
              </TableCell>
            </StyledTableRow>
        ))}
        </TableBody>
      </Table>

    </TableContainer>
  );
}
