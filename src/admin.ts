import { url, fetchAPI } from "../src/app.js";
import { Product } from "../models/product.js";

const urlProduct = url + 'SanPham/';
const getAllProducts = async () => {
    const data = await fetchAPI(urlProduct);
    showProducts(data);
    console.log('Products',data);
}

//Show sản phẩm 
const showProducts = (data) => {
    const tablebody = document.getElementById('table-body');
    tablebody.innerHTML = data.map((product, index) => {
        return `
        <tr>
            <td>${index+1}</td>
            <td>${product.Anh}</td>
            <td>${product.MaDanhMuc}</td>
            <td>${product.TenSanPham}</td>
            <td>${product.Gia}</td>
            <td>${product.MoTa}</td>
            <td>
                <button class="btn btn-sm btn-primary" name="edit" id=${product.id}>Edit</button>
                <button class="btn btn-sm btn-primary" name="remove" id=${product.id}>Remove</button>
            </td>
        </tr>
        `
    }).join('');
}

// Lấy danh sách sản phẩm theo catalogid
const getProductsByCatalogId =async (catalogid) =>{
    const  urlProCataId = urlProduct + '?MaDanhMuc=' + catalogid;
    const data = await fetchAPI(urlProCataId);
    showProducts(data);
}

// Lấy danh sách sản phẩm theo id
const getProductById = async (id) =>{
    const  urlProCataId = urlProduct + id;
    const data = await fetchAPI(urlProCataId);
     return data;
}

// Xoa san pham theo id 
const removeProduct = async (id) => {
    const urlProduct_id = urlProduct + id 
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    await fetchAPI(urlProduct_id,option);
    getAllProducts();
}

const submitForm = ()=>{
    const hiddentId = (<HTMLInputElement>document.getElementById("id")).value;
    if(hiddentId=="") { 
        // Them moi
        addNewProduct();
    }else{
        updateProduct(hiddentId);
    }
}

const addNewProduct = async ()=>{
    // lay du lieu tu form
    const TenSanPham = (<HTMLInputElement>document.getElementById("TenSanPham")).value;
    const Gia = parseFloat((<HTMLInputElement>document.getElementById("Gia")).value);
    const MaDanhMuc = (<HTMLInputElement>document.getElementById("MaDanhMuc")).value;
    const MoTa = (<HTMLInputElement>document.getElementById("MoTa")).value;
    // Tao doi tuong moi tu du lieu moi nhan duoc
    const product = new Product(TenSanPham, Gia, MaDanhMuc,MoTa);
    // Them doi tuong moi vao db.json
    // Xac dinh url: urlProducts = http://localhost:3000/products/
    // option: method:POST
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(product)
    }
    // them vao db
    await fetchAPI(urlProduct,option);
    // Load lai san pham
    getAllProducts();
}

const updateProduct = async (id) =>{
    // lay du lieu tu form
    const TenSanPham = (<HTMLInputElement>document.getElementById("TenSanPham")).value;
    const Gia = parseFloat((<HTMLInputElement>document.getElementById("Gia")).value);
    const MaDanhMuc = (<HTMLInputElement>document.getElementById("MaDanhMuc")).value;
    const MoTa = (<HTMLInputElement>document.getElementById("MoTa")).value;
    // Tao doi tuong moi tu du lieu moi nhan duoc
    const product = new Product(TenSanPham, Gia, MaDanhMuc, MoTa);
    // Thaythong tin của doi tuong trong db.json
    // Xac dinh url: urlProducts = http://localhost:3000/products/1
    // option: method:PUT
    const urlEdit =  urlProduct + id
    const option = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(product)
    }
    // them vao db
    await fetchAPI(urlEdit,option);
    // Load lai san pham
    getAllProducts();
}

// Load sản phẩm đang được chọn ra form
const loadProduct =async (id) =>{
    //Lấy sp từ db về
    const data = await getProductById(id);
    console.log(data);
    
    // show ra giao dien
    (<HTMLInputElement>document.getElementById("TenSanPham")).value = data.TenSanPham;
    (<HTMLInputElement>document.getElementById("Gia")).value = data.Gia;
    (<HTMLInputElement>document.getElementById("MaDanhMuc")).value = data.MaDanhMuc;
    (<HTMLInputElement>document.getElementById("MoTa")).value = data.MoTa;
    (<HTMLInputElement>document.getElementById("id")).value = data.id;
}
// thực thi sự kiện click khi dùng module
window.addEventListener('click' , e => {
    const elementName = (<HTMLButtonElement>e.target).name;     
    const elementId = (<HTMLButtonElement>e.target).id;   
    console.log(elementId);
    
    switch (elementName) {
        case 'edit':
            loadProduct(elementId);
            break;
        case 'remove':
            removeProduct(elementId);
            break;
        case 'btnSubmit':
            submitForm();
            break;
        default:
            break;
    }
})

getAllProducts();