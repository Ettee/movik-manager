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
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import 'primeflex/primeflex.css';
import { ProgressBar } from "primereact/progressbar";
//NOTED: GIAO DIỆN CHỈ HỖ TRỢ THẤP NHẤT LÀ 800PX
class UserManagement extends Component {
    constructor(props){
        super(props)
        if(LocalStoreServs.getAdminLoginData()=== null){
            this.props.history.push('/login')
        }
        this.state={
          globalFilter: null,
          loaiNguoiDungSelected:null,
          userSelected:{
            taiKhoan:'',
            hoTen:'',
            matKhau:'',
            email:'',
            maLoaiNguoiDung:'',
            soDt:'',
            maNhom:'GP09'
          },
          userDialog:false,
          isDisableForm:false
        }
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
              <h1>Danh sách người dùng</h1>
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
    handleOnRowClick=(rowData)=>{
      this.setState({
        userSelected:{
          taiKhoan:rowData.taiKhoan,
          hoTen:rowData.hoTen,
          matKhau:rowData.matKhau,
          email:rowData.email,
          maLoaiNguoiDung:rowData.maLoaiNguoiDung,
          soDt:rowData.soDt
        },
        userDialog:true
      })
    }
    actionBodyTemplate=(rowData)=>{
      return (
        <div>
            <Button
              type="button"
              icon="pi pi-user-edit"
              className="action-button edit"
              onClick={()=>{this.handleOnRowClick(rowData)}}
            ></Button>
            <Button
              type="button"
              icon="pi pi-user-minus"
              className="action-button delete"
              onClick={()=>{this.deleteUser(rowData)}}
            ></Button>
        </div>  
      );
    }
    onLoaiNguoiDungFilterChange=(event)=>{
        if(typeof this.dt !== "undefined"){
            this.dt.filter(event.value, "maLoaiNguoiDung", "equals")
            this.setState({ loaiNguoiDungSelected: event.value });
        }
    }
    hideDialog=()=>{
      this.props.closeUpdateUser()
      this.setState({
        userDialog: false
      });
    }
    updateUser=()=>{
      let {userSelected}=this.state
      let adminData= LocalStoreServs.getAdminLoginData()
      let obj={
        taiKhoan:userSelected.taiKhoan,
        hoTen:userSelected.hoTen,
        matKhau:userSelected.matKhau,
        email:userSelected.email,
        maLoaiNguoiDung:userSelected.maLoaiNguoiDung,
        soDt:userSelected.soDt,
        maNhom:'GP09'
      }
      this.setState({
        isDisableForm:true
      })
      // console.log(obj)
      this.waitForUpdateStatus()
      this.props.updateUser(obj,adminData.accessToken)

    }
    deleteUser=(rowData)=>{
      let adminData=LocalStoreServs.getAdminLoginData()
      // console.log(rowData.taiKhoan,adminData.accessToken)
      this.props.deleteUser(rowData.taiKhoan,adminData.accessToken)
      this.waitForDeleteStatus()
    }
    waitForDeleteStatus=()=>{
      let IntervalID=setInterval(()=>{
        if(this.props.deleteUserStatus==="deleteUser_success"){
          this.props.getListAllUser()
          this.toast.show({severity: 'success', summary: 'Xóa tài khoản thành công'});
          clearInterval(IntervalID)
        }else{
          if(this.props.deleteUserStatus==="deleteUser_fail"){
            let message= this.props.deleteUserMessage
            this.toast.show({severity: 'error', summary: 'Xóa tài khoản thất bại',detail:message});
            clearInterval(IntervalID)
          }
        }
      },500)
    }
    waitForUpdateStatus=()=>{
      let IntervalID=setInterval(()=>{
        if(this.props.updateUserStatus==="updateUser_success"){
          this.props.getListAllUser()
          this.toast.show({severity: 'success', summary: 'Cập nhật tài khoản thành công'});
          this.setState({
            isDisableForm:false
          })
          this.hideDialog()
          clearInterval(IntervalID)
        }else{
          if(this.props.updateUserStatus==="updateUser_fail"){
            this.toast.show({severity: 'error', summary: 'Cập nhật tài khoản thất bại'});
            this.setState({
              isDisableForm:false
            })
            clearInterval(IntervalID)
          }
        }
      },500)
    }
    handleOnChangeUpdateInput=(e)=>{
      let{name,value}=e.target
      this.setState({
        userSelected:{...this.state.userSelected,[name]:value}
      })
    }
    render() {
        let {listAllUser}=this.props;
        const header=this.renderHeader();
        const loaiNguoiDungFilter=this.renderLoaiNguoDungFilter();
        const userDialogFooter = (
          <Fragment>
              <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.hideDialog} />
              <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.updateUser} />
          </Fragment>
      );
      // console.log(this.props.deleteUserMessage)
        return (
          <div className="user_manager_page">
            <Toast ref={(el) => this.toast = el} />
            <DataTable
              ref={(el) => (this.dt = el)}
              value={listAllUser}
              header={header}
              className="p-datatable-users"
              dataKey="id"
              rowHover
              // selection={this.state.userSelected}
              // onSelectionChange={e => this.setState({userSelected: e.value})}
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
                header="Tác vụ"
                body={this.actionBodyTemplate}
                headerStyle={{ width: "8em", textAlign: "center" }}
                bodyStyle={{ textAlign: "center", overflow: "visible" }}
              />
            </DataTable>

            <Dialog
              visible={this.state.userDialog}
              style={{ width: "500px" }}
              header="Thông tin tài khoản"
              modal
              className="p-fluid"
              footer={userDialogFooter}
              onHide={this.hideDialog}
            >
              <div className="user_update_dialog_input p-fluid">
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="taiKhoan"
                      name="taiKhoan"
                      value={this.state.userSelected.taiKhoan}
                      disabled
                      
                    />
                    <label htmlFor="taiKhoan">Tài khoản</label>
                  </span>
                </div>
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="hoTen"
                      name="hoTen"
                      autoComplete="off"
                      disabled={this.state.isDisableForm}
                      value={this.state.userSelected.hoTen}
                      onChange={(e) => {this.handleOnChangeUpdateInput(e)}}
                    />
                    <label htmlFor="hoTen">Họ tên</label>
                  </span>
                </div>
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="matKhau"
                      name="matKhau"
                      autoComplete="off"
                      disabled={this.state.isDisableForm}
                      value={this.state.userSelected.matKhau}
                      onChange={(e) => {this.handleOnChangeUpdateInput(e)}}
                    />
                    <label htmlFor="matKhau">Mật khẩu</label>
                  </span>
                </div>
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="email"
                      name="email"
                      autoComplete="off"
                      disabled={this.state.isDisableForm}
                      value={this.state.userSelected.email}
                      onChange={(e) => {this.handleOnChangeUpdateInput(e)}}
                    />
                    <label htmlFor="email">Email</label>
                  </span>
                </div>
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="soDt"
                      name="soDt"
                      autoComplete="off"
                      disabled={this.state.isDisableForm}
                      value={this.state.userSelected.soDt}
                      onChange={(e) => {this.handleOnChangeUpdateInput(e)}}
                    />
                    <label htmlFor="soDt">Số điện thoại</label>
                  </span>
                </div>
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="maLoaiNguoiDung"
                      name="maLoaiNguoiDung"
                      autoComplete="off"
                      value={this.state.userSelected.maLoaiNguoiDung}
                      disabled
                    />
                    <label htmlFor="maLoaiNguoiDung">Loại người dùng</label>
                  </span>
                </div>
              </div>
            </Dialog>
          </div>
        );
    }
}
const mapStateToProps=(state)=>{
    return {
        listAllUser:state.adminReducer.listAllUser,
        updateUserStatus:state.adminReducer.updateUserStatus,
        deleteUserStatus:state.adminReducer.deleteUserStatus,
        deleteUserMessage:state.adminReducer.deleteUserMessage,
    }
}
const mapDispatchToProps=(dispatch)=>{
    return {
        getListAllUser:()=>{
            dispatch(action.actGetListAllUser())
        },
        updateUser:(obj,token)=>{
          dispatch(action.actUpdateUser(obj,token))
        },
        closeUpdateUser:()=>{
          dispatch(action.actCloseUpdateUser())
        },
        deleteUser:(taiKhoan,token)=>{
          dispatch(action.actDeleteUser(taiKhoan,token))
        }
    }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(UserManagement))
