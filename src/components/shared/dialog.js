import React, { Component } from 'react';
import "primeflex/primeflex.css";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import {withRouter} from "react-router-dom";
 class DialogCustom extends Component {
    //props:
    //header,position,content,btLeft,btRight,btLeftAction,btRightAction
    constructor(props){
        super(props)
        this.state={
            
            dialogVisible:false
           
        }
    }
    onHide() {
        this.setState({
            dialogVisible: false
        });
    }
    openDialog=()=>{
        if(this.props.openDialog){
            this.setState({
                dialogVisible:true
            })
        }
    }
    renderFooter(btLeft,btRight,) {
        let{btLeftAction,btRightAction}=this.props;
        return (
          <div>
            <Button
                label={btLeft}
                icon="pi pi-times"
                onClick={() => {
                    btLeftAction()
                    this.onHide();
                }
                }
                className="p-button-text"
            />
            <Button
                label={btRight}
                icon="pi pi-check"
                onClick={() => {
                    btRightAction()
                    this.onHide();
                }
                }
                autoFocus
            />
          </div>
        );
      }
      
    render() {
        let{header,position,btLeft,btRight,content}=this.props
        return (
            <Dialog
                header={header}
                visible={this.state.dialogVisible}
                position={position}
                modal
                style={{ width: "50vw" }}
                footer={this.renderFooter(btLeft,btRight)}
                onHide={() => this.onHide()}
          >
            <p className="p-m-0">
              {content?{content}:"không có data truyền vào props content"}
            </p>
          </Dialog>
        )
    }
}
export default withRouter(DialogCustom)