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
import { FormataData } from '../../constants/';

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
        width: '100%',
    },
});

export default function AutorizarAcessoTable(props) {
    const classes = useStyles();
    const {rows} = props;

    const history = useHistory();

    const handleAcao=(e, index) =>{
        console.log('>>>acao<<<', index, rows[index] );
        // if( rows[index].status === 'ABERTO' || rows[index].status === 'EM_ANALISE')
        {
            history.replace("/home/solicitarAcesso/"+ rows[index].id);
        }
    }
    function getTituloSituacao(row){
        if( row.status === 'ABERTO') return "Analisar";
        if( row.status === 'EM_ANALISE') return "Analisar";

        return "Visualizar";
    }

    function historico( solicitacao ){
        console.log( solicitacao );
        if( solicitacao.historico ){
            const dado = solicitacao.historico[ solicitacao.historico.length-1].data;
            if( typeof dado === 'string'){
                return FormataData( new Date(dado)) 
            }
            return FormataData(dado);
        }
        return "pendente de envio";
    }
    function historicoTxt( solicitacao ){
        console.log( solicitacao );
        if( solicitacao.historico ){
            return solicitacao.historico[ solicitacao.historico.length-1].text;
        }
        return "pendente de envio";
    }

    return (
        <div>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell width='200px'>Nome</StyledTableCell>
                        <StyledTableCell>Empresa</StyledTableCell>
                        <StyledTableCell>Data da solicitação</StyledTableCell>
                        <StyledTableCell>Situação</StyledTableCell>
                        <StyledTableCell width='100px' align="center">Ação</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <StyledTableRow key={i}>
                            <StyledTableCell component="th" scope="row">
                                {row.solicitante.nome}
                            </StyledTableCell>
                            <StyledTableCell >{ row.empresa.nomeEmpresa}</StyledTableCell>
                            <StyledTableCell >{ historico(row) }</StyledTableCell>
                            <StyledTableCell >{ historicoTxt(row) }</StyledTableCell>
                            
                            <TableCell>
                                <Box>
                                    <Button variant="outlined" color="primary" onClick={ (e) => handleAcao(e,i) }>
                                        { getTituloSituacao(row) }
                                    </Button>
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
