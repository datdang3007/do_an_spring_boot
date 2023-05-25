function addEventForButtonSubmitEdit() {
  $('#submitEdit').click((e) => {
    e.preventDefault();
    const brandId = $('#submitEdit').data().id;
    const brandName = $("#edit-brand-name").val();
    $.ajax({
      url: `http://localhost:8000/api/brands/${brandId}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ name: brandName }),
      success: function(response) {
        $("#edit-brand-modal").modal("hide");
        renderBrandList();
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
    $("#edit-brand-modal").modal("hide");
    setTimeout(() => {
      $("#edit-brand-modal").remove();
    }, 500);
  });
}

function appendModalEdit(id, name) {
  const modal = `
    <div class="modal fade" id="edit-brand-modal" tabindex="-1" aria-labelledby="edit-brand-modal-label" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="edit-brand-modal-label">Sửa hãng sản phẩm</h5>
            <button type="button" id="btnCloseEdit" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form id="edit-brand-form">
              <div class="form-group">
                <label for="edit-brand-name">Tên hãng sản phẩm</label>
                <input type="text" class="form-control" id="edit-brand-name" placeholder="Tên hãng sản phẩm">
              </div>
              <button type="submit" id="submitEdit" data-id="${id}" class="btn btn-primary w-25 mt-2">Lưu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  $('#brand-content').append(modal);
  $("#edit-brand-name").val(name);
  $("#edit-brand-modal").modal("show");
  addEventForButtonSubmitEdit();
  addEventForButtonCloseEdit();
};

function addEventForButtonEdit() {
  const groupButtonEdit = document.querySelectorAll('#btnEdit');
  groupButtonEdit.forEach(btn => {
    $(btn).click(e => {
      e.preventDefault();
      let brandId = $(btn).parent().data().id;
      $.ajax({
        url: `http://localhost:8000/api/brands/${brandId}`,
        method: "GET",
        success: function(response) {
          const brand = response;
          appendModalEdit(brandId, brand.name)
        },
        error: function(xhr, status, error) {
          console.log("Lỗi khi gọi API: " + error);
        }
      });
    });
  });
};

function renderBrandList() {
  $.get("http://localhost:8000/api/brands", function (brands) {
    let brandListItems = "";
    for (var i = 0; i < brands.length; i++) {
      const brand = brands[i];
      const brand_id = brand.id;
      const brand_name = brand.name;
      brandListItems += `
          <tr>
              <td>${brand_id}</td>
              <td>${brand_name}</td>
              <td data-id="${brand_id}">
                <button class="btn btn-success" id="btnEdit">Sửa</button>
                <button class="btn btn-danger">Xóa</button>
              </td>
          </tr>
      `;
    }
    $('#brand_list_items').html(brandListItems);
    addEventForButtonEdit();
  });
};

$(document).ready(function () {
  renderBrandList();
});