import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import {Menu, Divider} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';

import LeftMenu from './LeftMenu';
import { useCurrentUser } from "../server/UseCurrentUser";
import LoginModal from "./LoginModal";
import { ACCESS_TOKEN } from '../constants';

import { useHistory } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
}));

export default function Header(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [isSSEStarted, setIsSSEStarted] = React.useState(false);
  const [isLoadUserPost, setIsLoadUserPost] = React.useState(false);

  const [userPost, setUserPost] = React.useState([]);

  let [profile, loading] = useCurrentUser();

  const [state, setState] = React.useState({
    open: false
  });

  const isMenuOpen = Boolean(anchorEl);
  const isMenuNotifiOpen = Boolean(anchorElNotif); 
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const history = useHistory();

  useEffect(() => {
    async function fetchData(){
      const response = await fetch('/api/post/user/'+profile.id);
      const data = await response.json();
      if( data && data.length> 0 ){
        let arr = []; //[...userPost];
        data.forEach(d => {
          let item = arr.find( el => el.titulo === d.titulo);
          if( !item ){
            item = {
              titulo: d.titulo,
              lst: [d]
            };
            arr.push(item);
          }else{
            item.lst.push(d);
          }
          
        });
        setUserPost( arr);
        // setUserPost( data );
      }
    }

    if( !isLoadUserPost && !!profile ){
      setIsLoadUserPost(true);
      fetchData();
      //TODO descomentar
      // initEventSource();
    }
  });

  const initEventSource = () => {
    if( isSSEStarted ) return;

    setIsSSEStarted(true);

    console.log('>>>initEventSource<<<');
    // const eventSource = new EventSource('http://localhost:8081/post/sse/'+profile.id); 
    const eventSource = new EventSource('/api/post/user/'+profile.id); 
    window.sseErro =0;
        eventSource.onopen = (event) => {
          window.sseErro =0;
          console.log(">>>on open<<<");
          console.log(">>>=======<<<");
          setUserPost([]); 
        }
        eventSource.onmessage = (event) => {

            const data = JSON.parse(event.data); 
            let arr = [...userPost];

            if( !(arr.find(p => p.id === data.id)) ){
              setUserPost(a => [...a, data]);
            }
        };
        eventSource.onerror = (event) => {
          console.log(">>>ONERROR<<<");
          console.log( window.sseErro );
          console.log(">>>=======<<<");
          if( window.sseErro > 3) eventSource.close();
          window.sseErro += 1;
          
        };
  }

  const handleLimparNotif = event =>{
    setUserPost([]);
    if( !state.open ) handleMenuClose();
  }

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifMenuOpen = event => {
    setAnchorElNotif(event.currentTarget);
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleLogin = () => {
    setOpenLogin(!openLogin);
    if( !state.open ) handleMenuClose();
  };

  const handleCriarUmaConta = () => {
    history.replace("/minhaConta");

    // props.history.push("/about");
    if( !state.open ) handleMenuClose();
  }
  const handlePerfil = () =>{
    history.replace("/Perfil");
    if( !state.open ) handleMenuClose();
  }

  const handleTrocaSenha = () => {
    handleMenuClose();
    history.replace("/trocarSenha");

    // props.history.push("/about");
    //if( !state.open ) handleMenuClose();
  }

  const handleLogout = () => {
    console.log('>>>handleLogout<<<');
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.clear();
    profile = {};

    history.push("/home");
    window.location.reload();

    if( !state.open ) handleMenuClose();
  }
  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorElNotif(null);
    handleMobileMenuClose();
  };
  const handleOpenNotificacao = (e, post) => {
    console.log('>>>handleOpenNotificacao<<<', post);
    let ids = '';
    post.lst.forEach(p => ids+= p.idPost+",");
    history.push("/post/"+ids);
    handleMenuClose();
  }

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const toggleDrawer = () => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, open: !state.open });
  };

  const menuId = 'primary-search-account-menu';
  const menuNotificacaoId = 'menu-notificacao-id';

  const menuItem = (profile) => {
    if (profile && profile.usuarioExterno) {
      return (
        <div>
          <MenuItem onClick={handlePerfil}>Perfil</MenuItem>
          <MenuItem onClick={handleCriarUmaConta}>Minha conta</MenuItem>
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
          <MenuItem onClick={handleTrocaSenha}>Trocar senha</MenuItem>
        </div>
      )
    } else {
      return (
        <div>
          <MenuItem onClick={handleLogin}>Login</MenuItem>
          <MenuItem onClick={handleCriarUmaConta}>Criar uma conta</MenuItem>
          <MenuItem onClick={handlePerfil}>Perfil</MenuItem>
        </div>
      )
    }
  };
function sizeUserPost(up){
  let qtd = 0;
  if( up){
    up.forEach(u =>{

      qtd += u.lst.length;
    });
  }
  return qtd;
}
const renderMenuNotificacao =(

  <Menu
      anchorEl={anchorElNotif}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuNotificacaoId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuNotifiOpen}
      onClose={handleMenuClose}
    >
      {userPost && sizeUserPost(userPost) > 0 ? 
        <div>
          {
           userPost.map((p, index) => (
            <MenuItem key={index} onClick={(e)=> handleOpenNotificacao(e,   p)} >{p.titulo + "("+p.lst.length+")"}</MenuItem>
          ))
          }
          <Divider />
          <MenuItem onClick={handleLimparNotif}>Limpar todas notificações</MenuItem>
        </div>:("Sem notificação")
      }
    </Menu>
)
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {
        loading ? ("carregando...") : menuItem(profile)
      }

    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem> */}
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={ sizeUserPost(userPost) } color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

const conteudo = (  
  <div className={classes.grow}>
          <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            onClick={toggleDrawer()}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            PRODF SEMP
          </Typography>
          
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {/* <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={8} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton> */}
            <IconButton aria-label="show 17 new notifications" 
              color="inherit" 
              aria-controls={menuNotificacaoId}
              aria-haspopup="true"
              onClick={handleNotifMenuOpen }
              >
              <Badge badgeContent={ sizeUserPost(userPost) } color="secondary" >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <LeftMenu open={state.open} onchange={toggleDrawer()} profile={profile} />

      {renderMobileMenu}
      {renderMenu}
      {renderMenuNotificacao}
      <LoginModal open={openLogin} onchange={handleLogin}/>
    </div>
) 
  return (
    <div>
      {
         profile && conteudo
      }
    </div>
      
  );
}
