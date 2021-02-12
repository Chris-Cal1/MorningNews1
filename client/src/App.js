import React, {useState, useEffect}  from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import ScreenHome from './components/ScreenHome';
import ScreenMyArticles from './components/ScreenMyArticles';
import ScreenArticlesBySource from './components/ScreenArticlesBySource';
import ScreenSource from './components/ScreenSource';

//(3.9) importation des composants nécessaires à la mise en place du store
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
//(3.10) Importation du reducer précédemment créé.
import wishlist from './reducer/article';

import token from './reducer/token';
import selectedLang from './reducer/selectedLang';

function App() {

  //(3.11) Paramétrage du reducer pour qu’il soit associé à l’état du store nommé articleWishlist
const store = createStore(combineReducers({wishlist, token, selectedLang}));

//(1.1) Mise en place des routes
//(1.7)(ligne 21) Modification du Router pour que la route qui pointe vers le composant ScreenArticlesBySource puisse prendre en compte l’ID qui transite désormais dans l’URL
  return (

//(3.12) Mise en place du store sur l'ensemble de l’application
 <Provider store={store}>
    <Router>
     <Switch>
       <Route exact path="/" exact component={ScreenHome} />
       <Route exact path="/screenmyarticles" exact component={ScreenMyArticles} />
       <Route exact path="/screenarticlesbysource/:id" exact component={ScreenArticlesBySource} />
       <Route exact path="/screensource"  exact component={ScreenSource} />
     </Switch>
  </Router>
</Provider>
  );
}

export default App;