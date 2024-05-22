//Khai báo api
import { url, fetchAPI } from "../src/app.js";
import { showHome } from "../src/index.js";
import { showProducts } from "../src/shop.js"

//Khai báo lại url
const urlCategory = url + 'DanhMuc/';
const urlProduct = url + 'SanPham/';

//Láy tất cả thông tin danh mục
const getCategories = async () => {
    const option = {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
        }
    }
    const data = await fetchAPI(urlCategory, option);
    showCategories(data);
    return data; // Trả về dữ liệu danh mục
}


//Show danh mục index
const showCategories = (data) => {
    console.log('categories',data);
    const HTMLElement = document.getElementById('categories');
    HTMLElement.innerHTML = `
        <div class="col-lg-7 offset-lg-4">
        <div class="banner__item">
            <div class="banner__item__pic">
                <img src="../img/${data[0].Anh}" alt="">
            </div>
            <div class="banner__item__text">
                <h2>${data[0].TenDanhMuc}</h2>
                <a href="#">Mua ngay</a>
            </div>
        </div>
    </div>

    <div class="col-lg-5">
        <div class="banner__item banner__item--middle">
            <div class="banner__item__pic">
                <img src="../img/${data[1].Anh}" alt="">
            </div>
                <div class="banner__item__text">
                <h2>${data[1].TenDanhMuc}</h2>
                <a href="#">Mua ngay</a>
            </div>
        </div>
    </div>

    <div class="col-lg-7">
        <div class="banner__item banner__item--last">
            <div class="banner__item__pic">
                <img src="../img/${data[2].Anh}" alt="">
            </div>
            <div class="banner__item__text">
                <h2>${data[2].TenDanhMuc}</h2>
                <a href="#">Mua ngay</a>
            </div>
        </div>
    </div>
    `
}


// Hàm lấy tất cả danh mục

const getAllDanhmuc = async () => {
    try {
        // Gọi API để lấy danh mục
        const data = await fetchAPI(urlCategory);
        // Hiển thị danh mục lấy được
        showDanhmuc(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

// Hàm hiển thị danh mục
const showDanhmuc = async (data) => {
    const htmlElement = document.getElementById('loadDm');
    if (!htmlElement) return;
    htmlElement.innerHTML = data.map((item) => {
        return `
        <button id="${item.id}" class="category-button" data-filter=".new-arrivals">
            <img style="width:30px;" src="./img/${item.Anh}" alt="${item.TenDanhMuc}" style="width: 100px; height: 80px;">
            <span>${item.TenDanhMuc}</span>
        </button>`;
    }).join('');

      // Thêm sự kiện click cho từng nút danh mục
      const buttons = document.querySelectorAll('.category-button');
      buttons.forEach(button => {
          button.addEventListener('click', () => {
              const categoryId = button.id;
              locDanhmuc(parseInt(categoryId)); // Chuyển đổi categoryId thành số nguyên
          });
      });
  };

  // Thêm sự kiện click cho từng nút danh mục
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.id;
            locDanhmuc(parseInt(categoryId)); // Chuyển đổi categoryId thành số nguyên
        });
    });

//Hàm lọc sản phẩm theo danh mục
const locDanhmuc = async (id: number) => {
    try {
        // Gọi API để lấy tất cả sản phẩm
        const data = await fetchAPI(urlProduct);
        
        if (id === -1) {
            // Nếu id là -1, tức là người dùng muốn xem tất cả sản phẩm
            showHome(data); // Hiển thị tất cả sản phẩm
        } else {
            // Lọc sản phẩm theo danh mục id
            const filtered = data.filter(product => product.MaDanhMuc === id);
            // Hiển thị sản phẩm đã lọc
            showHome(filtered);
        }
    } catch (error) {
        console.error('Error filtering products:', error);
    }
}


//-----------------------------Categories_Shop----------------------------//

// Show categories ở shop
const showCategoriesShop = async (data) => {
    const HTMLElement = document.getElementById('categoriesShop');
    if (!HTMLElement) return;
    HTMLElement.innerHTML = data.map((cat) => {
        return `
            <a id="${cat.id}" >${cat.TenDanhMuc}</a>
        `;
    }).join('');
};

window.addEventListener('click', e => {
    const target = <HTMLElement>event.target;
    if (target.getAttribute('id')) {
        const id = target.getAttribute('id');
        locCate(+id);
    }
});

// Hàm lấy tất cả danh mục và hiển thị ở shop
const getAllDanhmucForShop = async () => {
    try {
        // Gọi API để lấy danh mục
        const data = await fetchAPI(urlCategory);
        // Hiển thị danh mục ở shop
        showCategoriesShop(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

// Lọc sản phẩm theo danh mục ID
const locCate = async (id: number) => {
    try {
        // Gọi API để lấy tất cả sản phẩm
        const data = await fetchAPI(urlProduct);
        // Lọc sản phẩm theo danh mục ID
        const filters = data.filter(product => product.MaDanhMuc === id);
        // Hiển thị sản phẩm đã lọc
        showProducts(filters);
    } catch (error) {
        console.error('Error filtering products:', error);
    }
}

// Hàm lấy tất cả danh mục và hiển thị ở shop khi trang được tải
getAllDanhmucForShop();

// Hàm lấy tất cả danh mục
getAllDanhmuc();
