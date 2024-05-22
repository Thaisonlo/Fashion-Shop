import { url, fetchAPI } from "../src/app.js";
import { Categories } from "../models/category.js"

const urlCategories = url + 'DanhMuc/';
const getAllCategories = async () => {
    const data = await fetchAPI(urlCategories);
    showCategories(data);
    console.log('Categories',data);
}

//Show danh mục
const showCategories = (data) => {
  const tablebody = document.getElementById('table-body-cate');
  tablebody.innerHTML = data.map((category, index) => {
      return `
      <tr>
          <td>${index+1}</td>
          <td>${category.Anh}</td>
          <td>${category.TenDanhMuc}</td>
          <td>
              <button class="btn btn-sm btn-primary" name="edit" id=${category.id}>Edit</button>
              <button class="btn btn-sm btn-primary" name="remove" id=${category.id}>Remove</button>
          </td>
      </tr>
      `
  }).join('');
}

// Lấy danh sách danh mục theo catalogid

const getProductsByCatalogId =async (catalogid) =>{
    const  urlProCataId = urlCategories+ '?MaDanhMuc=' + catalogid;
    const data = await fetchAPI(urlProCataId);
    showCategories(data);
}

// Lấy danh sách sản phẩm theo id
const getCategoryById = async (id) =>{
    const urlProCataId = urlCategories + id;
    const data = await fetchAPI(urlProCataId);
     return data;
}

// Xoa san pham theo id 
const removeCategories = async (id) => {
    const urlProduct_id = urlCategories + id 
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    await fetchAPI(urlProduct_id,option);
    getAllCategories();
}

const submitForm = ()=>{
    const hiddentId = (<HTMLInputElement>document.getElementById("id")).value;
    if(hiddentId=="") { 
        // Them moi
        addNewCategory();
    }else{
        updateCategory(hiddentId);
    }
}

const addNewCategory = async ()=>{
    // lay du lieu tu form
    const TenDanhMuc = (<HTMLInputElement>document.getElementById("TenDanhMuc")).value;
    // Tao doi tuong moi tu du lieu moi nhan duoc
    const category = new Categories(TenDanhMuc);
    // Them doi tuong moi vao db.json
    // Xac dinh url: urlProducts = http://localhost:3000/products/
    // option: method:POST
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(category)
    }
    // them vao db
    await fetchAPI(urlCategories,option);
    // Load lai san pham
    getAllCategories();
}

const updateCategory = async (id) =>{
    // lay du lieu tu form
    const TenDanhMuc = (<HTMLInputElement>document.getElementById("TenDanhMuc")).value;
    // Tao doi tuong moi tu du lieu moi nhan duoc
    const category = new Categories(TenDanhMuc);
    // Thaythong tin của doi tuong trong db.json
    // Xac dinh url: urlcategorys = http://localhost:3000/categorys/1
    // option: method:PUT
    const urlEdit =  urlCategories + id
    const option = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(category)
    }
    // them vao db
    await fetchAPI(urlEdit,option);
    // Load lai san pham
    getAllCategories();
}

// Load sản phẩm đang được chọn ra form
const loadCategory =async (id) =>{
    //Lấy sp từ db về
    const data = await getCategoryById(id);
    console.log(data);
    
    // show ra giao dien
    (<HTMLInputElement>document.getElementById("TenDanhMuc")).value = data.TenDanhMuc;
    (<HTMLInputElement>document.getElementById("id")).value = data.id;
}

// thực thi sự kiện click khi dùng module
window.addEventListener('click' , e => {
    const elementName = (<HTMLButtonElement>e.target).name;     
    const elementId = (<HTMLButtonElement>e.target).id;   
    console.log(elementId);
    
    switch (elementName) {
        case 'edit':
            loadCategory(elementId);
            break;
        case 'remove':
            removeCategories(elementId);
            break;
        case 'btnSubmit':
            submitForm();
            break;
        default:
            break;
    }
})

getAllCategories();