import { url, fetchAPI } from "../src/app.js";
import { Cart } from "../models/cart.js";
import { cart_detail } from "../models/cart_detail.js";

console.log("checkOut");

//----------------------Hiển thị thông tin sản phẩm ở checkOut---------------------------//
document.addEventListener("DOMContentLoaded", function () {
    // Lấy thông tin sản phẩm từ localStorage
    const cartData = localStorage.getItem("cart");

    if (cartData) {
        const products = JSON.parse(cartData);

        // Lấy phần tử HTML mà bạn muốn hiển thị thông tin sản phẩm lên
        const productListElement = document.querySelector('.checkout__total__products');

        // Tạo một chuỗi HTML chứa thông tin sản phẩm
        let productListHTML = '';

        products.forEach((product, index) => {
            productListHTML += `
                <li>${index + 1}. ${product.TenSanPham} <span>${product.Gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span> <br>Số lượng: ${product.quantity}</li>
            `;
        });

        // Hiển thị thông tin sản phẩm trên giao diện thanh toán
        productListElement.innerHTML = productListHTML;

        // Tính tổng phụ và tổng tiền
        const totalSub = products.reduce((total, product) => total + (product.Gia * product.quantity), 0);
        const totalPrice = totalSub; // Tổng tiền có thể khác tổng phụ tùy vào cách tính

        // Lấy phần tử HTML của tổng phụ và tổng tiền
        const totalSubPriceElement = document.querySelector('.checkout__total__all li:nth-child(1) span');
        const totalPriceElement = document.querySelector('.checkout__total__all li:nth-child(2) span');

        // Hiển thị tổng phụ và tổng tiền trên giao diện thanh toán
        if (totalSubPriceElement && totalPriceElement) {
            totalSubPriceElement.textContent = totalSub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            totalPriceElement.textContent = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }

        // Hiển thị tổng số lượng sản phẩm
        const totalQuantityElement = document.querySelector('.checkout__total__all li:nth-child(3) span');
        const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);
        if (totalQuantityElement) {
            totalQuantityElement.textContent = totalQuantity.toString();
        }
    }
});


//---------------------------Thanh_Toán------------------------------//
// Thực hiện thanh toán
export const checkOut = async () => {
    try {
        // Kiểm tra xem có sản phẩm trong giỏ hàng không
        const cartData = localStorage.getItem("cart");
        if (cartData) {
            // Lấy thông tin của người mua hàng trên trang
            const username = (document.getElementById("username") as HTMLInputElement).value;
            const address = (document.getElementById("address") as HTMLInputElement).value;
            const phone = (document.getElementById("phone") as HTMLInputElement).value;
            const totalElement = document.getElementById("total");
            const total = totalElement ? parseFloat(totalElement.innerText) : 0;

            // Kiểm tra các trường input mới
            if (!username || !address || !phone) {
                alert("Vui lòng nhập đầy đủ thông tin của bạn trước khi thanh toán.");
                return;
            }

            // Tạo instance Cart
            const cartItem = new Cart(username, address, phone, total);

            // Thêm Cart vào database
            const urlCart = url + 'GioHang';
            const option = {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(cartItem)
            };

            const result = await fetchAPI(urlCart, option);

            // Lấy thông tin đơn hàng vừa tạo từ kết quả trả về
            const orderId = result.id;

            // Lưu orderId vào mảng trong localStorage
            let orderIds = JSON.parse(localStorage.getItem('orderIds')) || [];
            orderIds.push(orderId);
            localStorage.setItem('orderIds', JSON.stringify(orderIds));

            // Thêm chi tiết đơn hàng
            addCartDetail(orderId);
            
            // Xóa giỏ hàng sau khi thanh toán
            localStorage.removeItem('cart');
            
            // Hiển thị cảnh báo sau khi thanh toán thành công
            alert("Thanh toán thành công!");
            
            // Chuyển hướng người dùng về trang index sau khi thanh toán thành công
            window.location.href = "index.html";
        } else {
            // Nếu không có sản phẩm trong giỏ hàng, hiển thị thông báo cho người dùng
            alert("Không có sản phẩm nào trong giỏ hàng để thanh toán.");
        }
    } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
    }
}



// Lưu dữ liệu giỏ hàng vào localStorage trước khi thực hiện thanh toán
const saveCartToLocalStorage = (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData));
};

//-----------------------Add_Detail--------------------------//

