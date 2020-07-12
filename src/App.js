import React from "react";
import Home from "./components/Home";
import Header from "./components/Header";
import NotFound from "./components/common/NotFound";
import OAuth2RedirectHandler from "./components/oauth2/OAuth2RedirectHandler";
import FormMinhaConta from "./components/user/FormMinhaConta";
import VerPost from "./components/user/home/VerPost";
import Perfil from "./components/user/Perfil";
import Login from "./components/user/home/Login";
import CriarPerfilPanel from "./components/user/CriarPerfilPanel";
import CriarFuncionalidadePanel from "./components/user/CriarFuncionalidadePanel";
import CadastrarPerfilPanel from './components/user/CadastrarPerfilPanel';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/topics">
            <Topics />
          </Route>

          <Route path="/home" component={Home}></Route>
          <Route
            path="/oauth2/redirect"
            component={OAuth2RedirectHandler}
          ></Route>
          <Route path="/minhaConta">
            <FormMinhaConta />
          </Route>
          <Route path="/Perfil">
            <Perfil />
          </Route>
          <Route path="/criarPerfil">
            <CriarPerfilPanel />
          </Route>
          <Route path="/CadastrarPerfil">
            <CadastrarPerfilPanel />
          </Route>

          <Route path="/criarFuncionalidade">
            <CriarFuncionalidadePanel />
          </Route>

          <Route path="/login">
            <Login />
          </Route>
          <Route path="/post/:id" render={(props) => <VerPost {...props} />} />

          <Route component={NotFound}></Route>
        </Switch>
      </div>
    </Router>
  );
}

function About() {
  return <h2>Sobre...</h2>;
}

function Topics() {
  return <h2>lalalalalal</h2>;
}

export default App;
