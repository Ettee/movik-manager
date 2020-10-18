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
export const actGetListAllUser=()=>{
    return dispatch=>{
        Axios({
            method:"GET",
            url:"https://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP09"
        })
        .then(res=>{
            dispatch({
                type:ActionType.GET_LIST_ALL_USER,
                data:res.data
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }
}
export const actUpdateUser=(obj,token)=>{
    return dispatch=>{
        Axios({
            method:"PUT",
            url:"https://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
            data:obj,
            headers:{
                Authorization:`Bearer ${token}`
                
            }
        }).then(rs=>{
            dispatch({
                type:ActionType.UPDATE_USER,
                data:'updateUser_success'
            })
        }).catch((err)=>{
            console.log(err)
            dispatch({
                type:ActionType.UPDATE_USER,
                data:'updateUser_fail'
            })
        })
    }
}
export const actCloseUpdateUser=()=>{
    return dispatch=>{
        dispatch({
            type:ActionType.UPDATE_USER,
            data:''
        })
    }
}
export const actDeleteUser=(taiKhoan,token)=>{
    return dispatch=>{
        Axios({
            method:"DELETE",
            url:`https://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`,
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then((rs)=>{
            dispatch({
                type:ActionType.DELETE_USER,
                data:"deleteUser_success"
            })
        })
        .catch(err=>{
            console.log(err)
            dispatch({
                type:ActionType.DELETE_USER,
                data:"deleteUser_fail"
            })
            dispatch({
                type:ActionType.DELETE_USER_MESSAGE,
                data:err.response.data
            })
        })
    }
}