import React, { Component } from 'react'
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from "primereact/progressbar";
import { InputText } from "primereact/inputtext";
export default class EditDialog extends Component {
    render() {
        return (
            <Dialog
              visible={this.props.visible}
              style={{ width: "500px" }}
              header="Thông tin tài khoản"
              modal
              className="p-fluid"
              footer={this.props.footer}
              onHide={this.props.onHide}
            >
              <div className="user_update_dialog_input p-fluid">
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} className={this.props.isHideProgressBar?"hide-progress-bar":""} />
                <div className="p-field">
                  <span className="p-float-label">
                    <InputText
                      id="taiKhoan"
                      name="taiKhoan"
                      value={this.props.taiKhoanValue}
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
                      disabled={this.props.isDisableForm}
                      value={this.props.hoTenValue}
                      onChange={(e) => {
                        this.props.handleOnChangeUpdateInput(e);
                      }}
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
                      disabled={this.props.isDisableForm}
                      value={this.props.matKhauValue}
                      onChange={(e) => {
                        this.props.handleOnChangeUpdateInput(e);
                      }}
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
                      disabled={this.props.isDisableForm}
                      value={this.props.emailValue}
                      onChange={(e) => {
                        this.handleOnChangeUpdateInput(e);
                      }}
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
                      disabled={this.props.isDisableForm}
                      value={this.props.soDtValue}
                      onChange={(e) => {
                        this.handleOnChangeUpdateInput(e);
                      }}
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
                      value={this.props.maLoaiNguoiDungValue}
                      disabled
                    />
                    <label htmlFor="maLoaiNguoiDung">Loại người dùng</label>
                  </span>
                </div>
              </div>
            </Dialog>
        )
    }
}
