import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Input, FormHelperText, Container, Button, FormLabel, FormGroup, Grid, FormControlLabel, Checkbox, Typography } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { useCurrentUser } from "../../server/UseCurrentUser";

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
        flexGrow: 1,
    },
    paper: {
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

let pageLoaded = false;

export default function FormMinhaConta() {
    const classes = useStyles();
    const history = useHistory();
    const isFirstRender= useRef(true);

    const [user, setUser] = React.useState({
        name: '',
        email: '',
        login: '',
        pass: ''
    });

    let [profile] = useCurrentUser();

    useEffect(() => {
        if (profile) {
            if(isFirstRender.current){
                isFirstRender.current=false
            }else{
                return;
            }
            if (profile.erro) return;
            user.name = profile.name;
            user.email = profile.email;
            user.login = profile.login;
            user.perfis = profile.perfis;
            setUser(user);
        }
    }, [profile, user]);

    const handleSubmit = (event) => {
        event.preventDefault();

        user.provider = 'local'; //autencição no sistema local

        fetch('/api/formMinhaConta' + ((user.id) ? '/' + user.id.toString() : ''), {
            method: (user.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
            credentials: 'include'
        }).then(response => {
            console.log(response);
            history.push('/home');
        }).catch(error => {
            console.log(">>ERRO<<", error);
        });
    }

    const handleChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <Container maxWidth="sm">
            <form className={classes.root} noValidate autoComplete="off" action="/api/formMinhaConta" method="post" onSubmit={handleSubmit} >
                <Grid container className={classes.root} spacing={3}>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5">
                            Configurações do cliente
                        </Typography>
                        <FormControl fullWidth >
                            <InputLabel htmlFor="name">Nome</InputLabel>
                            <Input name="name" aria-describedby="nome-helper-text" onChange={handleChange} value={user.name || ''} />
                            <FormHelperText id="nome-helper-text">Nome e sobrenome</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth >
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input name="email" aria-describedby="my-helper-text" onChange={handleChange} value={user.email || ''} />
                            <FormHelperText id="my-helper-text">Nos nunca divulgaremos seu email</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth >
                            <InputLabel htmlFor="login">Login</InputLabel>
                            <Input name="login" aria-describedby="login-helper-text" onChange={handleChange} value={user.login || ''} />
                            <FormHelperText id="login-helper-text">Nome que gostaria de ser chamado</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth >
                            <InputLabel htmlFor="pass">Senha</InputLabel>
                            <Input name="password" type="password" onChange={handleChange} />
                            <FormHelperText id="pass-helper-text">Informe a senha com minimo 8 caracteres</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth >
                            <InputLabel htmlFor="passValidacao">Confirma Senha</InputLabel>
                            <Input name="passValidacao" type="password" aria-describedby="pass-helper-text" onChange={handleChange} />
                            <FormHelperText id="passValidacao-helper-text">Confirme a senha</FormHelperText>
                            <br /><br />
                            <Button variant="outlined" color="primary" href="/TrocarSenha">Trocar a senha</Button>
                        </FormControl>


                        <br /><br /><br />
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel component="legend">Acesso ao sistema</FormLabel>
                            <FormGroup>
                                <ul>
                            {
                                profile &&
                                profile.perfis.map((campo, i) => (
                                <li key={i}>{ campo }</li>
                                ))
                            }
                                </ul>
                            </FormGroup>
                            <br/>
                            <FormHelperText>Perfis de acesso que o usuario tem junto ao sistema.</FormHelperText>
                        </FormControl>
                    </Grid>


                    <Grid item xs={12} className={classes.paper} >
                        <Button variant="outlined" color="primary" onClick={handleSubmit} type="submit">
                            Ok
                        </Button>
                        <Button href="/home" variant="outlined" color="secondary">
                            Sair
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );

}
