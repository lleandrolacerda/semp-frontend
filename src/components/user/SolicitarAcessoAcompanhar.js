import React, {useState, useEffect} from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SolicitarAcessoDocTable from './SolicitarAcessoDocTable';
import Button from '@material-ui/core/Button';
import MotivoDialog from '../../util/MotivoDialog';
import ConfirmDialog from '../../util/ConfirmDialog';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";

import {
    useParams
  } from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      padding: theme.spacing(2),
      // textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      width: '50%',
      justifyContent: 'center',
      alignItems: 'center'

    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    btns: {
      '& > *': {
        margin: theme.spacing(1),
      },
    }

  }),
);
export default function SolicitarAcessoAcompanhar() {
    const classes = useStyles();
    let { id } = useParams();
    const [showMotivoDialog, setShowMotivoDialog] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [dados, setDados] = React.useState();
    const [erro, setErro] = useState();
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const history = useHistory();

    const [expanded, setExpanded] = React.useState({
      pn1:true,
      pn2:true
    });

    const [documentos, setDocumentos] = useState([]);

  
    useEffect(() => {
      console.log('>>>useEffect<<<');
      async function fetchData(){
          const response = await fetch('/api/acesso/solicitar/'+id);
          const data = await response.json();
          if( data.status > 300){
              setErro(data);
              return;
          }else{
              console.log( data );
              setDados( data );
              setDocumentos( data.documentos );
          }
      }
      if( !dados ){
          fetchData();   
      }
    },[dados] );

    function confirmaAprovacao(){
      console.log('>>>>>>>>');
      setOpenBackdrop(true);
      const body = {
        idSolicitacao: dados.id
      }
      console.log( body );
      
      fetch('/api/acesso/aprovarSolicitacao', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      }).then(response => {
          setOpenBackdrop(false);
          if( response.status <= 300){
            console.log( response );
            // return response.json();
            history.replace("/autorizaAcesso");
          }else{
            setErro( response );
          }
      })
      .catch(error => {
          setOpenBackdrop(false);
      });
    }
  
    const revogar=(txt) => {
      console.log('>>>implementar revogar<<<', txt);
      setShowMotivoDialog(false);

      setOpenBackdrop(true);
      const body = {
        idSolicitacao: dados.id,
        motivo: txt 
      }
      console.log( body );
      
      fetch('/api/acesso/revogarSolicitacao', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      }).then(response => {
          setOpenBackdrop(false);
          if( response.status <= 300){
            console.log( response );
            // return response.json();
            history.replace("/autorizaAcesso");
          }else{
            setErro( response );
          }
      })
      .catch(error => {
          setOpenBackdrop(false);
      });
    }
    const handleChange = (panel) => (event, isExpanded) => {
      let pn = {...expanded};
      pn[panel] = isExpanded;
      setExpanded(pn);
    };

    const handleReprovar=(e) =>{
      console.log( '>>>handleReprovar<<<', dados);    

      setShowMotivoDialog(true);
    }

    return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              {
                  erro && <Alert severity="error">{erro.statusText || erro.error}</Alert>
              }
              <Grid container spacing={3} >
                <Grid item xs>
                  
                </Grid>
                <Grid item className={classes.btns}>
                  <a href={"/autorizaAcesso"} rel="noopener noreferrer" >
                      <Button variant="outlined" color="primary">
                        Sair
                      </Button>
                  </a>
                  {
                    (dados && (dados.status === 'ABERTO' || dados.status === 'EM_ANALISE')) &&
                      <Button variant="outlined" color="secondary" onClick={handleReprovar}>
                        Reprovar
                      </Button>
                  }
                  {
                    (dados && (dados.status === 'ABERTO' || dados.status === 'EM_ANALISE')) &&
                      <Button variant="outlined" color="primary" onClick={()=>setShowConfirm(true)}>
                        Aprovar
                      </Button>  
                  }
                  
                </Grid>
            </Grid>
            <ExpansionPanel expanded={expanded.pn1} onChange={handleChange('pn1')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>Responsável pelas informações</Typography>
                      <Typography className={classes.secondaryHeading}>Informe o contato</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <b>CPF: </b> { dados? dados.solicitante.cpf: ''}
                          
                        </Grid>
                        <Grid item xs={8}>
                          <b>Nome:</b>
                        </Grid>

                        <Grid item xs={4}>
                          <b>Data nascimento: </b>
                        </Grid>
                        <Grid item xs={8}>
                          <b>Nome da mãe: </b>
                        </Grid>

                        <Grid item xs={4}>
                          <b>Telefone: </b>
                        </Grid>
                        <Grid item xs={8}>
                          <b>Email: </b>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  <ExpansionPanel expanded={expanded.pn2} onChange={handleChange('pn2')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2bh-content"
                      id="panel2bh-header"
                    >
                      <Typography className={classes.heading}>Informação da empresa</Typography>
                      <Typography className={classes.secondaryHeading}>Empresa que esta pleiteando o projeto</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <b>CNPJ: </b>
                        </Grid>
                        <Grid item xs={8}>
                          <b>Nome da Empresa</b>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  <SolicitarAcessoDocTable rows={documentos} setRows={setDocumentos} erro={erro} setErro={setErro} editavel={false} exec={confirmaAprovacao} />

            </Paper>
          </Grid>
              <MotivoDialog open={showMotivoDialog} setOpen={setShowMotivoDialog} acao={revogar}/>
              <ConfirmDialog 
                open={showConfirm} 
                setOpen={setShowConfirm} 
                titulo={'Confirmação'} 
                msg='Apos a confirmação da solicitação o cliente receberá um email com as informações com acessos para prosseguir a solicitação.' 
                exec={confirmaAprovacao}
                />
              <Backdrop className={classes.backdrop} open={openBackdrop} >
                <CircularProgress color="inherit" />
              </Backdrop>
        </Grid>
    )

}