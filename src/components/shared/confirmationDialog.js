import React, { Component } from 'react';
import "primeflex/primeflex.css";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import {withRouter} from "react-router-dom";
 class ConfirmationDialog extends Component {
    //props:
    //header,content,isOpen,btLeft,btRight,leftAction,rightAction,closeDialog
    constructor(props){
        super(props)
        this.state={    
          dialogVisible:false
        }
    }
    onHide() {
      this.props.closeDialog()
    }
    renderFooter(nameL, nameR) {
      let {leftAction,rightAction}=this.props
      return (
        <div>
          <Button
            label={nameL}
            icon="pi pi-times"
            onClick={() => {
              if(leftAction){
                leftAction()
              }
              this.onHide();
            }}
            className="p-button-text"
          />
          <Button
            label={nameR}
            icon="pi pi-check"
            onClick={() =>{
              rightAction();
              this.onHide();

            }}
          
            autoFocus
          />
        </div>
      );
    }
      
    render() {
        let{header,btLeft,btRight,content,isOpen}=this.props
        return (
          <Dialog
          header={header}
          visible={isOpen}
          modal
          style={{ width: "350px" }}
          footer={this.renderFooter(btLeft, btRight)}
          onHide={() => this.onHide("displayConfirmation")}
          >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>{content?content:"Không nhận được data từ props"}</span>
          </div>
        </Dialog>
        )
    }
}
export default withRouter(ConfirmationDialog)