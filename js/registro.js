let usersList;
let usersListRecovered = [];
let userNameList = [];
let answers = ['Ya existe un usuario con ese nombre de usuario',
                'Las contraseñas no coinciden',
                'Hay campos vacios']
class User{
    constructor(userName,email,password){
        this.userName = userName;
        this.email = email;
        this.password = password;
    }
}


document.getElementById('register-btn').addEventListener('click',function(e){
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value.toLowerCase();
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    e.preventDefault();
    usersList = JSON.parse(localStorage.getItem('userList')) || [];
    usersListRecovered = JSON.parse(localStorage.getItem('userList')) || [];
    usersListRecovered = usersListRecovered.map(user => JSON.parse(user)) || [];
    userNameList = usersListRecovered.map(user => user.userName) || [];
    ! userNameList.includes(username) || swal({title: 'Error',
                                               text:answers[0],
                                                icon:'error'});
    password == confirmPassword || swal({title: 'Error',
                                        text:answers[1],
                                        icon:'error'});
    (username != '' && password != '' && email != '' && confirmPassword != '')|| swal({title: 'Error',
                                                                                       text:answers[1],
                                                                                       icon:'error'});
    if(! userNameList.includes(username) && password == confirmPassword  && (username != '' && password != '' && confirmPassword != '' && email != '')){
        let user = new User(username,email,password);
        usersList.push(JSON.stringify(user));
        localStorage.setItem('userList',JSON.stringify(usersList));
        document.getElementById('register-form').reset();
        window.location.href = '../pages/iniciar-sesion.html';
    }
})