import React from 'react';
import { withStyles, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';

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
let currentRow=-1;

export default function SolicitarAcessoDocTable(props) {
    const classes = useStyles();
    const {rows, setRows, erro, setErro} = props;

    function fileClick(){
        let file = document.getElementById("file");
        file.click();
    }
    const handleAnexo=(e, index) =>{
        console.log('>>>upload<<<', index);
        currentRow=index;

        fileClick();
    }
    const upload=(e) =>{
        let file = document.getElementById("file");
        let dataArray = new FormData();
        dataArray.append('file', file.files[0]);
        
        fetch('/api/upload/file', {method: "POST", body: dataArray})
        .then(res =>  res.status === 200 ?res.json():setErro(res, console.log(res) ) )
        .then(
            (result) => {
              console.log( result );
              var nm = file.value;
              nm = nm.split(/(\\|\/)/g).pop();
              console.log( nm );

              let itens = [...rows];
              itens[ currentRow ].doc = nm;
              itens[ currentRow ].uuid = result.uuid;
              itens.map(i => console.log(i) );
              setRows(itens);
            },
            (error) => {
              console.log( error );
            }
          );
    }
    return (
        <div>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell width='200px'>Tipo documento</StyledTableCell>
                        <StyledTableCell>Documento</StyledTableCell>
                        <StyledTableCell width='100px' align="center">Ação</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <StyledTableRow key={i}>
                            <StyledTableCell component="th" scope="row">
                                {row.nome}
                            </StyledTableCell>
                            <StyledTableCell >{row.doc}</StyledTableCell>
                            <TableCell>

                                <Box>
                                    <IconButton onClick={ (e) => handleAnexo(e,i) }>
                                        <AttachFileIcon />
                                    </IconButton>
                                    <IconButton>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                            </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            
        </TableContainer>
        <input type="file" id="file" style={{display:'none'}} onChange={upload}/>
        
        </div>
    );
}
