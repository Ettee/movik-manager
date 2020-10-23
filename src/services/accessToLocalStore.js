export const saveDataToLocalStore=(name,value)=>{
    let valueJSON= JSON.stringify(value)
    localStorage.setItem(name,valueJSON)
}
export const getDataFromLocalStore=(name)=>{
    let data= JSON.parse(localStorage.getItem(name))
    if(data){
        return data
    }
    return null
}
export const removeItemFromLocalStore=(name)=>{
    localStorage.removeItem(name)
}
export const getAdminLoginData=()=>{
    
    let data =JSON.parse(localStorage.getItem("adminData"))
    if(data){
        return data
    }
    return null;
}
export const saveAdminLoginData=(data)=>{
    localStorage.setItem("adminData",JSON.stringify(data))
}
export const removeAdminDataFromLocalStore=()=>{
    localStorage.removeItem("adminData")
}