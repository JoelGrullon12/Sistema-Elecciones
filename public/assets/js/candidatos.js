$(document).ready(function(){
    $("input[type='radio']").on("click",e=>{
        $("#btnVotar").removeClass("disabled")
    })
})