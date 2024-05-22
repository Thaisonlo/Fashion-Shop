var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { url, fetchAPI } from "../src/app.js";
import { showHome } from "../src/index.js";
import { showProducts } from "../src/shop.js";
const urlCategory = url + 'DanhMuc/';
const urlProduct = url + 'SanPham/';
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const option = {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
        }
    };
    const data = yield fetchAPI(urlCategory, option);
    showCategories(data);
    return data;
});
const showCategories = (data) => {
    console.log('categories', data);
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
    `;
};
const getAllDanhmuc = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchAPI(urlCategory);
        showDanhmuc(data);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
    }
});
const showDanhmuc = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlElement = document.getElementById('loadDm');
    if (!htmlElement)
        return;
    htmlElement.innerHTML = data.map((item) => {
        return `
        <button id="${item.id}" class="category-button" data-filter=".new-arrivals">
            <img style="width:30px;" src="./img/${item.Anh}" alt="${item.TenDanhMuc}" style="width: 100px; height: 80px;">
            <span>${item.TenDanhMuc}</span>
        </button>`;
    }).join('');
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.id;
            locDanhmuc(parseInt(categoryId));
        });
    });
});
const buttons = document.querySelectorAll('.category-button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const categoryId = button.id;
        locDanhmuc(parseInt(categoryId));
    });
});
const locDanhmuc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchAPI(urlProduct);
        if (id === -1) {
            showHome(data);
        }
        else {
            const filtered = data.filter(product => product.MaDanhMuc === id);
            showHome(filtered);
        }
    }
    catch (error) {
        console.error('Error filtering products:', error);
    }
});
const showCategoriesShop = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const HTMLElement = document.getElementById('categoriesShop');
    if (!HTMLElement)
        return;
    HTMLElement.innerHTML = data.map((cat) => {
        return `
            <a id="${cat.id}" >${cat.TenDanhMuc}</a>
        `;
    }).join('');
});
window.addEventListener('click', e => {
    const target = event.target;
    if (target.getAttribute('id')) {
        const id = target.getAttribute('id');
        locCate(+id);
    }
});
const getAllDanhmucForShop = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchAPI(urlCategory);
        showCategoriesShop(data);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
    }
});
const locCate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchAPI(urlProduct);
        const filters = data.filter(product => product.MaDanhMuc === id);
        showProducts(filters);
    }
    catch (error) {
        console.error('Error filtering products:', error);
    }
});
getAllDanhmucForShop();
getAllDanhmuc();
