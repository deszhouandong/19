let loading = {
  open:function () {
    if(document.getElementById("maskCon").style.zIndex=='99999'){
      return
    }
    document.getElementById("maskCon").style.zIndex = '99999'
  },
  close:function () {
    document.getElementById("maskCon").style.zIndex = '-999'
  }
}
export default loading
