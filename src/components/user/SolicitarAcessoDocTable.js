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
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

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
    boxMargin: {
        marginLeft: 30
    }
});
let currentRow=-1;

export default function SolicitarAcessoDocTable(props) {
    const classes = useStyles();
    const {rows, setRows, setErro, editavel} = props;

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
    function Download(prods){
        const {doc} = prods;
        const handleUpload = (e)=>{
            fetch("/api/dowload/fileSystem/"+doc.uuid+"-"+doc.arquivo)
            .then( res => res.blob() )
            .then( blob => {
                // var file = window.URL.createObjectURL(blob);
                // window.location.assign(file);

                var a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.setAttribute("download", doc.arquivo);
                a.click();

            });
        }
        return(
            <Box className={classes.boxMargin}>    
            {
                doc.arquivo.length > 0 &&
                    // <a href={"/api/dowload/fileSystem/"+doc.uuid+"-"+doc.arquivo} target="_blank" rel="noopener noreferrer" download>
                    <IconButton onClick={ (e) => handleUpload() }>
                        <CloudDownloadIcon />
                    </IconButton>
                    // </a>
            }
            </Box>
        )
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
                            <StyledTableCell >{row.doc?row.doc:row.arquivo}</StyledTableCell>
                            <TableCell>

                            {
                                        editavel && editavel=== true?
                                    <Box>    
                                        <IconButton onClick={ (e) => handleAnexo(e,i) }>
                                            <AttachFileIcon />
                                        </IconButton>
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                        :
                                        <Download doc={row}/>
                            }
                                

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
