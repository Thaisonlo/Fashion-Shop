var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.getElementById("registerForm").addEventListener("submit", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const username = document.getElementById("usernameInput").value;
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;
        const confirmPassword = document.getElementById("confirmPasswordInput").value;
        if (!username || !email || !password || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin đăng ký.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp. Vui lòng thử lại.");
            return;
        }
        if (password.length < 6) {
            alert("Mật khẩu cần ít nhất 6 kí tự.");
            return;
        }
        try {
            const emailCheckResponse = yield fetch(`http://localhost:3000/users?Email=${email}`);
            const usersWithEmail = yield emailCheckResponse.json();
            if (usersWithEmail.length > 0) {
                alert("Email đã được sử dụng. Vui lòng chọn email khác.");
                return;
            }
            const newUser = {
                TenKhachHang: username,
                Email: email,
                MatKhau: password,
            };
            const response = yield fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            if (!response.ok) {
                throw new Error('Đăng ký không thành công. Vui lòng thử lại sau.');
            }
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            alert("Đăng ký thành công!");
            window.location.href = "/login.html";
        }
        catch (error) {
            console.error("Lỗi khi xử lý dữ liệu:", error);
            alert("Lỗi khi đăng ký. Vui lòng thử lại sau.");
        }
    });
});
