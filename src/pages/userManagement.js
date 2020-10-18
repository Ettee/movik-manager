import React, { Component,Fragment } from 'react'
import * as LocalStoreServs from "../services/accessToLocalStore";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";
import * as action from "../redux/actions";
import 'primeflex/primeflex.css';
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import classNames from 'classnames';
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { ProgressBar } from "primereact/progressbar";
class UserManagement extends Component {
    constructor(props){
        super(props)
        if(LocalStoreServs.getAdminLoginData()=== null){
            this.props.history.push('/login')
        }
        this.state={
            globalFilter: null,
            loaiNguoiDungSelected:null
        }
      //cần dòng này để this.dt (ref đến dataTable) hoạt động
      this.onLoaiNguoiDungFilterChange = this.onLoaiNguoiDungFilterChange.bind(this);
    }
    
    loaiNguoiDung=[
        "KhachHang",
        "QuanTri"
    ]
    componentDidMount(){
        this.props.getListAllUser()
    }
    renderHeader=()=>{
        return (
            <div className="table-header">
              Danh sách người dùng
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  type="search"
                  onInput={(e) => this.setState({ globalFilter: e.target.value })}
                  placeholder="Tìm kiếm người dùng"
                />
              </span>
            </div>
          );
    }
    taiKhoanBodyTemplate=(rowData)=>{
        return (
            <Fragment>
              <span className="p-column-title p-custom-responsive">Tài khoản</span>
              {rowData.taiKhoan}
            </Fragment>
        );
    }
    hoTenBodyTemplate=(rowData)=>{
        return (
            <Fragment>
              <span className="p-column-title p-custom-responsive">Họ tên</span>
              {rowData.hoTen}
            </Fragment>
        );
    }
    emailBodyTemplate=(rowData)=>{
        return (
            <Fragment>
              <span className="p-column-title p-custom-responsive">Email</span>
              {rowData.email}
            </Fragment>
        );
    }
    phoneNumberBodyTemplate=(rowData)=>{
        return(
            <Fragment>
                <span className="p-column-title p-custom-responsive">Số điện thoại</span>
                {rowData.soDt}
            </Fragment>
        )
    }
    passwordBodyTemplate=(rowData)=>{
        return(
            <Fragment>
                <span className="p-column-title p-custom-responsive">Mật khẩu</span>
                {rowData.matKhau}
            </Fragment>
        )
    }
    loaiNguoiDungBodyTemplate=(rowData)=>{
        return(
            <Fragment>
                <span className="p-column-title p-custom-responsive">Loại người dùng</span>
                <span className={rowData.maLoaiNguoiDung==="QuanTri" ? "custom-badge-QuanTri":"custom-badge-KhachHang"}>{rowData.maLoaiNguoiDung}</span>   
            </Fragment>
        )
    }
    renderLoaiNguoDungFilter=()=>{
        return (
            <Dropdown
              value={this.state.loaiNguoiDungSelected}
              options={this.loaiNguoiDung}
              onChange={this.onLoaiNguoiDungFilterChange}
              itemTemplate={this.loaiNguoiDungItemTemplate}
              showClear
              placeholder="Chọn loại người dùng"
              className="p-column-filter"
            />
        );
    }

    loaiNguoiDungItemTemplate(option) {
      return (
        <span className={"custom-badge-"+option}>
          {option}
        </span>
      );
  }
    actionBodyTemplate() {
        return (
          <Button
            type="button"
            icon="pi pi-cog"
            className="p-button-secondary"
          ></Button>
        );
    }
    
    onLoaiNguoiDungFilterChange(event) {
        if(typeof this.dt !== "undefined"){
            this.dt.filter(event.value, "maLoaiNguoiDung", "equals")
            this.setState({ loaiNguoiDungSelected: event.value });
        }else{
            console.log(event.value,this.dt)
        }
    }
    
    render() {
        let {listAllUser}=this.props;
        console.log(listAllUser);
        const header=this.renderHeader();
        const loaiNguoiDungFilter=this.renderLoaiNguoDungFilter();
        return (
          <div className="user_manager_page">
            <DataTable
              ref={(el) => (this.dt=el)}
              value={listAllUser}
              header={header}
              className="p-datatable-users"
              dataKey="id"
              rowHover
              globalFilter={this.state.globalFilter}
              paginator
              rows={10}
              emptyMessage="Không tìm thấy người dùng"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              rowsPerPageOptions={[10, 25, 50]}
            >
              <Column
                field="taiKhoan"
                header="Tài khoản"
                body={this.taiKhoanBodyTemplate}
                sortable
                filter
                filterMatchMode="contains"
                filterPlaceholder="Tìm theo tài khoản"
              />
              <Column
                // sortField="country.name"
                // filterField="country.name"
                field="hoTen"
                header="Họ tên"
                body={this.hoTenBodyTemplate}
                sortable
                filter
                filterMatchMode="contains"
                filterPlaceholder="Tìm theo tên"
              />
              <Column
                // sortField="representative.name"
                // filterField="representative.name"
                field="email"
                header="Email"
                body={this.emailBodyTemplate}
                sortable
                filter
                filterMatchMode="contains"
                filterPlaceholder="Tìm theo email"
              />
              <Column
                field="soDt"
                header="Số điện thoại"
                body={this.phoneNumberBodyTemplate}
                sortable
                filter
                filterMatchMode="contains"
                filterPlaceholder="Tìm theo số điện thoại"
              />
              <Column
                field="matKhau"
                header="Mật Khẩu"
                body={this.passwordBodyTemplate}
                sortable
                filter
                filterMatchMode="contains"
                filterPlaceholder="Tìm theo mật khẩu"
              />
              <Column
                field="maLoaiNguoiDung"
                header="Loại người dùng"
                body={this.loaiNguoiDungBodyTemplate}
                sortable
                filter
                filterElement={loaiNguoiDungFilter}
              />
              <Column
                body={this.actionBodyTemplate}
                headerStyle={{ width: "8em", textAlign: "center" }}
                bodyStyle={{ textAlign: "center", overflow: "visible" }}
              />
            </DataTable>
          </div>
        );
    }
}
const mapStateToProps=(state)=>{
    return {
        listAllUser:state.adminReducer.listAllUser
    }
}
const mapDispatchToProps=(dispatch)=>{
    return {
        getListAllUser:()=>{
            dispatch(action.actGetListAllUser())
        }
    }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(UserManagement))
