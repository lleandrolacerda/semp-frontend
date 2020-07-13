import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MaskedInput from 'react-text-mask'
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Link from '@material-ui/core/Link';

import {
    KeyboardDatePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: '10%'
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

export default function RecuperarSenhaForm() {
    const classes = useStyles();
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [erro, setErro] = useState();
    const [solicitacao, setSolicitacao] = useState();

    const [selectedDate, setSelectedDate] = React.useState(null);

    const [values, setValues] = React.useState({
        cpf: '',
        nomeMae: '',
        email: '',

    });
    const [error, setError] = React.useState(resetErro());

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

    function resetErro() {
        return {
            nomeMae: {
                erro: false,
                msg: ''
            },
            cpf: {
                erro: false,
                msg: ''
            },
            email: {
                erro: false,
                msg: ''
            },
            dt: {
                erro: false,
                msg: ''
            }
        }
    }
    function validarSubmit(dados) {
        let ok = true;

        let e = resetErro();

        if (!dados.email) {
            e.email = {
                erro: true,
                msg: "Informe o email"
            }
            ok = false;
        }
        if (!selectedDate) {
            e.dt = {
                erro: true,
                msg: "Informe a data de nascimento"
            }
            ok = false;
        }
        if (!dados.cpf) {
            e.cpf = {
                erro: true,
                msg: "Informe CPF"
            }
            ok = false;
        }
        if (!dados.nomeMae) {
            e.nomeMae = {
                erro: true,
                msg: "Informe o nome da mãe"
            }
            ok = false;
        }

        setError(e);

        return ok;
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        const dados = {
            cpf: values.cpf,
            email: values.email,
            dataNascimento: selectedDate ? selectedDate.getTime() : null,
            nomeMae: values.nomeMae,
        }

        console.log( dados );
        if (!validarSubmit(dados)) {
            return
        }

        setOpenBackdrop(true);
        fetch('/api/recuperar/senha', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados),
            credentials: 'include'
        }).then(response => {
            setOpenBackdrop(false);

            if (response.status <= 300) {
                return response.json();
            } else {
                setErro(response);
            }
        }).then(res => setSolicitacao(res))
            .catch(error => {
                setOpenBackdrop(false);

            });
    }




    function InforRecuperarSenha(props){
        const {info} = props;
        return (
            <Container component="main" maxWidth="xs">
                {
                    info.success ? <div>
                        Em instante receberá um email contendo a informação solicitada. Siga as instruções do email para logar no sistema.
                    </div>:<h2>{info.msg}</h2>
                }

            <Grid container>
                
                <Grid item>
                <Link href="/home" variant="body2">
                    Voltar
                </Link>
                </Grid>
            </Grid>
            </Container>
        )
    }




    return (
        <Container maxWidth="sm" className={classes.root} >
            { solicitacao ? 
                <InforRecuperarSenha info={solicitacao} />:
            <MuiPickersUtilsProvider utils={DateFnsUtils}>

                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <div >
                        {
                            erro && <Alert severity="error">{erro.statusText}</Alert>
                        }
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Informe os dados abaixo para que sua senha seja encaminhada ao seu e-mail. Os dados informados devem ser os mesmos cadastrados no momento da solicitação de acesso ao sistema.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                autoFocus
                                                label="CPF"
                                                value={values.cpf}
                                                onChange={handleChangeInputForm}
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
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Nome da mae"
                                                value={values.nomeMae}
                                                onChange={handleChangeInputForm}
                                                error={error.nomeMae.erro}
                                                helperText={error.nomeMae.msg}
                                                name="nomeMae"
                                                id="nome-Mae"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                error={error.dt.erro}
                                                helperText={error.dt.msg}
                                                variant="inline"
                                                id="dataNascimento"
                                                label="Data Nascimento"
                                                format="MM/dd/yyyy"
                                                fullWidth
                                                value={selectedDate}
                                                onChange={handleDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                inputVariant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                error={error.email.erro}
                                                helperText={error.email.msg}
                                                fullWidth
                                                label="Email para contato"
                                                value={values.email}
                                                onChange={handleChangeInputForm}
                                                name="email"
                                                id="email-input"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
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
                            Recuperar Senhar
            </Button>
                    </center>
                    <Paper />
                    <Backdrop className={classes.backdrop} open={openBackdrop} >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </form>
            </MuiPickersUtilsProvider>
            }
        </Container>
    );
}
