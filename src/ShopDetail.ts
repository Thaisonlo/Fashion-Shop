import { url, fetchAPI } from '../src/app.js';
const urlCategory = url + 'DanhMuc/';


// ----------------------DETAIL-----------------------//    
// Định nghĩa hàm để hiển thị chi tiết sản phẩm dựa trên ID
function showProductDetailById() {
     
    let product =JSON.parse(localStorage.getItem("product"));

    if (product) {
        const showProDetailElement = document.getElementById('showProDetail');
        // Tạo HTML cho chi tiết sản phẩm
        const productDetailHTML = `
        <div class="col-lg-6 col-md-9">
            <div class="tab-content">
                <div class="tab-pane active" id="tabs-1" role="tabpanel">
                    <div class="product__details__pic__item">
                        <img src="../img/${product.Anh}" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="product__details__content">
            <div class="container">
                <div class="row d-flex justify-content-center">
                    <div class="col-lg-8">
                        <div class="product__details__text">
                            <h4>${product.TenSanPham}</h4>
                            <div class="rating">
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star-o"></i>
                                <span> - 5 Đánh giá</span>
                            </div>
                            <h3>${product.Gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}<span>${product.GiaKhuyenMai} VNĐ</span></h3>
                            <p>${product.MoTa}</p>
                            <div class="product__details__cart__option">
                                <div class="quantity">
                                    <div class="pro-qty">
                                        <span class="decrease-qty">-</span>
                                        <input type="text" value="1">
                                        <span class="increase-qty">+</span>
                                    </div>
                                </div>
                                <input type="hidden" value=${product.id}> 
                                <a id=${product.id} dataId=${product.MaDanhMuc} href="#" class="primary-btn">Thêm vào giỏ hàng</a>
                            </div>
                            <div class="product__details__btns__option">
                                <a><i class="fa fa-heart"></i> Thêm vào danh sách yêu thích</a>
                            </div>
                            <div class="product__details__last__option">
                                <img src="img/shop-details/details-payment.png" alt="">
                                <ul>
                                    <li><span>Danh mục:</span> ${product.TenDanhMuc}s</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        // Hiển thị chi tiết sản phẩm trên giao diện
        showProDetailElement.innerHTML = productDetailHTML;
    } else {
        console.log('Không tìm thấy sản phẩm');
    }
}


window.addEventListener('click', e => {
    const target = <HTMLElement>e.target;
    console.log(target);
    if (target.classList.contains('increase-qty') || target.classList.contains('decrease-qty')) {
        const inputElement = target.parentElement?.querySelector('input[type="text"]') as HTMLInputElement;
        if (!inputElement) return;
        let quantity = parseInt(inputElement.value);
        if (target.classList.contains('increase-qty')) {
            quantity++;
        } else {
            if (quantity > 1) {
                quantity--;
            }
        }
        inputElement.value = quantity.toString();
    } else if (target.getAttribute('id') && target.getAttribute('dataId')) {
        console.log("oke");
        const id = target.getAttribute('id');
        const dataId = target.getAttribute('dataId');
        const inputElement = target.parentElement?.querySelector('input[type="text"]') as HTMLInputElement;
        if (!inputElement) return;
        const quantity = parseInt(inputElement.value || '1');
        addCart(id, dataId, quantity);
    }
});

const addCart = async (id: string, MaDanhMuc: any, quantity: number) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let data = await fetchAPI(`${url}SanPham/${id}`);

    const existingProduct = cart.find((product: any) => product.id === data.id);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        const product = {
            id: data.id,
            TenSanPham: data.TenSanPham,
            Gia: data.Gia,
            Anh: data.Anh,
            SoLuong: 1,
            quantity: quantity
        };
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = 'shopping-cart.html';
}

showProductDetailById();


//-------------------------------Show_Sản_Phẩm_Liên_Quan-----------------------------------//
// Định nghĩa hàm để hiển thị chi tiết sản phẩm dựa trên ID
function showProductDetailByCategoryId() {
     
    let product =JSON.parse(localStorage.getItem("product"));

    if (product) {
        const showProDetailElement = document.getElementById('proLq');
        // Tạo HTML cho chi tiết sản phẩm
        const productDetailHTML = `
        <div class="col-lg-3 col-md-6 col-sm-6 col-sm-6">
                    <div class="product__item">
                        <div class="product__item__pic set-bg">
                            <img style="width: 200px" src="../img/${product.Anh}" alt="">
                            <ul class="product__hover">
                                <li><a href="#"><img src="img/icon/heart.png" alt=""></a></li>
                                <li><a href="#"><img src="img/icon/compare.png" alt=""> <span>Compare</span></a></li>
                                <li><a href="#"><img src="img/icon/search.png" alt=""></a></li>
                            </ul>
                        </div>
                        <div class="product__item__text">
                            <h6>${product.TenSanPham}</h6>
                            <a href="#" class="add-cart">+ Add To Cart</a>
                            <div class="rating">
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                            </div>
                            <h5>${product.Gia.toLocaleString( { style: 'currency', currency: 'VND' })} VNĐ</h5>
                            <div class="product__color__select">
                                <label for="pc-4">
                                    <input type="radio" id="pc-4">
                                </label>
                                <label class="active black" for="pc-5">
                                    <input type="radio" id="pc-5">
                                </label>
                                <label class="grey" for="pc-6">
                                    <input type="radio" id="pc-6">
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
        `;
        // Hiển thị chi tiết sản phẩm trên giao diện
        showProDetailElement.innerHTML = productDetailHTML;
    } else {
        console.log('Không tìm thấy sản phẩm');
    }
}
showProductDetailByCategoryId();