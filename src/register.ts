document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Ngăn chặn form từ việc submit mặc định

    // Lấy giá trị từ các trường nhập liệu
    const username = (document.getElementById("usernameInput") as HTMLInputElement).value;
    const email = (document.getElementById("emailInput") as HTMLInputElement).value;
    const password = (document.getElementById("passwordInput") as HTMLInputElement).value;
    const confirmPassword = (document.getElementById("confirmPasswordInput") as HTMLInputElement).value;    

    // Kiểm tra xác nhận mật khẩu và các trường nhập liệu còn thiếu
    if (!username || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin đăng ký.");
        return; // Không chuyển trang nếu còn trường nhập liệu còn thiếu
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp. Vui lòng thử lại.");
        return;
    }

    // Kiểm tra số lượng kí tự mật khẩu
    if (password.length < 6) {
        alert("Mật khẩu cần ít nhất 6 kí tự.");
        return;
    }

    try {
        // Kiểm tra trùng email
        const emailCheckResponse = await fetch(`http://localhost:3000/users?Email=${email}`);
        const usersWithEmail = await emailCheckResponse.json();
        if (usersWithEmail.length > 0) {
            alert("Email đã được sử dụng. Vui lòng chọn email khác.");
            return;
        }

        // Tạo đối tượng người dùng mới
        const newUser = {
            TenKhachHang: username,
            Email: email,
            MatKhau: password,
        };
    
        // Gửi yêu cầu đăng ký đến máy chủ (cần thay đổi URL tương ứng)
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });
    
        // Kiểm tra kết quả của yêu cầu đăng ký
        if (!response.ok) {
            throw new Error('Đăng ký không thành công. Vui lòng thử lại sau.');
        }
    
        // Lưu thông tin người dùng đã đăng ký vào localStorage
        localStorage.setItem('currentUser', JSON.stringify(newUser));
    
        // Hiển thị thông báo đăng ký thành công
        alert("Đăng ký thành công!");
    
        // Chuyển hướng người dùng đến trang đăng nhập
        window.location.href = "/login.html";
    } catch (error) {
        console.error("Lỗi khi xử lý dữ liệu:", error);
        alert("Lỗi khi đăng ký. Vui lòng thử lại sau.");
    }
});