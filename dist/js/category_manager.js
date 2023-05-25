function addEventForButtonSubmitEdit() {
  $('#submitEdit').click((e) => {
    e.preventDefault();
    const categoryId = $('#submitEdit').data().id;
    const categoryName = $("#edit-category-name").val();
    $.ajax({
      url: `http://localhost:8000/api/categories/${categoryId}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ name: categoryName }),
      success: function(response) {
        $("#edit-category-modal").modal("hide");
        renderCategoryList();
      },
      error: function(xhr, status, error) {
        console.log("Lỗi khi gọi API: " + error);
      }
    });
  })
};

function addEventForButtonCloseEdit() {
  $('#btnCloseEdit').click((e) => {
    e.preventDefault();
    $("#edit-category-modal").modal("hide");
    setTimeout(() => {
      $("#edit-category-modal").remove();
    }, 500);
  });
}

function appendModalEdit(id, name) {
  const modal = `
    <div class="modal fade" id="edit-category-modal" tabindex="-1" aria-labelledby="edit-category-modal-label" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="edit-category-modal-label">Sửa loại sản phẩm</h5>
            <button type="button" id="btnCloseEdit" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form id="edit-category-form">
              <div class="form-group">
                <label for="edit-category-name">Tên loại sản phẩm</label>
                <input type="text" class="form-control" id="edit-category-name" placeholder="Tên hãng sản phẩm">
              </div>
              <button type="submit" id="submitEdit" data-id="${id}" class="btn btn-primary w-25 mt-2">Lưu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  $('#category-content').append(modal);
  $("#edit-category-name").val(name);
  $("#edit-category-modal").modal("show");
  addEventForButtonSubmitEdit();
  addEventForButtonCloseEdit();
};

function addEventForButtonEdit() {
  const groupButtonEdit = document.querySelectorAll('#btnEdit');
  groupButtonEdit.forEach(btn => {
    $(btn).click(e => {
      e.preventDefault();
      let categoryId = $(btn).parent().data().id;
      $.ajax({
        url: `http://localhost:8000/api/categories/${categoryId}`,
        method: "GET",
        success: function(response) {
          const category = response;
          appendModalEdit(categoryId, category.name)
        },
        error: function(xhr, status, error) {
          console.log("Lỗi khi gọi API: " + error);
        }
      });
    });
  });
};

function renderCategoryList() {
  $.get("http://localhost:8000/api/categories", function (categories) {
    let categoryListItems = "";
    for (var i = 0; i < categories.length; i++) {
      const category = categories[i];
      const category_id = category.id;
      const category_name = category.name;
      categoryListItems += `
        <tr>
            <td>${category_id}</td>
            <td>${category_name}</td>
            <td data-id="${category_id}">
              <button class="btn btn-success" id="btnEdit">Sửa</button>
              <button class="btn btn-danger">Xóa</button>
            </td>
        </tr>
      `;
    };
    $('#category_list_items').html(categoryListItems);
    addEventForButtonEdit();
  });
};

$(document).ready(function () {
    renderCategoryList();
});