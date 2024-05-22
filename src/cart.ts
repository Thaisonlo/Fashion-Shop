interface Product {
    id: string;
    TenSanPham: string;
    Gia: number;
    quantity: number;
    Anh: string;
}

const html = document.getElementById('showCart') as HTMLElement;

const showCart = () => {
    let products = JSON.parse(localStorage.getItem("cart")) as Product[];

    if (!products || products.length === 0) {
        html.innerHTML = "<h2>Giỏ hàng của bạn đang trống óoo, thêm sản phẩm i nè.</h2>";
        return;
    }

    const cartHTML = products.map((product) => {
        return `
        <tr>
            <td class="product__cart__item" id="${product.id}">
                <div class="product__cart__item__pic">
                    <img style="width: 150px;" src="../img/${product.Anh}" alt="">
                    <div class="product__cart__item__text">
                        <h6>${product.TenSanPham}</h6>
                        <h5 class="product-price">${product.Gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }</h5>
                    </div>
                </div>
            </td>
            <td class="quantity__item">
                <div class="quantity">
                    <button class="quantity-btn decrease-btn" data-product-id="${product.id}">-</button>
                    <input type="text" class="quantity-input" value="${product.quantity}" disabled>
                    <button class="quantity-btn increase-btn" data-product-id="${product.id}">+</button>
                </div>
            </td>
            <td class="cart__price" data-product-id="${product.id}">${(product.Gia * product.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td class="cart__close"><i class="fa fa-close" data-product-id="${product.id}"></i></td>
        </tr>
        `;
    });

    html.innerHTML = cartHTML.join('');
}


showCart();


const quantityButtons = document.querySelectorAll('.quantity-btn');
quantityButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const productId = target.getAttribute('data-product-id');
        const input = target.parentElement?.querySelector('.quantity-input') as HTMLInputElement;
        if (!input) return;
        let quantity = parseInt(input.value);
        if(button.classList.contains('decrease-btn')) {
            if (quantity > 1) {
                quantity --;
            } else {
                // Nếu số lượng giảm xuống 0, xóa sản phẩm
                removeProduct(productId);
                return; // Dừng xử lý tiếp theo
            }
        } else {
            quantity++;
        }
        input.value = quantity.toString();
        updateQuantity(productId, quantity);
        updateProductPrice(productId, quantity);

        // Sau khi cập nhật số lượng sản phẩm, cập nhật tổng tiền ngay lập tức
        displayTotal(); // Gọi hàm hiển thị tổng tiền
    });
});


function updateQuantity (productId: string, quantity: number) {
    let products = JSON.parse(localStorage.getItem("cart")) as Product[];
    const updatedProducts = products.map(product => {
        if (product.id === productId) {
            product.quantity = quantity;
        }
        return product;
    });
localStorage.setItem("cart", JSON.stringify(updatedProducts));
}

function updateProductPrice(productId: string, quantity: number) {
    const productPriceElement = document.querySelector(`.cart__price[data-product-id="${productId}"]`) as HTMLElement;
    if(!productPriceElement) return;
    let products = JSON.parse(localStorage.getItem("cart")) as Product[];
    const product = products.find(product => product.id === productId);
    if (!product) return;
    productPriceElement.textContent = (product.Gia * product.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'});
}

const closeButtons = document.querySelectorAll('.cart__close i');
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        removeProduct(productId);
    })
})

