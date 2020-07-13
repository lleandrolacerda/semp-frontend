import React, {useEffect, useState} from "react";
import { fade, createStyles, makeStyles} from '@material-ui/core/styles';
import {Container, Grid, InputBase, Paper} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import UsersTable from './UsersTable';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
        width: '100%',
        marginTop: '60px'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      },
      searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '100%',
        },
      },
      paper: {
        padding: theme.spacing(2),
        // textAlign: 'center',
        color: theme.palette.text.secondary,
      },
  }),
);
let users = null;
let elapseTime = 0;
let tempo = 600;
let filtroCampo=null
export default function UsersPanel() {
    const classes = useStyles();
    const [dados, setDados] = React.useState([]);

    const [erro, setErro] = useState();
    
    useEffect(() => {
        console.log('>>>useEffect<<<')
        async function fetchData(){
            const response = await fetch('/api/usuariosSistema');
            const data = await response.json();
            console.log( data );
            if( data.status > 300){
                setErro(data);
                return;
            }else{
                users = data;
                filtraDado();
            }
        }
        if( dados.length === 0){
            fetchData();   
        }
      },[dados] );

      function filtraDado(){
        console.log('>>>>deve<<<<', filtroCampo);

        let arr = [];
        users.forEach(d => {
            console.log( d );    
            if( filtroCampo ){
                let campos = filtroCampo.split(' ');
                root: for( var x in d){
                    for( var y in campos){
                        if( d[x] === campos[y]){
                            arr.push( d );
                            break root;
                        }
                    }
                }
            }else{
                arr.push( d );
            }
        });
        setDados(arr);
      }

    const handleSearch =(e) =>{
        filtroCampo = e.target.value;

        if( performance.now() - elapseTime > tempo ){
            disparaSearch();
        }

        elapseTime = performance.now();

    }
    function disparaSearch(){
        console.log('diffff ', (performance.now() - elapseTime ) ); 
        setTimeout(function () {
            if( performance.now() - elapseTime > tempo ){
                filtraDado(filtroCampo);
            }else{
                disparaSearch();
            }
        }, tempo);        
    }
    return (
        <Container maxWidth="xl" className={classes.root}>
            <Paper className={classes.paper}>
                {
                    erro && <Alert severity="error">{erro.statusText || erro.error}</Alert>
                }
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Buscar…"
                        onChange={ handleSearch}
                        fullWidth
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>
                </Grid>
                <Grid item xw={12}>
                    <UsersTable rows={ dados }/>
                </Grid>
            </Grid>
            </Paper>
        </Container>
    )
};