async function registerUser(data) {
    let accountInfo = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json());
    
    return accountInfo;
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function ValidatePassword(password) {
    let strings = password;
    let i = 0;
    let character = "";
    let number = false;
    let upper = false;
    let lower = false;
  
    while (i <= strings.length) {
      character = strings.charAt(i);
      if (!isNaN(character * 1)) {
        number = true;
      } else {
        if (character == character.toUpperCase()) {
          upper = true;
        }
        if (character == character.toLowerCase()) {
          lower = true;
        }
      }
      i++;
    }
  
    if (number && upper && lower && strings.length >= 8 && strings.length <= 25)
      return true;
    else return false;
};

function addEventForButtonRegister() {
    $('#btn_register').click(() => {
        const userName = $('#username').val();
        const userEmail = $('#email').val();
        const password = $('#password').val();
        const re_password = $('#re_password').val();
        const cb_accept = $('#cb_accept').is(":checked");
    
        if (userName == "" || userEmail == "" || password == "" || re_password == "") {
            alert('Không được để trống!');
            return
        }

        if (password != re_password) {
            alert('Mật khẩu không khớp!');
            return
        }

        if (!cb_accept) {
            alert('Bạn cần đồng ý với các điều khoản của chúng tôi để có thể đăng ký!');
            return
        }

        const Account = {
            userName: userName,
            userEmail: userEmail,
            password: password,
            admin: false
        };

        registerUser(Account).then(data => {
            console.log(data);
        });
    });
}

$(document).ready(function () {
    addEventForButtonRegister();
});