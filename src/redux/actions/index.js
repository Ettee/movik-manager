import Axios from 'axios';
import * as ActionType from "../constants/index";
export const actDangNhap =(user)=>{
    return dispatch=>{
        Axios({
            method:"POST",
            url:"https://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/DangNhap",
            data:user
        })
        .then(rs=>{
            dispatch({
                type:ActionType.DANG_NHAP,
                data:'login_success'
            })
            dispatch({
                type:ActionType.DANG_NHAP_DATA,
                data:rs.data
            })
        })
        .catch(err=>{
            dispatch({
                type:ActionType.DANG_NHAP,
                data:'login_fail'
            })
            dispatch({
                type:ActionType.DANG_NHAP_MESSAGE,
                data:err.response.data
            })

        })
    }
}
export const actChangeLoginStatus=(value)=>{
    return dispatch=>{
        let data='';
        if(value){
            data='login_success'
        }else{
            data='login_fail'
        }
        dispatch({
            type:ActionType.DANG_NHAP,
            data:data
        })
    }
}