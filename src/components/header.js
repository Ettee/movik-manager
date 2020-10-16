import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
export default class Header extends Component {
    
    popUpSidebar=()=>{
        this.props.setVisibleSidebar(!this.props.visibleStatus)
    }

    render() {
        return (
            <div className="header">
                <div className="header_row_left">
                    <div className="header_row_left_logo">
                        Movik Manager
                    </div>
                    <div className="header_row_left_menu">
                        <Button 
                            icon="pi pi-bars" 
                            className="p-button-rounded p-button-outlined" 
                            onClick={this.popUpSidebar}
                            tooltip="Side menu nhưng chưa biết cho gì vào" tooltipOptions={{position: 'bottom'}}
                        />
                        <Button 
                            icon="pi pi-home" 
                            className="p-button-rounded p-button-info p-button-outlined"
                            tooltip="Movik" tooltipOptions={{position: 'bottom'}}
                        />
                        <Button 
                            icon="pi pi-id-card" 
                            className="p-button-rounded p-button-info p-button-outlined" 
                            tooltip="Quản lý người dùng" tooltipOptions={{position: 'bottom'}}
                        />
                        <Button 
                            icon="pi pi-caret-right" 
                            className="p-button-rounded p-button-secondary p-button-outlined" 
                            tooltip="Quản lý phim" tooltipOptions={{position: 'bottom'}}
                        />
                        <Button 
                            icon="pi pi-calendar-plus" 
                            className="p-button-rounded p-button-success p-button-outlined" 
                            tooltip="Thêm lịch chiếu" tooltipOptions={{position: 'bottom'}}
                        />
                        
                        <Button 
                            icon="pi pi-sign-out" 
                            className="p-button-rounded p-button-danger p-button-outlined" 
                            tooltip="Log out" tooltipOptions={{position: 'bottom'}}
                        />
                        
                    </div>
                    
                </div>
                <div className="header_row_right">
                    <div className="header_row_right_user">
                        Xin chào,anhphong20
                    </div>
                </div>
            </div>
        )
    }
}
