import { url, fetchAPI } from '../src/app.js';

const itemsPerPage = 6; // Số lượng sản phẩm trên mỗi trang

// Hàm shoShop để hiển thị tất cả sản phẩm có trong bảng Sản Phẩm
const urlProduct = url + 'SanPham/';
const getAllProducts = async () => {
    const data = await fetchAPI(urlProduct);
    showProducts(data);
}  

export const showProducts = (data) => {
    const html = document.getElementById('showProduct');
    console.log('get all Product', data);
    if (Array.isArray(data)) { // Kiểm tra xem data có phải là một mảng không
        html.innerHTML = data.map(pro => {
            return `
             <div class="col-lg-4 col-md-6 col-sm-6">
            <div class="product__item">
                <div class="product__item__pic set-bg" data-setbg="${pro.id}">
                <img style="height: 250px;" src="../img/${pro.Anh}" alt="">
                    <ul class="product__hover">
                        <li><a href="#"><img src="img/icon/heart.png" alt=""></a></li>
                        <li><a href="#"><img src="img/icon/compare.png" alt=""> <span>Compare</span></a>
                        </li>
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
                        <label for="pc-4">
                            <input type="radio" id="pc-4">
                        </label>
                        <label class="active black" for="pc-5">
                            <input type="radio" id="pc-5">
                        </label>
                        <label class="grey" for="pc-${pro.id}">
                            <input type="radio" id="pc-${pro.id}">
                        </label>
                    </div>
                </div>
            </div>
        </div>
            `;
        }).join('');
    } else {
        console.error('Data is not an array');
    }
}

// //lay danh sach san pham theo danh muc
export const getProductBycateId = async (cateId = '') => {
    const urlProductByCateId = cateId === '' ? urlProduct : urlProduct + `?MaDanhMuc=${cateId}`;
    const data = await fetchAPI(urlProductByCateId);
    return showProducts(data)
} 

// Định nghĩa hàm để hiển thị chi tiết sản phẩm dựa trên ID
async function showProductDetailById(productId) {
    const urlProduct = url + 'SanPham/' + productId; // URL để lấy chi tiết sản phẩm từ server
    const product = await fetchAPI(urlProduct); // Lấy thông tin sản phẩm từ server
    // console.log(product)
    localStorage.setItem("product", JSON.stringify(product))
    window.location.href = "shop-details.html"
}

document.addEventListener('click', (event) => { // Sử dụng 'document' thay vì 'window' và đặt tham số là 'event'
    const target = <HTMLElement>event.target; // Lấy đối tượng kích hoạt sự 
    console.log("target",target)
    const div = target.parentElement;
    console.log("div",div)
    if (div.getAttribute('data-setbg')) { // Sử dụng thuộc tính 'data-setbg' thay vì 'id'
        const id = div.getAttribute('data-setbg');
        showProductDetailById(id);
    }
});



getAllProducts();


// ----------------------ADD_TO_CART-----------------------//
window.addEventListener('click', e => {
    const target = <HTMLElement>event.target;
    console.log(target);
    if(target.getAttribute('id') && target.getAttribute('dataId')) {
        console.log("oke");
        const id = target.getAttribute('id');
        const dataId = target.getAttribute('dataId');
        addCart(id, dataId);
    }
})
const addCart = async (id: string, MaDanhMuc: any) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let data = await fetchAPI(`${url}SanPham/${id}`);

    const existingProduct = cart.find((product) => product.id === data.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
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
    // window.location.href = 'shopping-cart.html'
}