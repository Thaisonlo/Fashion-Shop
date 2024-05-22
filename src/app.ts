//khai bao api
export const url = 'http://localhost:3000/';

//   viết hàm fetch du lieu tu url tra ve mang json
    export const fetchAPI = async (url:string, option?: any) => {
    const response = await fetch(url, option);
    return response.json();
} 
