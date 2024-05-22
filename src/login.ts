document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form
        
        // Lấy giá trị từ input
        const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
        const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
        
        if (emailInput && passwordInput) {
            const email = emailInput.value.trim(); // Sửa tên biến thành email
            const password = passwordInput.value.trim();
            
            if (email && password) {
                try {
                    const response = await fetch('http://localhost:3000/users');
                    const users = await response.json();
                    
                    // Kiểm tra xem email và mật khẩu có trùng khớp không
                    const user = users.find(u => u.Email === email && u.MatKhau === password);
                    if (user) {
                        alert('Đăng nhập thành công');
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        window.location.href = 'index.html';
                    } else {
                        alert('Email hoặc mật khẩu không đúng');
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu người dùng:', error);
                    alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
                }
            } else {
                alert('Email hoặc mật khẩu không được để trống');
            }
        }
    });
});

//----------------------------Show_Information_index-------------------------------//
document.addEventListener('DOMContentLoaded', function () {
    var currentUser = localStorage.getItem('currentUser');
    var loginLinks = document.getElementById('loginLinks');
    var adminLink = document.getElementById('adminLink');
    var profileLink = document.getElementById('profileLink');
    console.log(profileLink)

    if (currentUser) {
        var user = JSON.parse(currentUser);
        if (user && user.TenKhachHang) {
            var usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.textContent = 'Xin chào, ';
                loginLinks.textContent = user.TenKhachHang;
            }
            if (profileLink) {
                profileLink.innerText = 'Xem hồ sơ'; // Thay đổi nội dung của phần tử "profileLink" thành "Xem hồ sơ"
                profileLink.style.display = 'inline'; // Hiển thị nút "Xem hồ sơ"
            }
            if (loginLinks) {
                loginLinks.innerHTML = '<div style="color: #fff;">Xin chào, ' + user.TenKhachHang + '</div><a href="#" id="dx">Đăng xuất</a><a href="#">Hỏi đáp</a>';
            }
            console.log('Giá trị của user.isAdmin:', user.isAdmin);
            if (user.isAdmin === 1 && adminLink) {
                adminLink.innerHTML = '<a href="dashmin-1.0.0/index.html">Trang Quản Trị</a>';
            }
        } else {
            if (loginLinks) {
                loginLinks.innerHTML = '<a id="dn" href="./login.html">Đăng nhập</a><a href="#">Hỏi đáp</a>';
            }
        }
    } else {
        if (loginLinks) {
            loginLinks.innerHTML = '<a id="dn" href="./login.html">Đăng nhập</a><a href="#">Hỏi đáp</a>';
        }
    }

    // Thêm sự kiện cho phần đăng xuất
    document.addEventListener('click', function (event) {
        var target = event.target as HTMLElement;
        if (target && target.id === 'dx') {
            localStorage.removeItem('currentUser');
            window.location.href = './index.html'; // Chuyển về trang index sau khi đăng xuất
        }

        // Kiểm tra nếu người dùng không phải là admin và cố gắng truy cập trang quản trị
        if (target && target.id === 'adminLink') {
            if (user && user.isAdmin !== 1) {
                alert('Bạn không có quyền truy cập vào trang quản trị.');
                event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ a
            }
        }

        // Kiểm tra nếu người dùng nhấp vào liên kết profile
        if (target && target.id === 'profileLink') {
            // Điều hướng người dùng đến trang profile
            window.location.href = './profile.html'; // Thay thế 'profile.html' bằng đường dẫn thích hợp đến trang profile của bạn
        }
    });
});
