import React, { Component } from 'react'
import * as LocalStoreServs from "../services/accessToLocalStore";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";
class UserManagement extends Component {
    constructor(props){
        super(props)
        if(LocalStoreServs.getAdminLoginData()=== null){
            this.props.history.push('/login')
        }
        

    }
    render() {
        return (
            <div>
                userManagement
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return {

    }
}
const mapDispatchToProps=(dispatch)=>{
    return {
        
    }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(UserManagement))
