var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { url, fetchAPI } from '../src/app.js';
export const showHome = (data1) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data1);
    const urlProduct = url + 'SanPham/';
    const html = document.getElementById('showPro');
    console.log('Product all', data1);
    html.innerHTML = data1.map(pro => {
        return `
            <div class="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals">
                <div class="product__item">
                    <div class="product__item__pic set-bg" id="${pro.id}" data-id="${pro.MaDanhMuc}">
                    <img style = "height: 250px;" src="../img/${pro.Anh}"></img>
                        <span class="label">Mới</span>
                        <ul class="product__hover">
                            <li><a href="#"><img src="img/icon/heart.png" alt=""></a></li>
                            <li><a href="#"><img src="img/icon/compare.png" alt=""> <span>Compare</span></a></li>
                            <li><a href="#"><img src="img/icon/search.png" alt=""></a></li>
                        </ul>
                    </div>
                    <div class="product__item__text">
                        <h6>${pro.TenSanPham}</h6>
                        <a id=${pro.id} dataId=${pro.MaDanhMuc} href="#" class="add-cart">+ Thêm vào giỏ hàng</a>
                        <div class="rating">
                            <i class="fa fa-star-o"></i>
                            <i class="fa fa-star-o"></i>
                            <i class="fa fa-star-o"></i>
                            <i class="fa fa-star-o"></i>
                            <i class="fa fa-star-o"></i>
                        </div>
                        <h5>${pro.Gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h5>
                        <div class="product__color__select">    
                            <label for="pc-${pro.id}">
                                <input type="radio" id="pc-${pro.id}">
                            </label>
                            <!-- Add more color options if needed -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
});
const showHome1 = () => __awaiter(void 0, void 0, void 0, function* () {
    const urlProduct = url + 'SanPham/';
    const data1 = yield fetchAPI(urlProduct);
    const html = document.getElementById('showPro');
    console.log('Product all', data1);
    html.innerHTML = data1.map(pro => {
        return `
            <div class="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals">
                <div class="product__item">
                    <div class="product__item__pic set-bg" id="${pro.id}" data-id="${pro.MaDanhMuc}">
                    <img style="height: 250px;" src="../img/${pro.Anh}"></img>
                        <span class="label">New</span>
                        <ul class="product__hover">
                            <li><a href="#"><img src="img/icon/heart.png" alt=""></a></li>
                            <li><a href="#"><img src="img/icon/compare.png" alt=""> <span>Compare</span></a></li>
                            <li><a href="#"><img src="img/icon/search.png" alt=""></a></li>
                        </ul>
                    </div>
                    <div class="product__item__text">
                        <h6>${pro.TenSanPham}</h6>
                        <a id=${pro.id} dataId=${pro.MaDanhMuc} href="#" class="add-cart">+ Thêm vào giỏ hàng</a>
                        <div class="rating">
                            <i class="fa fa-star-o"></i>
                            <i class="fa fa-star-o"></i>
                            <i class="fa fa-star-o"></i>
                            <i class="fa fa-star-o"></i>
                            <i class="fa fa-star-o"></i>
                        </div>
                        <h5>${pro.Gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h5>
                        <div class="product__color__select">    
                            <label for="pc-${pro.id}">
                                <input type="radio" id="pc-${pro.id}">
                            </label>
                            <!-- Add more color options if needed -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
});
showHome1();
function showProductDetailById(productId, dataId) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlProduct = url + 'SanPham/' + productId;
        const product = yield fetchAPI(urlProduct);
        localStorage.setItem("product", JSON.stringify(product));
        window.location.href = "shop-details.html";
    });
}
window.addEventListener('click', e => {
    const target = event.target;
    const div = target.parentElement;
    if (div.getAttribute('id') && div.getAttribute('data-id')) {
        console.log("oke");
        const id = div.getAttribute('id');
        const dataId = div.getAttribute('data-id');
        showProductDetailById(id, dataId);
    }
});
const showCountProducts = () => {
    var _a;
    let countItem = ((_a = JSON.parse(localStorage.getItem("cart"))) === null || _a === void 0 ? void 0 : _a.length) || 0;
    document.getElementById('countItem').textContent = countItem.toString();
    showCountProducts();
};
window.addEventListener('click', e => {
    const target = event.target;
    console.log(target);
    if (target.getAttribute('id') && target.getAttribute('dataId')) {
        console.log("oke");
        const id = target.getAttribute('id');
        const dataId = target.getAttribute('dataId');
        addCart(id, dataId);
        alert('Thêm vào giỏ hàng thành công!');
    }
});
const addCart = (id, MaDanhMuc) => __awaiter(void 0, void 0, void 0, function* () {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let data = yield fetchAPI(`${url}SanPham/${id}`);
    const existingProduct = cart.find((product) => product.id === data.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    }
    else {
        const product = {
            id: data.id,
            TenSanPham: data.TenSanPham,
            Gia: data.Gia,
            Anh: data.Anh,
            SoLuong: 1,
            quantity: 1
        };
        cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
});
window.addEventListener('DOMContentLoaded', () => {
    const alertMessage = document.getElementById('alertMessage');
    const delay = 3000;
    const addToCart = () => {
        alertMessage.style.display = 'block';
        setTimeout(() => {
            alertMessage.style.display = 'none';
        }, delay);
    };
    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', addToCart);
});
