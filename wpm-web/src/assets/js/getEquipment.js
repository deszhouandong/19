const getname = function(){
    let name = new ActiveXObject("WScript.Network").UserName?new ActiveXObject("WScript.Network").UserName:'';
    return name;
}
export {getname}