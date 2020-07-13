import React from 'react';
import { withStyles, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
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

    const handleAcao=(e, index) =>{
        console.log('>>>acao<<<', index, rows[index] );
        if( rows[index].situacao === 'ativo'){
            history.replace("/revogarAcesso/"+ rows[index].id);
        }
    }
    function getTituloSituacao(row){
        if( row.situacao === 'ativo') return "Revogar";
        return "Ativar";
    }
    function formataData(data){
        var dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
        return diaF+"/"+mesF+"/"+anoF;
    }
    return (
        <div>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell width='200px'>Nome</StyledTableCell>
                        <StyledTableCell>Usuário</StyledTableCell>
                        <StyledTableCell>Tipo</StyledTableCell>
                        <StyledTableCell>Data da ultima atualização</StyledTableCell>
                        <StyledTableCell>Perfil</StyledTableCell>
                        <StyledTableCell>Situação</StyledTableCell>
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
                            <StyledTableCell >{row.provider}</StyledTableCell>
                            <StyledTableCell >{ formataData(new Date(row.dataAtualizacao) ) }</StyledTableCell>
                            <StyledTableCell >{row.perfil}</StyledTableCell>
                            <StyledTableCell >{row.situacao}</StyledTableCell>
                            <TableCell>

                                <Box>
                                    
                                    <Button variant="outlined" color="primary" onClick={ (e) => handleAcao(e,i) }>
                                        { getTituloSituacao(row) }
                                    </Button>
                            
                                    
                                    {/* <IconButton onClick={ (e) => handleAcao(e,i) }>
                                        <AttachFileIcon />
                                    </IconButton>
                                    <IconButton>
                                        <DeleteIcon />
                                    </IconButton> */}
                                </Box>

                            </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            
        </TableContainer>
        
        </div>
    );
}
