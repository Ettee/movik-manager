import * as ActionType from "../constants"
let initialState={
    loginStatus:'waiting',
    loginMessage:'',
    loginData:{}
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
        default:
            return {...state}
    }
}
export default adminReducer;