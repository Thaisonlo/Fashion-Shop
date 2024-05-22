import { url, fetchAPI } from '../src/app.js';

//show sản phẩm theo danh mục
 export const showHome = async ( data1) => {
    console.log(data1)
     const urlProduct = url + 'SanPham/';
    // const data = await fetchAPI(urlProduct);
    const html = document.getElementById('showPro');
    console.log('Product all',data1);

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
    }).join(''); //Nối mảng thành một chuỗi duy nhất trước khi thiết lập innerHTML
}

// show sản phẩm index;
const showHome1 = async () => {
    const urlProduct = url + 'SanPham/';
    const data1 = await fetchAPI(urlProduct);
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
    }).join(''); //Nối mảng thành một chuỗi duy nhất trước khi thiết lập innerHTML
}
showHome1();


 
// ----------------------DETAIL-----------------------//

// Định nghĩa hàm để hiển thị chi tiết sản phẩm dựa trên ID
async function showProductDetailById(productId, dataId) {
    const urlProduct = url + 'SanPham/' + productId; // URL để lấy chi tiết sản phẩm từ server
    const product = await fetchAPI(urlProduct); // Lấy thông tin sản phẩm từ server
    // console.log(product)
    localStorage.setItem("product", JSON.stringify(product))
    window.location.href = "shop-details.html"
}


window.addEventListener('click', e =>{
    const target = <HTMLElement>event.target
    // console.log(target);
    const div = target.parentElement;
    // console.log(div)
    if(div.getAttribute('id') && div.getAttribute('data-id')){
        console.log("oke");
        const id = div.getAttribute('id');
        const dataId = div.getAttribute('data-id');
        showProductDetailById(id, dataId)
    }
})

//Hiển thị số sản phẩm trong gior hàng
const showCountProducts = () => {
    let countItem = JSON.parse(localStorage.getItem("cart"))?.length || 0;
    document.getElementById('countItem').textContent = countItem.toString();
    showCountProducts();
} 



// ----------------------ADD_TO_CART-----------------------//
window.addEventListener('click', e => {
    const target = <HTMLElement>event.target;
    console.log(target);
    if(target.getAttribute('id') && target.getAttribute('dataId')) {
        console.log("oke");
        const id = target.getAttribute('id');
        const dataId = target.getAttribute('dataId');
        addCart(id, dataId);
        alert('Thêm vào giỏ hàng thành công!')
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


window.addEventListener('DOMContentLoaded', () => {
    const alertMessage = document.getElementById('alertMessage');
    const delay = 3000; // Độ trễ để ẩn thông báo (3 giây trong ví dụ này)

    const addToCart = () => {
        // Các hành động khi thêm sản phẩm vào giỏ hàng
        alertMessage.style.display = 'block'; // Hiển thị thông báo
        setTimeout(() => {
            alertMessage.style.display = 'none'; // Ẩn thông báo sau một khoảng thời gian
        }, delay);
    };

    // Gọi hàm `addToCart` khi thực hiện thêm sản phẩm vào giỏ hàng
    // Đây là ví dụ về việc gọi hàm khi nhấp vào một nút
    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', addToCart);
});


// //-----------------------------------------Search-----------------------------------------//
// const searchInput.addEventListener('input', async (event) => {
//     const keyword = (event.target as HTMLInputElement).value.trim().toLowerCase();
//     if (keyword !== '') {
//         try {
//             const data = await fetchAPI(urlProduct); // Fetch dữ liệu sản phẩm
//             const filteredProducts = data.filter(product => product.TenSanPham.toLowerCase().includes(keyword)); // Sửa product.name thành product.TenSanPham
//             showHome(filteredProducts); // Sử dụng hàm showHome để hiển thị kết quả tìm kiếm
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         }
//     } else {
//         showHome1(); // Hiển thị tất cả sản phẩm nếu không có từ khóa tìm kiếm
//     }
// });
