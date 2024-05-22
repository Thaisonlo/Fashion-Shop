import { url, fetchAPI } from '../src/app.js';

export const urlProducts = url + 'SanPham/';

// Hiển thị sản phẩm nổi bật có giá trị là true
const getProductByFeature = async () => {
    const urlFeature = urlProducts + '?featured=1&_limit=3';
    const data = await fetchAPI(urlFeature);
    console.log('Product feature', data);
    showProductsFeature(data);
};

// Hiển thị sản phẩm nổi bật
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

// Định nghĩa hàm để hiển thị chi tiết sản phẩm dựa trên ID
async function showProductDetailById(productId, dataId) {
    const urlProduct = url + 'SanPham/' + productId; // URL để lấy chi tiết sản phẩm từ server 
    const product = await fetchAPI(urlProduct); // Lấy thông tin sản phẩm từ server
    localStorage.setItem("product", JSON.stringify(product));
    window.location.href = "shop-details.html";
}

// Lắng nghe sự kiện click để chuyển đến trang chi tiết sản phẩm
window.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    const div = target.closest('.blog__item__text');
    if(div) {
        console.log("oke");
        const id = div.getAttribute('id');
        const dataId = div.getAttribute('data-id');
        showProductDetailById(id, dataId);
    }
});

getProductByFeature();
