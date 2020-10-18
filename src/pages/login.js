import React, { Component } from 'react'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Lottie from "react-lottie";
import loginLottieData from "../assets/lottie_json/login.json";
import { connect } from "react-redux";
import * as action from "../redux/actions/index";
import {withRouter} from "react-router-dom";
import * as localStoreServices from "../services/accessToLocalStore";
class Login extends Component {
    constructor(props){
      super(props)
      this.state={
          userName:'',
          password:'',
          passwordVisibility:false,
          userNameValid:true,
          passwordValid:true,
          spinnerState:false
          
      }
    }
    handlePasswordVisibility=()=>{
        this.setState({
            passwordVisibility:!this.state.passwordVisibility
        })
    }
    handleOnChange=(e)=>{
      let {name,value}=e.target;
      this.setState({
        [name]:value
      })
    }
    handleDangNhap=()=>{
      if(this.state.userName !== "" && this.state.password !== ""){
        let user={
          taiKhoan:this.state.userName,
          matKhau:this.state.password
        }
        this.props.dangNhap(user)
        this.waitForLoginStatus()
      }else{
        this.toast.show({severity: 'warn', summary: 'Chưa nhập thông tin đăng nhập ', detail: 'Hãy hoàn thành form đăng nhập', life: 2000});
      }
    }
    waitForLoginStatus=()=>{
      let loginInterVal=setInterval(()=>{
        if(this.props.loginStatus==="login_success"){
          if(this.props.loginData.maLoaiNguoiDung==="QuanTri"){
            localStoreServices.saveAdminLoginData(this.props.loginData)
            this.toast.show({severity: 'success', summary: 'Đăng nhập thành công', detail: 'Đang chuyển đến Movik Manager', life: 3000});
            this.setState({
              spinnerState:true
            })
            clearInterval(loginInterVal)
            setTimeout(()=>{
              this.redirect()
            },3000)
          }else{
            this.props.changeLoginStatus(false)
            this.toast.show({severity: 'error', summary: 'Đăng nhập thất bại', detail: 'Tài khoản người dùng không thể truy cập', life: 3000});
          }
          
        }else{
          if(this.props.loginStatus==="login_fail"){
            let message=this.props.loginMessage;
            this.toast.show({severity: 'error', summary: 'Đăng nhập thất bại', detail: message, life: 3000});
            clearInterval(loginInterVal)
          }
        }
      },500)
    }
    redirect=()=>{
      this.props.history.push("/")
    }
    inputValidator=(e)=>{
      let {name,value}=e.target
      switch (name) {
        case "userName":
          if(value === "" ){
            this.setState({
              userNameValid:false
            })
          }else{
            this.setState({
              userNameValid:true
            })
          }
          break;
        case "password":
          if(value === "" ){
            this.setState({
              passwordValid:false
            })
          }else{
            this.setState({
              passwordValid:true
            })
          }
          break;
        default:
          break;
      }
    }
    render() {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: loginLottieData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          };
        
        return (
          <div className="login_page">
            <Toast ref={(el) => this.toast = el} />
            <div className="login_animation-bg">
              <Lottie options={defaultOptions} speed={1} />
              <div className="login_content">
                <div className="login_header">Movik Manager <br/><span className="p-text-light " style={{fontSize:"25px"}}>Let's manage Movik</span></div>
                <div className="login_box">
                  <div className="login_box_content">
                    <div className="login_box_title">
                      Welcome <br /> back
                    </div>
                    <div className="login_box_input">
                      <div className="input_box">
                        <span className="p-float-label">
                          <InputText
                            type="text"
                            id="userName"
                            name="userName"
                            value={this.state.userName}
                            onChange={this.handleOnChange}
                            autoComplete="off"
                            onBlur={this.inputValidator}
                            aria-describedby="username-help" 
                          />
                          <label htmlFor="userName">Tài khoản</label> 
                        </span>
                        <small id="username-help" className={!this.state.userNameValid?"input_validator_mess":"hidden"} >*Bạn chưa nhập tài khoản.</small>
                      </div>
                      <div className="input_box">
                        <span className="p-float-label">
                          <InputText
                            type={
                              this.state.passwordVisibility
                                ? "text"
                                : "password"
                            }
                            name="password"
                            id="password"
                            value={this.state.password}
                            onChange={this.handleOnChange}
                            onBlur={this.inputValidator}
                            aria-describedby="password-help"
                          />
                          <label htmlFor="password">Mật khẩu</label>
                          
                        </span>
                        <span className="password_visibility">
                          <i
                            className={
                              this.state.passwordVisibility
                                ? "pi pi-eye"
                                : "pi pi-eye-slash"
                            }
                            onClick={this.handlePasswordVisibility}
                          />
                        </span>
                        <small id="password-help" className={!this.state.passwordValid?"input_validator_mess":"hidden"} >*Bạn chưa nhập password.</small>
                      </div>
                      <div className={this.state.spinnerState?"login_spinner":"login_spinner hide_spinner"}>
                        <i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>
                      </div>
                      <Button
                        label={this.state.spinnerState?"Đang chuyển hướng...":"Đăng nhập"}
                        disabled={this.state.spinnerState}
                        className="p-button-rounded gradient-button"
                        onClick={this.handleDangNhap}
                      />
                    </div>
                    <div className="login_contact">
                      <div>Need helps ? Contact me </div>
                      <i
                        className="pi pi-facebook"
                        style={{ fontSize: "1.3em" }}
                      ></i>
                      <i
                        className="pi pi-github"
                        style={{ fontSize: "1.3em" }}
                      ></i>
                      <i
                        className="pi pi-twitter"
                        style={{ fontSize: "1.3em" }}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
const mapStateToProps=(state)=>{
  return{
    loginStatus:state.adminReducer.loginStatus,
    loginMessage:state.adminReducer.loginMessage,
    loginData:state.adminReducer.loginData
  }

}
const mapDispatchToProps=(dispatch)=>{
  return{
    dangNhap:(user)=>{
      dispatch(action.actDangNhap(user))
    },
    changeLoginStatus:(boolean)=>{
      dispatch(action.actChangeLoginStatus(boolean))
    }

  }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Login))