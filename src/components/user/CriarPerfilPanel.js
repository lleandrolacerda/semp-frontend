import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Grid, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        // textAlign: 'center',
        color: theme.palette.text.secondary,
      },
    formControl: {
        margin: theme.spacing(3),
    },
}));


export default function CriarPerfilPanel(){
    const classes = useStyles();

    return (
        <Container  className={classes.root} maxWidth="xl">
            <Grid container spacing={3}>
                <Grid item sm={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" gutterBottom>
                            F06 – Criar perfil 
                            Funcionalidade para permitir que o administrador crie perfis de acesso ao sistema, indicando as funcionalidades que o perfil terá acesso. 
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}