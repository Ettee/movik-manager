import React, { Component } from 'react';
import { Button } from 'primereact/button';
import * as localStoreServs from "../services/accessToLocalStore";
import {withRouter} from "react-router-dom";
import DialogCustom from "../components/shared/dialog";
class Header extends Component {
    constructor(props){
        super(props)
        this.state={
            dialogState:false
        }
    }
    popUpSidebar=()=>{
        this.props.setVisibleSidebar(!this.props.visibleStatus)
    }
    openDialog=()=>{
        this.setState({
            dialogState:true
        })
    }
    logOut=()=>{
        localStoreServs.removeAdminDataFromLocalStore();
        this.props.history.push("/login");
    }

    render() {
        console.log(this.state.dialogState)
        return (
          <div className="header">
            <DialogCustom
              header="Xác nhận đăng xuất"
              content="Bạn sẽ được chuyển về trang đăng nhập"
              btLeft="Hủy"
              btRight="Xác nhận"
              position="center"
              openDialog={this.state.dialogState}
              btRightAction={this.logOut}
            />
            <div className="header_row_left">
              <div className="header_row_left_logo">Movik Manager</div>
              <div className="header_row_left_menu">
                <Button
                  icon="pi pi-bars"
                  className="p-button-rounded p-button-outlined"
                  onClick={this.popUpSidebar}
                  tooltip="Side menu nhưng chưa biết cho gì vào"
                  tooltipOptions={{ position: "bottom" }}
                />
                <Button
                  icon="pi pi-home"
                  className="p-button-rounded p-button-info p-button-outlined"
                  tooltip="Movik"
                  tooltipOptions={{ position: "bottom" }}
                />
                <Button
                  icon="pi pi-id-card"
                  className="p-button-rounded p-button-info p-button-outlined"
                  tooltip="Quản lý người dùng"
                  tooltipOptions={{ position: "bottom" }}
                />
                <Button
                  icon="pi pi-caret-right"
                  className="p-button-rounded p-button-secondary p-button-outlined"
                  tooltip="Quản lý phim"
                  tooltipOptions={{ position: "bottom" }}
                />
                <Button
                  icon="pi pi-calendar-plus"
                  className="p-button-rounded p-button-success p-button-outlined"
                  tooltip="Thêm lịch chiếu"
                  tooltipOptions={{ position: "bottom" }}
                />

                <Button
                  icon="pi pi-sign-out"
                  className="p-button-rounded p-button-danger p-button-outlined"
                  tooltip="Log out"
                  tooltipOptions={{ position: "bottom" }}
                  onClick={this.openDialog}
                />
              </div>
            </div>
            <div className="header_row_right">
              <div className="header_row_right_user">Xin chào,anhphong20</div>
            </div>
          </div>
        );
    }
}
export default withRouter(Header)