// Thêm chi tiết đơn hàng
const addCartDetail = async (cart_id) => {
    // Đọc thông tin giỏ hàng từ LocalStorage
    const cartData = localStorage.getItem('cart');
    const cartItems = JSON.parse(cartData);

    // Lưu thông tin giỏ hàng vào localStorage nếu không tồn tại
    if (!cartItems) {
        console.error("Không tìm thấy giỏ hàng trong LocalStorage.");
        return;
    }

    // Tạo mảng chứa thông tin chi tiết đơn hàng
    const cartDetails = [];

    // Duyệt qua từng sản phẩm trong giỏ hàng và tạo đối tượng cart_detail
    for (let i = 0; i < cartItems.length; i++) {
        const { product_id, price, quantity } = cartItems[i];
        const detail = new cart_detail(cart_id, product_id, price, quantity);
        cartDetails.push(detail);
    }

    // Gửi yêu cầu POST để thêm chi tiết đơn hàng vào cơ sở dữ liệu
    const urlCartDetail = url + 'ThongTinGioHang';
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cartDetails) // Chuyển đổi mảng cartDetails thành chuỗi JSON và gửi đi
    };

    try {
        const response = await fetch(urlCartDetail, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Chi tiết đơn hàng đã được thêm vào cơ sở dữ liệu.");
    } catch (error) {
        console.error("Lỗi khi thêm chi tiết đơn hàng:", error);
    }
};

// Lấy danh sách orderId từ localStorage
let orderIds = JSON.parse(localStorage.getItem('orderIds')) || [];



// Hiển thị thông tin đơn hàng trên trang
const displayOrderDetails = async () => {
    try {
        // Lấy thông tin giỏ hàng mới từ localStorage
        const cartData = localStorage.getItem("cartNew");

        if (!cartData) {
            console.error("Không tìm thấy giỏ hàng mới trong LocalStorage.");
            return;
        }

        const cartItems = JSON.parse(cartData);

        // Hiển thị thông tin đơn hàng
        let totalOrderPrice = 0; // Khởi tạo biến tổng tiền của đơn hàng

        for (let i = 0; i < cartItems.length; i++) {
            const { TenSanPham, id, Gia, quantity } = cartItems[i];
            const total = Gia * quantity; // Tính tổng tiền của sản phẩm trong đơn hàng
            totalOrderPrice += total; // Cập nhật tổng tiền của đơn hàng

            // Tạo HTML và hiển thị thông tin đơn hàng
            const orderHTML = `
                <div class="order">
                    <h2>Sản phẩm ${i + 1}</h2>
                    <p>Sản phẩm: ${TenSanPham}</p>
                    <p>ID: ${id}</p>
                    <p>Giá: ${Gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    <p>Số lượng: ${quantity}</p>
                    <p>Tổng tiền: ${total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                </div>
            `;
            // Thêm vào phần tử HTML hiển thị danh sách đơn hàng
            const orderListElement = document.querySelector('#orderItemList');
            orderListElement.innerHTML += orderHTML;
        }

        // Hiển thị tổng tiền của đơn hàng lên trang
        document.getElementById("total").innerText = totalOrderPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } catch (error) {
        console.error("Lỗi khi hiển thị thông tin đơn hàng:", error);
    }
};

// Gọi hàm hiển thị thông tin đơn hàng khi trang được load
document.addEventListener("DOMContentLoaded", displayOrderDetails);



document.addEventListener("DOMContentLoaded", function () {
    // Thêm sự kiện click vào nút "Xem chi tiết đơn hàng"
    const viewOrderDetailsBtn = document.getElementById("viewOrderDetailsBtn");
    if (viewOrderDetailsBtn) {
        viewOrderDetailsBtn.addEventListener("click", function () {
            // Chuyển hướng trang đến trang chi tiết đơn hàng
            window.location.href = "order-details.html";
        });
    }
});

// Lấy thông tin từ localStorage
const orderId = localStorage.getItem("cartNew");

// Lấy thông tin đơn hàng từ cơ sở dữ liệu bằng id
const fetchOrderDetails = async (orderId) => {
    const urlOrderDetails = url + `GioHang/${orderId}`;
    try {
        const response = await fetch(urlOrderDetails);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    }
};

// Hiển thị thông tin đơn hàng trên trang
document.addEventListener("DOMContentLoaded", async function () {
    const orderDetails = await fetchOrderDetails(orderId);
    if (orderDetails) {
        document.getElementById("customerName").innerText = orderDetails.username;
        document.getElementById("customerAddress").innerText = orderDetails.address;
        document.getElementById("customerPhone").innerText = orderDetails.phone;
        document.getElementById("total").innerText = orderDetails.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
});


// Hàm lấy thông tin người dùng hiện tại từ localStorage
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('currentUser'));
};

// Sự kiện DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    // Lấy thông tin người dùng hiện tại
    const currentUser = getCurrentUser();

    // Hiển thị thông tin người dùng nếu có
    if (currentUser) {
        document.getElementById('customerName').innerText = currentUser.TenKhachHang;
        document.getElementById('email').innerText = currentUser.Email;
        document.getElementById('customerId').innerText = currentUser.id;
    } else {
        console.error("Không tìm thấy thông tin người dùng.");
    }
});
