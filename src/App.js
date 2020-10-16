import React from 'react';
import './App.scss';
import { BrowserRouter, Switch } from "react-router-dom";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Route } from "react-router-dom";
import AdminTemplate from "./template/AdminTemplate";
import {routes} from "./routings/routing";
import Login from "./pages/login";
function App() {
  const showAdminTemplate=routes=>{
    if(routes && routes.length>0){
      return routes.map((item,index)=>{
        return (
          <AdminTemplate
            key={index}
            exact={item.exact}
            path={item.path}
            Component={item.component}
          />
        )
      })
    }
  }
  return (
    <BrowserRouter>
        <Switch>
          {showAdminTemplate(routes)}
          <Route path="/login" exact component={Login} />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
