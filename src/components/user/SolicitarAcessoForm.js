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
import { useHistory } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';

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
  const history = useHistory();
  const [erro, setErro] = useState();

  const [documentos, setDocumentos] = useState(
    [
        { nome:'Comprovação doc1', obs:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, quam congue faucibus vehicula, dolor purus dapibus felis, eu feugiat ligula magna eget nisi. Pellentesque eu metus non magna mollis pretium.', doc:''},
        { nome:'Comprovação doc2', obs:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, quam congue faucibus vehicula, dolor purus dapibus felis, eu feugiat ligula magna eget nisi. Pellentesque eu metus non magna mollis pretium.', doc:''},
        { nome:'Comprovação doc3', obs:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, quam congue faucibus vehicula, dolor purus dapibus felis, eu feugiat ligula magna eget nisi. Pellentesque eu metus non magna mollis pretium.', doc:''},
        { nome:'Comprovação doc4', obs:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, quam congue faucibus vehicula, dolor purus dapibus felis, eu feugiat ligula magna eget nisi. Pellentesque eu metus non magna mollis pretium.', doc:''},
        { nome:'Comprovação doc5', obs:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, quam congue faucibus vehicula, dolor purus dapibus felis, eu feugiat ligula magna eget nisi. Pellentesque eu metus non magna mollis pretium.', doc:''},
    ]
  );

  const [expanded, setExpanded] = React.useState({
    pn1:true,
    pn2:true
  });
  const [values, setValues] = React.useState({
    cpf: '',
    nome: '',
    tel: '',
    email: '',
    cnpj:'',
    nomeEmpresa:'',
    numberformat: '1320',
  });
  const [error, setError] = React.useState({
    cnpj:{
      erro:false,
      msg:''
    },
    cpf:{
      erro:false,
      msg:''
    }
  })
  const handleChange = (panel) => (event, isExpanded) => {
    let pn = {...expanded};
    pn[panel] = isExpanded;
    setExpanded(pn);
  };

  const handleChangeInputForm = (event) => {
    console.log('>>>handleChangeMask<<<');
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleLostFocusCPF=(e) => {
    console.log( values.cpf, ValidarCNPJ(values.cpf) );
    
    setError({...error, 
      cpf:{
      erro: false,
      msg: ''
    }});
    const cpf = values.cpf.replace(/[&\/\\#,+()$~%.\-'":*?<>{}]/g,'').trim();

    
    if( cpf.length === 0 ) return;

    if( ValidarCPF(cpf)){
      // TODO buscar ou não CPF
      // setOpenBackdrop(true);
      // fetch("/api/v1/cpf/"+cpf)
      // .then(res => res.json())
      // .then(
      //   (result) => {
      //     console.log( result );
      //     setValues({
      //       ...values, nomeEmpresa:result.nome
      //     });
      //     setOpenBackdrop(false);
      //   },
      //   (error) => {
      //     console.log( error );
      //     setOpenBackdrop(false);
      //   }
      // )
    }else{
      setError({...error, 
        cpf:{
        erro: true,
        msg: 'CPF inválido'
      }});
    }
  }
  const handleLostFocusCNPJ=(e) =>{
    console.log( values.cnpj, ValidarCNPJ(values.cnpj) );
    
    setError({...error, 
      cnpj:{
      erro: false,
      msg: ''
    }});
    const cnpj = values.cnpj.replace(/[&\/\\#,+()$~%.\-'":*?<>{}]/g,'').trim();
    console.log("xoxoxo", cnpj, cnpj.length );
    if( cnpj.length === 0 ) return;
    
    if( ValidarCNPJ(cnpj) ){
      setOpenBackdrop(true);
      
      // fetch("https://receitaws.com.br/v1/cnpj/"+cnpj)
      fetch("/api/v1/cnpj/"+cnpj)
      .then(res => (res.status === 200)?res.json():setErro(res))
      .then(
        (result) => {
          setOpenBackdrop(false);
          if( !result) return;
          setValues({
            ...values, nomeEmpresa:result.nome
          });
          
        },
        (error) => {
          console.log( error );
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(">>>ainda nao implementado<<<<");

    let docs = [];
    documentos.map(d => docs.push({
      nome: d.nome,
      arquivo: d.doc,
      uuid: d.uuid
    }));

    const dados = {
      solicitante:{
        nome: values.nome,
        cpf: values.cpf,
        email: values.email
      },
      empresa: {
        nomeEmpresa: values.nomeEmpresa,
        cnpj: values.cnpj
      },
      documentos: docs
    }
    
    console.log( dados );
    
    fetch('/api/acesso/solicitar', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados),
      credentials: 'include'
    }).then(response => {
        console.log(response);
        history.push('/home');
    }).catch(error => {
        console.log(">>ERRO<<", error);
    });
  }

  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <div className={classes.root}>
      {
        erro && <Alert severity="error">{erro.statusText}</Alert>
      }
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="subtitle1" gutterBottom>
                F01 – Solicitar acesso (Apenas para usuários externos)
                Funcionalidade para permitir que empresários solicitem acesso, preenchendo formulário e enviando documentação necessária para as devidas comprovações.
            </Typography>


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
                        label="CPF"
                        value={values.textmask}
                        onChange={handleChangeInputForm}
                        onBlur={handleLostFocusCPF}
                        error={error.cpf.erro}
                        helperText={error.cpf.msg}
                        name="cpf"
                        id="cpf-mask-input"
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
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        required
                        label="Telefone para contato"
                        value={values.telefone}
                        onChange={handleChangeInputForm}
                        name="tel"
                        id="tel-mask-input"
                        InputProps={{
                          inputComponent: TelMask,
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        required
                        fullWidth
                        label="Email para contato"
                        value={values.telefone}
                        onChange={handleChangeInputForm}
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
                          inputComponent: CNPJMask,
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
                        name="nomeEmpresa"
                        id="nome-empresa-input"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              {
                values.cnpj.length > 0 && values.nomeEmpresa.length > 0 && <SolicitarAcessoDocTable rows={documentos} setRows={setDocumentos} erro={erro} setErro={setErro}/>
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
  );
}
