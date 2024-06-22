 // 从 utils 文件夹中的 ajax.js 文件导入 ajax 请求模块，并重命名为 request
import {ajax as request} from '../utils/ajax.js'; 
import '../lib/jquery.js';  // 导入 jQuery 库

// 显示商品信息函数
async function displayProduct() {
    // 检查商品 ID 是否存在
    const productId = sessionStorage.getItem('id');  // 从 sessionStorage 中获取商品 ID
    if (!productId) {  // 如果商品 ID 不存在
        alert('非法访问');  // 弹出警告信息
        window.location.href = './list.html';  // 重定向到商品列表页面
        return;  // 终止函数执行
    }

    // 获取商品详细信息
    try {
        const response = await request.get(`/goods/item/${productId}`);  // 发送 GET 请求以获取商品详细信息
        const { data: { code, info } } = response;  // 解构响应对象，获取 code 和 info 属性

        if (code !== 1) {  // 如果返回的 code 不是 1，表示获取商品详情失败
            alert('获取商品详情失败');  // 弹出警告信息
            window.location.href = './list.html';  // 重定向到商品列表页面
            return;  // 终止函数执行
        }

        // 更新页面内容
        updatePage(info);  // 调用 updatePage 函数更新页面内容
    } catch (error) {
        console.error('请求失败:', error);  // 在控制台输出请求失败的错误信息
        alert('获取商品详情失败');  // 弹出警告信息
        window.location.href = './list.html';  // 重定向到商品列表页面
    }
}

// 更新页面内容函数
function updatePage(productInfo) {
    $('.title').text(productInfo.title);  // 更新页面上的商品标题
    $('.middleimg').attr('src', productInfo.img_big_logo);  // 更新页面上的商品大图
    $('.desc').html(productInfo.goods_introduce);  // 更新页面上的商品描述
    $('.old').text(productInfo.price);  // 更新页面上的商品原价
    $('.discount').text((productInfo.current_price / productInfo.price).toFixed(2));  // 计算并更新页面上的折扣比例
    $('.curprice').text(productInfo.current_price);  // 更新页面上的商品现价
}

// 执行显示商品信息函数
displayProduct();  // 调用 displayProduct 函数显示商品信息
