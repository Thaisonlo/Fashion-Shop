var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const emailInput = document.querySelector('input[type="email"]');
            const passwordInput = document.querySelector('input[type="password"]');
            if (emailInput && passwordInput) {
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();
                if (email && password) {
                    try {
                        const response = yield fetch('http://localhost:3000/users');
                        const users = yield response.json();
                        const user = users.find(u => u.Email === email && u.MatKhau === password);
                        if (user) {
                            alert('Đăng nhập thành công');
                            localStorage.setItem('currentUser', JSON.stringify(user));
                            window.location.href = 'index.html';
                        }
                        else {
                            alert('Email hoặc mật khẩu không đúng');
                        }
                    }
                    catch (error) {
                        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
                        alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
                    }
                }
                else {
                    alert('Email hoặc mật khẩu không được để trống');
                }
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    var currentUser = localStorage.getItem('currentUser');
    var loginLinks = document.getElementById('loginLinks');
    var adminLink = document.getElementById('adminLink');
    var profileLink = document.getElementById('profileLink');
    console.log(profileLink);
    if (currentUser) {
        var user = JSON.parse(currentUser);
        if (user && user.TenKhachHang) {
            var usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.textContent = 'Xin chào, ';
                loginLinks.textContent = user.TenKhachHang;
            }
            if (profileLink) {
                profileLink.innerText = 'Xem hồ sơ';
                profileLink.style.display = 'inline';
            }
            if (loginLinks) {
                loginLinks.innerHTML = '<div style="color: #fff;">Xin chào, ' + user.TenKhachHang + '</div><a href="#" id="dx">Đăng xuất</a><a href="#">Hỏi đáp</a>';
            }
            console.log('Giá trị của user.isAdmin:', user.isAdmin);
            if (user.isAdmin === 1 && adminLink) {
                adminLink.innerHTML = '<a href="dashmin-1.0.0/index.html">Trang Quản Trị</a>';
            }
        }
        else {
            if (loginLinks) {
                loginLinks.innerHTML = '<a id="dn" href="./login.html">Đăng nhập</a><a href="#">Hỏi đáp</a>';
            }
        }
    }
    else {
        if (loginLinks) {
            loginLinks.innerHTML = '<a id="dn" href="./login.html">Đăng nhập</a><a href="#">Hỏi đáp</a>';
        }
    }
    document.addEventListener('click', function (event) {
        var target = event.target;
        if (target && target.id === 'dx') {
            localStorage.removeItem('currentUser');
            window.location.href = './index.html';
        }
        if (target && target.id === 'adminLink') {
            if (user && user.isAdmin !== 1) {
                alert('Bạn không có quyền truy cập vào trang quản trị.');
                event.preventDefault();
            }
        }
        if (target && target.id === 'profileLink') {
            window.location.href = './profile.html';
        }
    });
});