const removeProduct = (productId: string) => {
    // Hiển thị modal xác nhận
    const confirmModal = document.getElementById('confirmModal') as HTMLElement;
    confirmModal.style.display = 'block';

    // Xác nhận xóa sản phẩm khi nhấn nút "Có"
    const confirmYes = document.getElementById('confirmYes') as HTMLElement;
    confirmYes.onclick = () => {
        let products = JSON.parse(localStorage.getItem("cart")) as Product[];
        
        // Lọc sản phẩm cần xóa
        const updatedProducts = products.filter(product => product.id !== productId);
        // Cập nhật lại giỏ hàng trong localStorage
        localStorage.setItem("cart", JSON.stringify(updatedProducts));
        // Hiển thị lại giỏ hàng sau khi xóa
        showCart();
        // Cập nhật tổng tiền sau khi xóa sản phẩm
        displayTotal();

        // Đóng modal
        confirmModal.style.display = 'none';
    };

    // Đóng modal nếu nhấn nút "Không"
    const confirmNo = document.getElementById('confirmNo') as HTMLElement;
    confirmNo.onclick = () => {
        confirmModal.style.display = 'none';
    };
}


const calculateTotal = () => {
    let products = JSON.parse(localStorage.getItem("cart")) as Product[];

    let totalSub = 20000; //khởi tạo tổng phụ
    let totalPrice = 0;

    products.forEach(product => {
        totalPrice += product.Gia * product.quantity;
    });
    totalPrice += totalSub;
    const formattedTotalSub = totalSub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const formattedTotalPrice = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return { totalSub: formattedTotalSub, totalPrice: formattedTotalPrice };
}

const displayTotal = () => {
    const totalElement = document.querySelector('.cart__total ul') as HTMLElement;
    const totalPriceElement = totalElement.querySelector('li:nth-child(2) span') as HTMLElement;
    const totalSubPriceElement = totalElement.querySelector('li:nth-child(1) span') as HTMLElement;
    const { totalSub, totalPrice } = calculateTotal();

    totalPriceElement.textContent = totalPrice;
    totalSubPriceElement.textContent = totalSub;
}
displayTotal();


//-------------------------------Bắt sự kiện checkOut---------------------------------//
// Hàm lấy thông tin người dùng hiện tại từ localStorage
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('currentUser'));
};


// Tạo một nút hoặc phần tử HTML đại diện cho thanh toán
const checkoutButton = document.querySelector('.primary-btn');

// Bắt sự kiện click cho nút hoặc phần tử HTML đại diện cho thanh toán
checkoutButton.addEventListener('click', () => {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        const currentUser = getCurrentUser();
            
        if (!currentUser) {
            // Nếu chưa đăng nhập, hiển thị cảnh báo và dừng lại
            alert("Bạn cần đăng nhập trước khi thanh toán.");
            window.location.href = "login.html"
            return;
        }

    // Lấy thông tin sản phẩm từ localStorage
    const products = JSON.parse(localStorage.getItem("cart")) as Product[];
    
    // Tạo một đối tượng chứa thông tin sản phẩm dưới dạng query string
    const queryString = products.map(product => `${product.TenSanPham}=${product.quantity}`).join('&');

     // Lưu danh sách sản phẩm vào key "cartNew"
     localStorage.setItem("cartNew", JSON.stringify(products));

    // Chuyển trang đến trang thanh toán và truyền thông tin sản phẩm qua địa chỉ URL
    window.location.href = `checkout.html?${queryString}`;
});



// //-------------------------------Cập nhật giỏ hàng----------------------------------//
// // Bắt sự kiện click cho nút "Cập nhật giỏ hàng"
// const updateCartButton = document.querySelector('.update__btn a');
// updateCartButton.addEventListener('click', () => {
//     // Lấy danh sách sản phẩm từ local storage
//     const products = JSON.parse(localStorage.getItem("cart")) as Product[];

//     // Lưu danh sách sản phẩm mới vào key "cartNew"
//     localStorage.setItem("cartNew", JSON.stringify(products));

//     // Thực hiện các thao tác cập nhật giao diện hoặc hiển thị thông báo cập nhật thành công (tuỳ nhu cầu của bạn)
//     // Ví dụ:
//     alert("Giỏ hàng đã được cập nhật thành công!");

//     // Sau khi cập nhật xong, có thể chuyển người dùng đến trang khác hoặc thực hiện các hành động khác nếu cần.
// });