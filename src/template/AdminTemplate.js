import React,{useState } from 'react'
import {Route} from "react-router-dom";
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import Header from "../components/header";
import { Fragment } from 'react';
const AdminLayout=(props)=>{
    const [visible, setVisible] = useState(false);
    let setVisibleSidebar =(val)=>{
        setVisible(val)
    }
    return(
        <Fragment>
            <Header setVisibleSidebar={setVisibleSidebar} visibleStatus={visible} />
            <Sidebar
                baseZIndex={1000000} 
                visible={visible}
                onHide={() => setVisible(false)}
            >
            </Sidebar>
            {props.children}
      </Fragment>
    )
}

export default function AdminTemplate({Component,...props}) {
    
    return (
      <Route
        {...props}
        render={propsComponent=>(
            <AdminLayout>
                <Component {...propsComponent}/>
            </AdminLayout>
        )}
      
      /> 
    );
}
