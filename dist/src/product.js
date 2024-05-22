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
export const urlProducts = url + 'SanPham/';
const getProductByFeature = () => __awaiter(void 0, void 0, void 0, function* () {
    const urlFeature = urlProducts + '?featured=1&_limit=3';
    const data = yield fetchAPI(urlFeature);
    console.log('Product feature', data);
    showProductsFeature(data);
});
const showProductsFeature = (data) => {
    const HTMLElement = document.getElementById('featured');
    HTMLElement.innerHTML = data.map((fe) => {
        return `
        <div style="margin-top: -200px; margin-bottom: 100px;" class="col-lg-4 col-md-6 col-sm-6">
            <div class="blog__item">
                <div class="blog__item__pic set-bg" data-setbg="img/blog/blog-1.jpg"></div>
                <div class="blog__item__text" id="${fe.id}" data-id="${fe.MaDanhMuc}">
                    <span><img style="width: 100%" src="../img/${fe.Anh}"></span>
                    <h5>${fe.TenSanPham}</h5>
                    <a href="#">Xem thêm</a>
                </div>
            </div>
        </div>
        `;
    }).join('');
};
function showProductDetailById(productId, dataId) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlProduct = url + 'SanPham/' + productId;
        const product = yield fetchAPI(urlProduct);
        localStorage.setItem("product", JSON.stringify(product));
        window.location.href = "shop-details.html";
    });
}
window.addEventListener('click', e => {
    const target = e.target;
    const div = target.closest('.blog__item__text');
    if (div) {
        console.log("oke");
        const id = div.getAttribute('id');
        const dataId = div.getAttribute('data-id');
        showProductDetailById(id, dataId);
    }
});
getProductByFeature();
