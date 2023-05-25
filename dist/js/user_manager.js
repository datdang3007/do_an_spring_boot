function renderUserList() {
    $.get("http://localhost:8000/api/users", function (users) {
      let userList = ``;
      for (var i = 0; i < users.length; i++) {
        const user = users[i];
        console.log(user);
        const user_id = user.id;
        const user_name = user.userName;
        const user_email = user.userEmail;
        userList += `
            <tr>
                <th scope="row">${user_id}</th>
                <td>${user_name}</td>
                <td>${user_email}</td>
                <td>
                    <button class="btn btn-danger">Xóa</button>
                </td>
            </tr>
        `;
      };
      $('#user_list_items').html(userList);
    });
};

$(document).ready(function () {
    renderUserList();
});