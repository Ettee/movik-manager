import * as ActionType from "../constants"
let initialState={
    loginStatus:'waiting',
    loginMessage:'',
    loginData:{},
    listAllUser:[],
    updateUserStatus:'',
    deleteUserStatus:'',
    deleteUserMessage:''
}
const adminReducer=(state=initialState,action)=>{
    switch(action.type){
        case ActionType.DANG_NHAP:
            state.loginStatus=action.data;
            return {...state}
        case ActionType.DANG_NHAP_MESSAGE:
            state.loginMessage=action.data;
            return {...state}
        case ActionType.DANG_NHAP_DATA:
            state.loginData=action.data
            return {...state}
        case ActionType.GET_LIST_ALL_USER:
            state.listAllUser=action.data
            return {...state}
        case ActionType.UPDATE_USER:
            state.updateUserStatus=action.data;
            return {...state}
        case ActionType.DELETE_USER:
            state.deleteUserStatus=action.data;
            return {...state}
        case ActionType.DELETE_USER_MESSAGE:
            state.deleteUserMessage=action.data;
            return {...state}
        default:
            return {...state}
    }
}
export default adminReducer;