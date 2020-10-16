export const saveDataToLocalStore=(name,value)=>{
    let valueJSON= JSON.stringify(value)
    localStorage.setItem(name,valueJSON)
}
export const getDataFromLocalStore=(name)=>{
    let data= JSON.parse(localStorage.getItem(name))
    return data
}