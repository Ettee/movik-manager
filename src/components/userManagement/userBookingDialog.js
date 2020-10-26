import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import moment from 'moment';
import "moment/locale/vi"; 
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primeflex/primeflex.css';
export default class UserBookingDialog extends Component {
    
    renderTable=()=>{
        let bookObj={};
        let thongTinDatVe=[];
        console.log(this.props.thongTinDatVe)
        if( Object.keys(this.props.thongTinDatVe).length>0 ){
            this.props.thongTinDatVe.thongTinDatVe.map((item)=>{
                bookObj={
                    maVe:item.maVe,
                    tenPhim:item.tenPhim,
                    ngayDat:moment(item.ngayDat).format("llll"),
                    soLuongGhe:item.danhSachGhe.length
                }
                thongTinDatVe.push(bookObj)
            })
            console.log(thongTinDatVe)
            if(thongTinDatVe.length>0){
                return(
                    <DataTable
                      value={thongTinDatVe}
                      paginator
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      rows={5}
                      rowsPerPageOptions={[5, 10, 15]}
                    >
                      <Column field="maVe" header="Mã vé"></Column>
                      <Column field="tenPhim" header="Tên phim"></Column>
                      <Column field="ngayDat" header="Ngày đặt"></Column>
                      <Column field="soLuongGhe" header="Số lượng ghế"></Column>
                    </DataTable>
              )
            }else{
                
                return(
                    <div className="p-text-center p-text-uppercase p-text-normal">
                        Người dùng chưa mua vé
                    </div>
                )
            }
            
        }else{
            return(
                <div className="p-d-flex p-jc-center">
                    <ProgressSpinner/>
                </div>
            )
        }
    }
    render() {
        
        return (
        
        <div>
            {this.renderTable()}
        </div>
        );
    }
}
