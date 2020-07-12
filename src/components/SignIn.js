import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { login } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

function BemVindo() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Bem Vindo ao '}
      <Link color="inherit" href="https://material-ui.com/">
        SEMP-PRODF
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [msgErro, setMsgErro] = React.useState('');
  
  const [user, setUser] = React.useState({
    login: '',
    password: ''
  });

  const handleInputChange = event => {
  
    const target = event.target;
    const value = target.value;
    const name = target.id;
    user[name]=value;

    console.log( name, value );
    setUser(user);
    setOpen(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log( user );
    localStorage.removeItem(ACCESS_TOKEN+"_menu");
    login(user)
        .then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.accessToken);
            console.log("You're successfully logged in!");
            // setOpen(false);
            if( props.onChange ) props.onChange(false);
            // window.location.reload();
            window.location.href = "/home";
 
            
        }).catch(error => {

          setOpen(true);
          setMsgErro( (error && error.message) || 'Oops! Something went wrong. Please try again!' );
          
          document.getElementById("login").value="";
          document.getElementById("password").value="";
          document.getElementById("login").focus();

          console.log( error );
        });      
}

  return (
    <Container component="main" maxWidth="xs">

      <div className={classes.root}>
            <Collapse in={open}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {msgErro}
              </Alert>
            </Collapse>
          </div>

      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Logar
        </Typography>
        <form className={classes.form} noValidate method="post" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="login"
            label="Login"
            name="login"
            autoComplete="login"
            autoFocus onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password" onChange={handleInputChange}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/home/recuperarSenha" variant="body2">
                Esqueci a senha
              </Link>
            </Grid>
            <Grid item>
              <Link href="/home/solicitarAcesso" variant="body2">
                Solicitar Acesso
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <BemVindo />
      </Box>
    </Container>
  );
}