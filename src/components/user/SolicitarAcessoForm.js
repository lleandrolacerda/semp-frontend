import React, {useState} from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MaskedInput from 'react-text-mask'
import Button from '@material-ui/core/Button';
import SolicitarAcessoDocTable from './SolicitarAcessoDocTable';
import { ValidarCNPJ } from '../../constants/';
import { ValidarCPF } from '../../constants/';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import {
  KeyboardDatePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%'
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

  }),
);

function TelMask(props) {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}
function CPFMask(props) {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}
function CNPJMask(props) {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

export default function SolicitarAcessoForm() {
  const classes = useStyles();
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [erro, setErro] = useState();
  const [editavel, setEditavel] = useState(false);
  const [solicitacao, setSolicitacao]= useState();
  const [documentos, setDocumentos] = useState(
    [
        { nome:'Contrato Social', doc:''},
        { nome:'Cartão CNPJ', doc:''},
        { nome:'Procuração', doc:''},
        { nome:'Documento de Identificação', doc:''},
    ]
  );

  const [selectedDate, setSelectedDate] = React.useState(null);

  const [expanded, setExpanded] = React.useState({
    pn1:true,
    pn2:true
  });
  const [values, setValues] = React.useState({
    cpf: '',
    nome: '',
    telefone: '',
    nomeMae: '',
    email: '',
    cnpj:'',
    nomeEmpresa:'',
  });
  const [error, setError] = React.useState(resetErro());

  const handleChange = (panel) => (event, isExpanded) => {
    let pn = {...expanded};
    pn[panel] = isExpanded;
    setExpanded(pn);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setValues({
      ...values,
      'dataNascimento': date,
    });
  };

  const handleChangeInputForm = (event) => {
    
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleLostFocusCPF=(e) => {
    
    setError({...error, 
      cpf:{
      erro: false,
      msg: ''
    }});
    const cpf = values.cpf.replace(/[&\/\\#,+()$~%.\-'":*?<>{}]/g,'').trim();
    
    if( cpf.length === 0 ) return;

    if( ValidarCPF(cpf)){
      // TODO buscar ou não CPF
      setOpenBackdrop(true);
      fetch("/api/v1/cpf/"+cpf)
        .then(res => {
          if( res.status <= 300) return res.json()
        })
        .then(
          (result) => {
            setOpenBackdrop(false);
            
            if( ! result){
              setEditavel(true);
              setValues({
                ...values, nome:''
              }); 
            }else {
              setValues({
                ...values, 
                nome:result.name,
                nomeMae: result.nomeMae,
                dataNascimento: new Date(result.dataNascimento),
                email: result.email,
                telefone: result.telefone
              });
              setSelectedDate( new Date(result.dataNascimento) );
              setEditavel(false);
            }
          },
          (error) => {
            
            setOpenBackdrop(false);
          }
      )
    }else{
      setError({...error, 
        cpf:{
        erro: true,
        msg: 'CPF inválido'
      }});
    }
  }
  const handleLostFocusCNPJ=(e) =>{
    
    setError({...error, 
      cnpj:{
      erro: false,
      msg: ''
    }});
    const cnpj = values.cnpj.replace(/[&\/\\#,+()$~%.\-'":*?<>{}]/g,'').trim();
    if( cnpj.length === 0 ) return;
    
    if( ValidarCNPJ(cnpj) ){
      setOpenBackdrop(true);
      
      // fetch("https://receitaws.com.br/v1/cnpj/"+cnpj)
      fetch("/api/v1/cnpj/"+cnpj)
      .then(res => (res.status <= 300)?res.json():setErro(res))
      .then(
        (result) => {
          setOpenBackdrop(false);
          if( !result) return;
          setValues({
            ...values, nomeEmpresa:result.nome
          });
        },
        (error) => {
          setOpenBackdrop(false);
        }
      )
    }else{
      setError({...error, 
        cnpj:{
        erro: true,
        msg: 'CNPJ inválido'
      }});
    }    
  }

  function resetErro(){
    return {
      cnpj:{
        erro:false,
        msg:''
      },
      cpf:{
        erro:false,
        msg:''
      },
      telefone:{
        erro:false,
        msg:''
      },
      email: {
        erro:false,
        msg: ''
      },
      dt: {
        erro:false,
        msg: ''
      }
    }
  }
  function validarSubmit(dados){
    let ok = true;
    
    let e = resetErro();
    if( !dados.solicitante.telefone){
      e.telefone = {
        erro: true,
        msg: "Telefone é obritatório"
      }
      ok = false;
    }
    if( !dados.solicitante.email){
      e.email = {
        erro: true,
        msg: "Email é obritatório"
      }
      ok = false;
    }
    if( !dados.solicitante.dataNascimento){
      e.dt = {
        erro: true,
        msg: "Data de nascimento é obritatório"
      }
      ok = false;
    }
    if( !dados.empresa.cnpj){
      e.cnpj = {
        erro: true,
        msg: "CNPJ é obritatório"
      }
      ok = false;
    }
    
    setError(e);
    
    return ok;
  }
  const handleSubmit = (event) => {
    event.preventDefault();

    let docs = [];
    documentos.map(d => docs.push({
      nome: d.nome,
      arquivo: d.doc,
      uuid: d.uuid
    }));

    let historico = {
      data: new Date(),
      text: "Solicitação"
    }
    const dados = {
      solicitante:{
        nome: values.nome,
        cpf: values.cpf,
        email: values.email,
        dataNascimento: values.dataNascimento?values.dataNascimento.getTime():null,
        nomeMae: values.nomeMae,
        telefone: values.telefone
      },
      empresa: {
        nomeEmpresa: values.nomeEmpresa,
        cnpj: values.cnpj
      },
      documentos: docs,
      historico:[historico]
    }

    if( !validarSubmit(dados)){
      return
    }
    
    setOpenBackdrop(true);
    fetch('/api/acesso/solicitar', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados),
      credentials: 'include'
    }).then(response => {
        setOpenBackdrop(false);
        
        if( response.status <= 300){
          return response.json();
        }else{
          setErro( response );
        }
    }).then(res => setSolicitacao(res))
    .catch(error => {
        setOpenBackdrop(false);
        
    });
  }

  function SoclcitacaoOkInfo(props ){
    const {info} = props;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="subtitle1" gutterBottom>
              F01 – Solicitar acesso (Apenas para usuários externos)
              Funcionalidade para permitir que empresários solicitem acesso, preenchendo formulário e enviando documentação necessária para as devidas comprovações.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Sua solicitação foi recebida.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Aguar um momento que receberá instruções por email da analise da sua solicitação. Ou se preferir poderá acompanhar a solicitação pelo link <a href={"/home/solicitarAcesso/"+info.id}>estado da solicitação</a>,         
          </Typography>            
          </Paper>
        </Grid>
      </Grid>
    )
  }
  
  return (
    <Container maxWidth="md">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>

      {
        solicitacao ? <SoclcitacaoOkInfo info={solicitacao}/> : 
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
          <div className={classes.root}>
          {
            erro && <Alert severity="error">{erro.statusText}</Alert>
          }
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
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
                          <TextField
                            required
                            autoFocus
                            label="CPF"
                            value={values.cpf}
                            onChange={handleChangeInputForm}
                            onBlur={handleLostFocusCPF}
                            error={error.cpf.erro}
                            helperText={error.cpf.msg}
                            name="cpf"
                            id="cpf-mask-input"
                            fullWidth
                            InputProps={{
                              inputComponent: CPFMask,
                            }}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            fullWidth
                            label="Nome"
                            value={values.nome}
                            onChange={handleChangeInputForm}
                            name="nome"
                            id="nome-input"
                            InputProps={{
                              readOnly: !editavel,
                            }}
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <KeyboardDatePicker
                            disableToolbar
                            error={error.dt.erro}
                            helperText={error.dt.msg}
                            variant="inline"
                            id="dataNascimento"
                            label="Data Nascimento"
                            format="MM/dd/yyyy"
                            fullWidth
                            InputProps={{
                              readOnly: !editavel,
                            }}
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                            inputVariant="outlined"
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            fullWidth
                            label="Nome da mae"
                            value={values.nomeMae}
                            onChange={handleChangeInputForm}
                            InputProps={{
                              readOnly: !editavel,
                            }}
                            name="nomeMae"
                            id="nome-Mae"
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <TextField
                            required
                            error={error.telefone.erro}
                            helperText={error.telefone.msg}
                            label="Telefone para contato"
                            value={values.telefone}
                            onChange={handleChangeInputForm}
                            name="telefone"
                            id="tel-mask-input"
                            fullWidth
                            InputProps={{
                              inputComponent: TelMask,
                            }}
                            
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            required
                            error={error.email.erro}
                            helperText={error.email.msg}
                            fullWidth
                            label="Email para contato"
                            value={values.email}
                            onChange={handleChangeInputForm}
                            InputProps={{
                              readOnly: !editavel,
                            }}
                            name="email"
                            id="email-input"
                            variant="outlined"
                          />
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
                          <TextField
                            required
                            error={error.cnpj.erro}
                            helperText={error.cnpj.msg}
                            label="CNPJ"
                            value={values.textmask}
                            onChange={handleChangeInputForm}
                            onBlur={handleLostFocusCNPJ}
                            name="cnpj"
                            id="cnpj-mask-input"
                            InputProps={{
                              inputComponent: CNPJMask
                            }}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            fullWidth
                            label="Nome Fantasia"
                            value={values.nomeEmpresa}
                            onChange={handleChangeInputForm}
                            InputProps={{
                              readOnly: true,
                            }}
                            name="nomeEmpresa"
                            id="nome-empresa-input"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  {
                    values.cnpj.length > 0 && values.nomeEmpresa.length > 0 && 
                    <SolicitarAcessoDocTable rows={documentos} setRows={setDocumentos} erro={erro} setErro={setErro}/>
                  }
                  
                </Paper>
              </Grid>

            </Grid>
          </div>
          <center>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Solicitar
            </Button>
          </center>
          <Paper />
          <Backdrop className={classes.backdrop} open={openBackdrop} >
            <CircularProgress color="inherit" />
          </Backdrop>
        </form>
      }
      </MuiPickersUtilsProvider>
    </Container>
    );
}
