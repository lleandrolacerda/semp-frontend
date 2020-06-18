import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        // width: '25ch',
      },
    },
  }),
);

export default function SolicitarAcessoForm() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
        <h2>colocar aqui formulario de solicitaçãod e acessso e cadastro de documentação</h2>
      <TextField id="standard-basic" label="Standard" />
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </form>
  );
}
