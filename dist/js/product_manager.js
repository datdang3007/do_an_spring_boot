//----------------------------------------//
//----------- ### FIREBASE ### -----------//
//----------------------------------------//
const firebaseConfig = {
  apiKey: "AIzaSyAEdgYwOD3LSc_En_PE5BQrs0S608Cfxl4",
  authDomain: "upload-img-fe871.firebaseapp.com",
  projectId: "upload-img-fe871",
  storageBucket: "upload-img-fe871.appspot.com",
  messagingSenderId: "921179138895",
  appId: "1:921179138895:web:d169df8086d99cb6c6733a",
  measurementId: "G-GYJ5K9XJBV",
};

const minMoney = 0;
const maxMoney = 2500;

function eventPriceRange() {
  const default_price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(((maxMoney - minMoney) / 2) * 1000)
  $('#price_percent').html(default_price);

  $("#price-range").on("input", function() {
    let percent = $(this).val();
    let money = maxMoney - minMoney;
    let price_vnd = ((money / 100) * percent) * 1000;
    let price_percent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price_vnd);
    $('#price_percent').html(price_percent);
  });
}

function uploadFileToFireBase(file) {
  return new Promise((resolve, reject) => {
    var storageRef = firebase.storage().ref();

    var uploadTask = storageRef.child('images/' + file.name).put(file);
  
    uploadTask.on('state_changed', null, function(error) {
      console.error('Lỗi khi tải lên:', error);
      resolve(null);
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        resolve(downloadURL);
      });
    });
  });
}

function addEventForButtonUploadImage() {
  $('#product-images').on('change', (e) => {
    $('#product-images').data({link: []});
    let ID = $('#product-images').data().id;
    var files = e.target.files;
    if (files.length === 0) {
      return;
    }
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      uploadFileToFireBase(file).then(linkUrl => {
        if (!linkUrl) return;
        const linkList = $('#product-images').data().link;
        linkList.push(linkUrl);
        $('#product-images').data({link: linkList});
      });
    }
  });
}

function renderProductList() {
  $.ajax({
    url: 'http://localhost:8000/api/products', // Địa chỉ API để lấy danh sách sản phẩm
    method: 'GET',
    success: function(response) {
      const products = response;
      let productListItems = "";
      for (var i = 0; i < products.length; i++) {
        const product = products[i];
        const product_id = product.id;
        const product_image = product.product_images[0];
        const product_name = product.product_name;
        const product_price = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.product_price * 1000);
        const product_description = product.product_description;

        productListItems = `
          <tr>
            <td>${product_id}</td>
            <th>${product_image}</th>
            <td>${product_name}</td>
            <td>${product_price}</td>
            <td>${product_description}</td>
            <td>Category</td>
            <td>Brand</td>
            <td data-id="${product_id}">
              <button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#editProductModal" id="btnEdit">
                  <i class="fas fa-edit"></i> Sửa
              </button>
              <button class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteProductModal" id="btnDelete">
                  <i class="fas fa-trash"></i> Xóa
              </button>
            </td>
          </tr>
        `;
      };

      $('.product-table-body').append(productListItems);
    }, error: function() {
      alert('Đã xảy ra lỗi khi lấy danh sách sản phẩm');
    }
  });
}

function addEventForButtonSubmitAddNew() {
  $('#btnSubmitAddNew').click(e => {
    e.preventDefault();

    const product_name = $('#product-name-input').val();
    const product_image = $('#product.product_images').val();
    const product_price = $('#product-price-input').val();
    const product_description = $('#product-description-input').val();
    const product_category = $('#product-category-input').val();
    const product_brand = $('#product-brand-input').val();

    const data = {
      product_name: product_name,
      product_images: product_image,
      product_price: product_price,
      product_description: product_description,
      category_id: product_category,
      brand_id: product_brand,
    }

    $.ajax({
      url: '/api/products',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        name: productName,
      }),
      success: function(response) {
        console.log('Sản phẩm đã được tạo');
      },
      error: function(error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
      }
    });
  });
}

function addEventForButtonAddNew() {
  $('#btnAddNew').click(e => {
    e.preventDefault();
    
    let modal = `
      <div class="modal fade" id="createProductModal" tabindex="-1" role="dialog" aria-labelledby="createProductModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="createProductModalLabel">Tạo sản phẩm mới</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Đóng">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="create-product-form">
                <div class="form-group">
                  <label for="product-name-input">Tên sản phẩm</label>
                  <input type="text" class="form-control" id="product-name-input" placeholder="Nhập tên sản phẩm">
                </div>
                <div class="form-group mt-2">
                  <label for="product-price-input">Giá sản phẩm</label>
                  <input type="number" class="form-control" id="product-price-input" placeholder="Nhập giá sản phẩm (đơn vị ngàn đồng)">
                </div>
                <div class="form-group mt-2">
                  <label for="product-description-input">Mô tả sản phẩm</label>
                  <textarea class="form-control" id="product-description-input" rows="3" placeholder="Nhập mô tả sản phẩm"></textarea>
                </div>
                <div class="form-group mt-2">
                  <label for="product-category-input">Danh mục sản phẩm</label>
                  <select class="form-control" id="product-category-input"></select>
                </div>
                <div class="form-group mt-2">
                  <label for="product-brand-input">Thương hiệu sản phẩm</label>
                  <select class="form-control" id="product-brand-input"></select>
                </div>
                <div class="form-group mt-2">
                  <label for="product-sale-input">Giảm giá sản phẩm</label>
                  <input type="number" class="form-control" id="product-sale-input" placeholder="Nhập số tiền giảm giá (nếu có)">
                </div>
                <div class="form-group mt-3">
                  <label for="product-images">Hình ảnh sản phẩm</label>
                  <input type="file" class="form-control-file" id="product-images" name="product-images" multiple>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button id="btnSubmitAddNew" class="btn btn-primary">Tạo sản phẩm mới</button>
            </div>
          </div>
        </div>
      </div>
    `;
    $('#product-content').append(modal);
    // Render brands select:
    $.get("http://localhost:8000/api/brands", function (brands) {
      let brandOptions = "";
      for (var i = 0; i < brands.length; i++) {
        const brand = brands[i];
        const brand_id = brand.id;
        const brand_name = brand.name;
        brandOptions += `
          <option value="${brand_id}">${brand_name}</option>
        `;
      }
      $('#product-category-input').html(brandOptions);
    });
    
    // Render categories select:
    $.get("http://localhost:8000/api/categories", function (categories) {
      let categoryOptions = "";
      for (var i = 0; i < categories.length; i++) {
        const category = categories[i];
        const category_id = category.id;
        const category_name = category.name;
        categoryOptions += `
          <option value="${category_id}">${category_name}</option>
        `;
      }
      $('#product-brand-input').html(categoryOptions);
    });

    $('#createProductModal').modal('show');
    addEventForButtonSubmitAddNew();
    addEventForButtonUploadImage();
  });
};

$(document).ready(function () {
  firebase.initializeApp(firebaseConfig);
  renderProductList();
  eventPriceRange();
  addEventForButtonAddNew();
});