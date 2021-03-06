import React, { Component,Fragment } from 'react'
import * as LocalStoreServs from "../services/accessToLocalStore";
import EditDialog from "../components/userManagement/editDialog";
import UserBookingDialog from "../components/userManagement/userBookingDialog";
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
import { Toolbar } from 'primereact/toolbar';
import {Password} from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';
import 'primeflex/primeflex.css';
import ConfirmationDialog from "../components/shared/confirmationDialog"
import { ProgressBar } from "primereact/progressbar";
import firebase from "../fire"
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
          newUser:{
            taiKhoan:'',
            hoTen:'',
            matKhau:'',
            email:'',
            maLoaiNguoiDung:'',
            soDt:'',
            maNhom:'GP09'
          },
          userDialog:false,
          isDisableForm:false,
          addNewDialog:false,
          taiKhoanValidator:true,
          hoTenValidator:true,
          emailValidator:true,
          maLoaiNguoiDungValidator:true,
          soDtValidator:true,
          matKhauValidator:true,
          isDeleteDialogOpen:false,
          rowData:null,
          isHideProgressBar:true,
          emailValidatorMessage:'',
          phoneNumberValidatorMessage:'',
          matKhauValidatorMessage:'',
          isRefreshing:false,
          taiKhoanSelectedForDetailView:null,
          detailUserBookingDialog:false
        }
    }
    
    loaiNguoiDung=[
        "KhachHang",
        "QuanTri"
    ]
    componentDidMount(){
        this.props.getListAllUser()
    }

    //render template
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
    rightToolbarTemplate=()=>{
      return (
        <Fragment>
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success p-mr-2"
            onClick={this.openAddUserDialog}
          />
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            className="p-button-primary p-mr-2"
            onClick={this.handleRefresh}
          />
        </Fragment>
      );
    }
    loaiNguoiDungBodyTemplate=(rowData)=>{
        return(
            <Fragment>
                <span className="p-column-title p-custom-responsive">Loại người dùng</span>
                <span className={rowData.maLoaiNguoiDung==="QuanTri" ? "custom-badge-QuanTri":"custom-badge-KhachHang"}>{rowData.maLoaiNguoiDung.toUpperCase()}</span>   
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
    actionBodyTemplate=(rowData)=>{
      return (
        <div>
          <Button
              type="button"
              icon="pi pi-th-large"
              className="action-button detail"
              onClick={() => {this.handleOnRowClick(rowData)}}
            ></Button>
            <Button
              type="button"
              icon="pi pi-user-edit"
              className="action-button edit"
              onClick={()=>{this.handleOnEditClick(rowData)}}
            ></Button>
            <Button
              type="button"
              icon="pi pi-user-minus"
              className="action-button delete"
              onClick={()=>{this.openDeleteDialog(rowData)}}
            ></Button>
        </div>  
      );
    }
    renderUserBookingDataTable=()=>{
        return(
          <UserBookingDialog
            thongTinDatVe={this.props.userBookingData}
          />
        )
    }


    //tác vụ chính
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
        isDisableForm:true,
        isHideProgressBar:false
      })
      // console.log(obj)
      this.waitForUpdateStatus()
      this.props.updateUser(obj,adminData.accessToken)

    }
    deleteUser=()=>{
      if(this.state.rowData!== null){
        let adminData=LocalStoreServs.getAdminLoginData()
        // console.log(rowData.taiKhoan,adminData.accessToken)
        this.props.deleteUser(this.state.rowData.taiKhoan,adminData.accessToken)
        this.waitForDeleteStatus()
      } 
    }
    handleAddUserClick=(event)=>{
      this.inputValidator()
      this.setState({
        isDisableForm:true
      })
      setTimeout(()=>{
        let {taiKhoanValidator,matKhauValidator,emailValidator,hoTenValidator,soDtValidator,maLoaiNguoiDungValidator}=this.state
        let validator=taiKhoanValidator && matKhauValidator && emailValidator && hoTenValidator && soDtValidator && maLoaiNguoiDungValidator
        if(validator){
          this.sendOTPCode(event)
        }else{
          this.toast.show({severity: 'error', summary: 'Bạn hãy hoàn thành form đăng kí'});
        }
      },500)
    }
    addUser=()=>{      
      this.setState({
        isHideProgressBar:false
      })
      // console.log(this.state.newUser)
      this.waitForAddUserStatus()
      this.props.addUser(this.state.newUser)
    }
    phoneAuthen=()=>{
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recapcha-container', {
        'size': 'invisible',
        'callback': (response)=> {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          this.sendOTPCode();
        }
      });
    }
    sendOTPCode=(event)=>{
      event.persist();
      this.phoneAuthen()
      var phoneNumber = this.getUserPhoneNumber();
      var appVerifier = window.recaptchaVerifier;
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) =>{
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          var code = window.prompt("Nhập OTP") ;
          confirmationResult
            .confirm(code)
            .then(()=>{
              this.addUser()
            })
            .catch((error)=> {
              // User couldn't sign in (bad verification code?)
              console.log(error)
              this.toast.show({severity: 'error', summary: 'Sai mã otp. Vui lòng lấy lại mã.'});
              this.setState({
                isDisableForm:false
              })
            });
        })
        .catch((error)=>{
          // Error; SMS not sent
          console.log(error)
          this.toast.show({severity: 'error', summary: 'Không gửi được mã otp. Vui lòng lấy lại mã'});
          this.setState({
            isDisableForm:false
          })
        });
    }
    getUserPhoneNumber=()=>{
      let number = this.state.newUser.soDt;
      if(number.length<=0){
        return '+84964366725'
      }
      return "+84"+number.substring(1)
    }
    handleRefresh=()=>{
      this.setState({
        isRefreshing:true
      })
      setTimeout(()=>{
        this.setState({
          isRefreshing:false
        })
      },2000)
    }

    //handle event click, change
    handleOnChangeUpdateInput=(e)=>{
      let{name,value}=e.target
      this.setState({
        userSelected:{...this.state.userSelected,[name]:value}
      })
    }
    handleOnEditClick=(rowData)=>{
      this.openEditUserDialog()
      this.setState({
        userSelected:{
          taiKhoan:rowData.taiKhoan,
          hoTen:rowData.hoTen,
          matKhau:rowData.matKhau,
          email:rowData.email,
          maLoaiNguoiDung:rowData.maLoaiNguoiDung,
          soDt:rowData.soDt
        }
      })
    }
    onLoaiNguoiDungFilterChange=(event)=>{
      if(typeof this.dt !== "undefined"){
          this.dt.filter(event.value, "maLoaiNguoiDung", "equals")
          this.setState({ loaiNguoiDungSelected: event.value });
      }
    }
    handleOnChangeAddNewUser=(e)=>{
      let{name,value}=e.target
      this.inputValidator()
      this.setState({
        newUser:{...this.state.newUser,[name]:value},
      })
    }
    handleRadioButtonLoaiNguoiDung=(event)=>{
      this.setState({
        newUser:{...this.state.newUser,maLoaiNguoiDung:event.value},
        maLoaiNguoiDungValidator:true
      })
      
    }
    handleOnRowClick=(rowData)=>{
      this.setState({taiKhoanSelectedForDetailView: rowData.taiKhoan})
      let obj={
        taiKhoan:rowData.taiKhoan
      }
      this.props.viewUserBooking(obj)
      this.openDetailUserBookingDialog()
    }

    //close dialog
    closeAddUserDialog=()=>{
      this.setState({
        addNewDialog:false,
        newUser:{
          taiKhoan:'',
          hoTen:'',
          matKhau:'',
          email:'',
          maLoaiNguoiDung:'',
          soDt:'',
        },
        taiKhoanValidator:true,
        hoTenValidator:true,
        emailValidator:true,
        maLoaiNguoiDungValidator:true,
        soDtValidator:true,
        matKhauValidator:true,
        isHideProgressBar:true,
        isDisableForm:false
      });
    }
    closeUpdateDialog=()=>{
      this.props.closeUpdateUser()
      this.setState({
        userDialog: false,
        isHideProgressBar:true
      });
    }
    closeDeleteDialog=()=>{
      this.setState({
        isDeleteDialogOpen:false
      })
    }
    closeDetailUserBookingDialog=()=>{
      this.setState({
        detailUserBookingDialog:false
      })
    }

    //open dialog
    openAddUserDialog=()=>{
      this.setState({
        addNewDialog:true
      })
    }
    openDeleteDialog=(rowData)=>{
      this.setState({
        isDeleteDialogOpen:true,
        rowData:rowData
      })
    }
    openEditUserDialog=()=>{
      this.setState({
        userDialog:true
      })
    }
    openDetailUserBookingDialog=()=>{
      this.setState({
        detailUserBookingDialog:true
      })
    }

    //validation
    inputValidator=()=>{
      if(this.state.newUser.taiKhoan===""){
        this.setState({taiKhoanValidator:false})
      }else{
        this.setState({taiKhoanValidator:true})
      }
      if(this.state.newUser.hoTen===""){
        this.setState({hoTenValidator:false})
      }else{
        this.setState({hoTenValidator:true})
      }
      if(this.state.newUser.matKhau===""){
        this.setState({
          matKhauValidator:false,
          matKhauValidatorMessage:"Chưa nhập mật khẩu"
        })
      }else{
        if(this.state.newUser.matKhau.length<8){
          this.setState({
            matKhauValidator:false,
            matKhauValidatorMessage:"Mật khẩu phải có ít nhất 8 kí tự"
          })
        }else{
          this.setState({matKhauValidator:true})
        }
      }
      if(this.state.newUser.email===""){
        this.setState({
          emailValidator:false,
          emailValidatorMessage:"Chưa nhập email"
        })
      }else{
        if(!this.state.newUser.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
          this.setState({
            emailValidator:false,
            emailValidatorMessage:"email không đúng định dạng"
          })
        }else{
          this.setState({emailValidator:true})
        }
      }
      if(this.state.newUser.soDt===""){
        this.setState({
          soDtValidator:false,
          phoneNumberValidatorMessage:"Chưa nhập số điện thoại"
        })
      }else{
        if(!this.state.newUser.soDt.match(/^0[0-9]{9}$/)){
          this.setState({
            soDtValidator:false,
            phoneNumberValidatorMessage:"Số điện thoại không đúng"
          })
        }else{
          this.setState({soDtValidator:true})
        }
      }
      if(this.state.newUser.maLoaiNguoiDung===""){
        this.setState({maLoaiNguoiDungValidator:false})
      }else{
        this.setState({maLoaiNguoiDungValidator:true})
      }

    }
    
    //waiting for status
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
            isDisableForm:false,
            isHideProgressBar:true
          })
          this.closeUpdateDialog()
          clearInterval(IntervalID)
        }else{
          if(this.props.updateUserStatus==="updateUser_fail"){
            this.toast.show({severity: 'error', summary: 'Cập nhật tài khoản thất bại',detail:"Hãy liên hệ với quản trị viên hệ thống"});
            this.setState({
              isDisableForm:false,
              isHideProgressBar:true
            })
            clearInterval(IntervalID)
          }
        }
      },500)
    }
    waitForAddUserStatus=()=>{
      let intervalID=setInterval(() => {
        if(this.props.addUserStatus==="addUSer_success"){
          this.props.getListAllUser()
          this.toast.show({severity: 'success', summary: 'Thêm tài khoản thành công'});
          this.closeAddUserDialog()
          clearInterval(intervalID)
        }else{
          if(this.props.addUserStatus==="addUSer_fail"){
            this.toast.show({severity: 'error', summary: 'Thêm tài khoản thất bại',detail:"Hãy liên hệ với quản trị viên hệ thống"});
            this.closeAddUserDialog()
            clearInterval(intervalID)
          }
        }
      }, 500);
    }

    render() {
        let {listAllUser}=this.props;
        const header=this.renderHeader();
        const loaiNguoiDungFilter=this.renderLoaiNguoDungFilter();
        const editUserDialogFooter = (
          <Fragment>
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={this.closeUpdateDialog}
            />
            <Button
              label="Save"
              icon="pi pi-check"
              className="p-button-text"
              onClick={this.updateUser}
            />
          </Fragment>
        );
        const addUserDialogFooter = (
          <Fragment>
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={this.closeAddUserDialog}
            />
            <Button
              label="Save"
              icon="pi pi-check"
              className="p-button-text"
              onClick={(e)=>{this.handleAddUserClick(e)}}
            />
          </Fragment>
        );
        const detailUserBookingFooter=(
          <Fragment>
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={this.closeDetailUserBookingDialog}
            />
          </Fragment>
        )
      // console.log(this.props.deleteUserMessage)
        return (
          <div className="user_manager_page">
            <ProgressBar mode="indeterminate" style={{ height: '6px' }} className={this.state.isRefreshing?"":"hide-progress-bar"} />
            <ConfirmationDialog
              header="Xác nhận xóa tài khoản"
              content="Bạn có chắn chắn muốn xóa tài khoản này không ?"
              isOpen={this.state.isDeleteDialogOpen}
              btLeft="Hủy"
              btRight="Xác nhận"
              rightAction={this.deleteUser}
              closeDialog={this.closeDeleteDialog}
            />
            <Toast ref={(el) => (this.toast = el)} />
            <div className="card">
              <Toolbar
                className="p-mb-4"
                right={this.rightToolbarTemplate}
              ></Toolbar>
            </div>
            <div className={this.state.isRefreshing?"user_data_table_box refresh_overlay":"user_data_table_box"}>
              <DataTable
                ref={(el) => (this.dt = el)}
                value={listAllUser}
                header={header}
                className="p-datatable-users"
                dataKey="id"
                rowHover
                // onSelectionChange={e => {this.handleOnRowClick(e)}}
                // selectionMode="single"
                globalFilter={this.state.globalFilter}
                paginator
                rows={10}
                emptyMessage="Không tìm thấy người dùng"
                currentPageReportTemplate="Hiển thị từ {first} đến {last} trong tổng {totalRecords} tài khoản"
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
            </div>
            
            {/* Add user dialog */}
            <Dialog
              visible={this.state.addNewDialog}
              style={{ width: "500px" }}
              header="Thêm tài khoản"
              modal
              className="p-fluid add_new_user"
              footer={addUserDialogFooter}
              onHide={this.closeAddUserDialog}
            >
              <div className="user_dialog_input p-fluid">
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} className={this.state.isHideProgressBar?"hide-progress-bar":""} />
                <div id="recapcha-container"></div>
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="taiKhoan"
                      name="taiKhoan"
                      value={this.state.newUser.taiKhoan}
                      autoComplete="off"
                      disabled={this.state.isDisableForm}
                      onChange={(e) => {
                        this.handleOnChangeAddNewUser(e);
                      }}
                      onBlur={this.inputValidator}
                    />
                    <label htmlFor="taiKhoan">Tài khoản<span style={{color:"red"}}>*</span></label>
                  </span>
                  <small className={this.state.taiKhoanValidator?"input_validator hide ":"input_validator  "} style={{color:"red"}}>Chưa nhập tên tài khoản</small>
                </div>
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="hoTen"
                      name="hoTen"
                      autoComplete="off"
                      disabled={this.state.isDisableForm}
                      value={this.state.newUser.hoTen}
                      onChange={(e) => {
                        this.handleOnChangeAddNewUser(e);
                      }}
                      onBlur={this.inputValidator}
                    />
                    <label htmlFor="hoTen">Họ tên<span style={{color:"red"}}>*</span></label>
                  </span>
                  <small className={this.state.hoTenValidator?"input_validator hide ":"input_validator  "} style={{color:"red"}}>Chưa nhập họ tên</small>
                </div>
                <div className="p-field">
                  <small
                    htmlFor="matKhau"
                    style={{
                      paddingLeft: "10px",
                      color: "#6c757d",
                      fontSize: "13px",
                    }}
                  >
                    Mật khẩu<span style={{color:"red"}}>*</span>
                  </small>
                  <Password
                    id="matKhau"
                    name="matKhau"
                    autoComplete="off"
                    disabled={this.state.isDisableForm}
                    value={this.state.newUser.matKhau}
                    onChange={(e) => {
                      this.handleOnChangeAddNewUser(e);
                    }}
                    onBlur={this.inputValidator}
                  />
                  <small className={this.state.matKhauValidator?"input_validator hide ":"input_validator  "} style={{color:"red"}}>{this.state.matKhauValidatorMessage}</small>
                </div>
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="email"
                      name="email"
                      autoComplete="off"
                      disabled={this.state.isDisableForm}
                      value={this.state.newUser.email}
                      onChange={(e) => {
                        this.handleOnChangeAddNewUser(e);
                      }}
                      onBlur={this.inputValidator}
                    />
                    <label htmlFor="email">Email<span style={{color:"red"}}>*</span></label>
                  </span>
                  <small className={this.state.emailValidator?"input_validator hide ":"input_validator  "} style={{color:"red"}}>{this.state.emailValidatorMessage}</small>
                </div>
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="soDt"
                      name="soDt"
                      autoComplete="off"
                      disabled={this.state.isDisableForm}
                      value={this.state.newUser.soDt}
                      onChange={(e) => {
                        this.handleOnChangeAddNewUser(e);
                      }}
                      onBlur={this.inputValidator}
                    />
                    <label htmlFor="soDt">Số điện thoại<span style={{color:"red"}}>*</span></label>
                  </span>
                  <small className={this.state.soDtValidator?"input_validator hide ":"input_validator  "} style={{color:"red"}}>{this.state.phoneNumberValidatorMessage}</small>
                </div>
                <div className="p-field">
                  <div className="p-field-radiobutton">
                    <RadioButton 
                      id="radio_khachHang" 
                      value="KhachHang" 
                      name="maLoaiNguoiDung" 
                      onChange={(e) => this.handleRadioButtonLoaiNguoiDung(e)} 
                      disabled={this.state.isDisableForm}
                      checked={this.state.newUser.maLoaiNguoiDung === 'KhachHang'} 
                    />
                    <label htmlFor="radio_khachHang">Khách hàng</label>
                  </div>
                  <div className="p-field-radiobutton">
                    <RadioButton 
                      id="radio_quanTri" 
                      value="QuanTri" 
                      name="maLoaiNguoiDung" 
                      disabled={this.state.isDisableForm}
                      onChange={(e) => this.handleRadioButtonLoaiNguoiDung(e)} 
                      checked={this.state.newUser.maLoaiNguoiDung === 'QuanTri'} 
                    />
                    <label htmlFor="radio_quanTri">Quản trị</label>
                  </div>
                  <small className={this.state.maLoaiNguoiDungValidator ?"input_validator hide":"input_validator  "} style={{color:"red"}}>Chưa chọn loại người dùng</small>
                </div>
              </div>
            </Dialog>

            {/* Detail user history book dialog */}
            <Dialog
              visible={this.state.detailUserBookingDialog}
              style={{ width: "60vw" }}
              header="Thêm tài khoản"
              modal
              className="p-fluid add_new_user"
              footer={detailUserBookingFooter}
              onHide={this.closeDetailUserBookingDialog}
            >
              {this.renderUserBookingDataTable()}
              
            </Dialog>
            
            {/* Edit user dialog */}
            <EditDialog
              visible={this.state.userDialog}
              footer={editUserDialogFooter}
              onHide={this.closeUpdateDialog}
              isHideProgressBar={this.state.isHideProgressBar}
              isDisableForm={this.state.isDisableForm}
              taiKhoanValue={this.state.userSelected.taiKhoan}
              hoTenValue={this.state.userSelected.hoTen}
              matKhauValue={this.state.userSelected.matKhau}
              emailValue={this.state.userSelected.email}
              soDtValue={this.state.userSelected.soDt}
              maLoaiNguoiDungValue={this.state.userSelected.maLoaiNguoiDung}
              handleOnChangeUpdateInput={this.handleOnChangeUpdateInput}
            />
            
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
        addUserStatus:state.adminReducer.addUserStatus,
        userBookingData:state.adminReducer.userBookingHistory
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
        },
        addUser:(taiKhoan)=>{
          dispatch(action.actAddUser(taiKhoan))
        },
        viewUserBooking:(taiKhoan)=>{
          dispatch(action.actViewUserBookingHistory(taiKhoan))
        }
    }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(UserManagement))
