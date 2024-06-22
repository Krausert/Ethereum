import '../lib/jquery.js';  // 导入 jQuery 库
// 从 utils 文件夹中的 ajax.js 文件导入 ajax 请求模块并重命名为 request
import { ajax as request } from '../utils/ajax.js'; 

// 缓存页面中的 DOM 元素
const elements = {
    listBox: $('.list'),  // 商品列表容器
    categoryBox: $('.category'),  // 分类容器
    filterBox: $('.filterBox').first(),  // 热销/折扣筛选容器
    saleBox: $('.saleBox'),  // 折扣筛选容器
    sortBox: $('.sortBox'),  // 排序选项容器
    searchBox: $('.search'),  // 搜索输入框
    firstBtn: $('.first'),  // 首页按钮
    prevBtn: $('.prev'),  // 上一页按钮
    nextBtn: $('.next'),  // 下一页按钮
    lastBtn: $('.last'),  // 末页按钮
    totalBox: $('.total'),  // 当前页和总页数显示区域
    pagesizeBox: $('.pagesize'),  // 每页显示条数选择框
    jumpBox: $('.jump'),  // 跳转页输入框
    jumpBtn: $('.go')  // 跳转按钮
};

// 初始化请求参数
let totalPage;
const requestData = {
    current: 1,  // 当前页码
    pagesize: 12,  // 每页显示的条数
    search: '',  // 搜索关键字
    filter: '',  // 筛选条件，热销或折扣
    saleType: 10,  // 折扣类型
    sortType: 'id',  // 排序类型，可以是id、sale或price
    sortMethod: 'ASC',  // 排序方式，升序或降序
    category: ''  // 分类，默认为全部
};

// 渲染分类列表
async function renderCategory() {
    try {
        // 获取分类数据
        const response = await request.get('/goods/category');
        const code = response.data.code;
        const list = response.data.list;

        if (code !== 1) console.log('获取分类列表失败');

        // 清空当前分类内容，并添加“全部”选项
        elements.categoryBox.empty();
        let categoryHtml = '<li class="active">全部</li>';
        list.forEach(function(category) {
            categoryHtml += `<li>${category}</li>`;
        });
        elements.categoryBox.html(categoryHtml);
    } catch (error) {
        console.error(error.message);
    }
}

// 渲染商品列表
async function renderList() {
    try {
        // 获取商品数据
        const response = await request.get('/goods/list', { params: requestData });
        const code = response.data.code;
        const list = response.data.list;
        const total = response.data.total;

        if (code !== 1) console.log('获取商品列表失败');

        // 渲染商品列表
        let listHtml = '';
        list.forEach(function(item) {
            listHtml += `
                <li data-id="${item.goods_id}">
                    <div class="show">
                        <img src="${item.img_big_logo}">
                        ${item.is_hot ? '<span class="hot">热销</span>' : ''}
                        ${item.is_sale ? '<span>折扣</span>' : ''}
                    </div>
                    <div class="info">
                        <p class="title">${item.title}</p>
                        <p class="price">
                            <span class="curr">¥ ${item.current_price}</span>
                            <span class="old">¥ ${item.price}</span>
                        </p>        
                    </div>
                </li>`;
        });

        // 如果没有商品，显示“无商品”图片
        if (list.length === 0) {
            requestData.current = 0;
            listHtml = '<img src="../img/no.png" alt="">';
        }

        elements.listBox.html(listHtml);

        // 更新页码显示
        totalPage = total;
        elements.totalBox.text(requestData.current + ' / ' + totalPage);
        elements.jumpBox.val(requestData.current);

        // 更新分页按钮状态
        updatePagination();
    } catch (error) {
        console.error(error.message);
    }
}

// 更新分页按钮状态
function updatePagination() {
    // 启用所有分页按钮
    elements.prevBtn.removeClass('disable');
    elements.nextBtn.removeClass('disable');
    elements.firstBtn.removeClass('disable');
    elements.lastBtn.removeClass('disable');

    // 禁用首页和上一页按钮
    if (requestData.current <= 1) {
        elements.prevBtn.addClass('disable');
        elements.firstBtn.addClass('disable');
    }

    // 禁用末页和下一页按钮
    if (requestData.current === totalPage) {
        elements.nextBtn.addClass('disable');
        elements.lastBtn.addClass('disable');
    }
}

// 分类点击
elements.categoryBox.on('click', function(event) {
    const target = event.target;
    if (target.nodeName === 'LI') {
        // 切换激活状态
        elements.categoryBox.children().removeClass('active');
        target.classList.add('active');

        // 更新请求参数并重新渲染商品列表
        requestData.category = target.innerText === '全部' ? '' : target.innerText;
        renderList();
    }
});

// 首页按钮点击
elements.firstBtn.on('click', function() {
    requestData.current = 1;
    renderList();
});

// 末页按钮点击
elements.lastBtn.on('click', function() {
    requestData.current = totalPage;
    renderList();
});

// 上一页按钮点击
elements.prevBtn.on('click', function() {
    if (requestData.current > 1) requestData.current--;
    renderList();
});

// 下一页按钮点击
elements.nextBtn.on('click', function() {
    if (requestData.current < totalPage) requestData.current++;
    renderList();
});

// 跳转按钮点击
elements.jumpBtn.on('click', function() {
    const targetPage = parseInt(elements.jumpBox.val(), 10);
    if (targetPage < 1 || targetPage > totalPage) {
        alert('跳转页不合法');
    } else {
        requestData.current = targetPage;
        renderList();
    }
});

// 每页显示条数更改
elements.pagesizeBox.on('change', function() {
    requestData.pagesize = parseInt(elements.pagesizeBox.val(), 10);
    requestData.current = 1;
    renderList();
});

// 热销/折扣筛选点击
elements.filterBox.on('click', function(event) {
    const target = event.target;
    if (target.nodeName === 'LI') {
        // 切换激活状态
        elements.filterBox.children().removeClass('active');
        target.classList.add('active');

        // 更新请求参数并重新渲染商品列表
        requestData.filter = target.dataset.type;
        requestData.current = 1;
        renderList();
    }
});

// 折扣筛选点击
elements.saleBox.on('click', function(event) {
    const target = event.target;
    if (target.nodeName === 'LI') {
        // 切换激活状态
        elements.saleBox.children().removeClass('active');
        target.classList.add('active');

        // 更新请求参数并重新渲染商品列表
        requestData.saleType = target.dataset.type;
        requestData.current = 1;
        renderList();
    }
});

// 排序选项点击
elements.sortBox.on('click', function(event) {
    const target = event.target;
    if (target.nodeName === 'LI') {
        // 切换激活状态
        elements.sortBox.children().removeClass('active');
        target.classList.add('active');

        // 更新请求参数并重新渲染商品列表
        requestData.sortType = target.dataset.type;
        requestData.sortMethod = target.dataset.method;
        requestData.current = 1;
        renderList();
    }
});

// 搜索输入框输入
elements.searchBox.on('input', function() {
    requestData.search = elements.searchBox.val();
    requestData.current = 1;
    renderList();
});

// 商品列表点击
elements.listBox.on('click', function(event) {
    const target = event.target.closest('li');
    if (target) {
        const productId = target.dataset.id;
        sessionStorage.setItem('id', productId);
        window.location.href = './detail.html';
    }
});

// 初始化页面
renderCategory();
renderList();
