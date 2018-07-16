document.addEventListener('DOMContentLoaded', function() {
    if(localStorage.getItem("Token")===null){
        window.location.href='login.html';
    }else{
        window.location.href='dashboard.html';
    }
})