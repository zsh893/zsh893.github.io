// 分页配置
const pageConfig = {
    pageSize: 6, // 每页显示6个商品
    currentPage: 1, // 当前页码
    totalPages: Math.ceil(productData.length / 6) // 总页数
};

// 渲染商品列表 ✔核心修改：商品图片路径改为 pimg/${product.imgName}
function renderProductList(pageNum) {
    const productList = document.getElementById('productList');
    const startIndex = (pageNum - 1) * pageConfig.pageSize;
    const endIndex = Math.min(startIndex + pageConfig.pageSize, productData.length);
    const currentProducts = productData.slice(startIndex, endIndex);
    
    let html = '';
    currentProducts.forEach(product => {
        html += `
            <div class="col-md-4">
                <div class="product-card">
                    <img src="pimg/${product.imgName}" alt="${product.name}" 
                         onclick="window.location.href='product_detail.html?id=${product.id}'">
                    <h5><a href="product_detail.html?id=${product.id}">${product.name}</a></h5>
                    <p class="text-muted">${product.intro}</p>
                    <p class="stock-info">库存：${product.stock}件</p>
                    <p class="product-price">¥${product.price}</p>
                    <a href="product_detail.html?id=${product.id}" class="btn btn-primary btn-sm">查看详情</a>
                </div>
            </div>
        `;
    });
    
    productList.innerHTML = html;
}

// 渲染分页控件
function renderPagination() {
    const pagination = document.getElementById('pagination');
    let html = '';
    
    // 上一页
    html += `
        <li class="page-item ${pageConfig.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${pageConfig.currentPage - 1})">上一页</a>
        </li>
    `;
    
    // 页码按钮
    for (let i = 1; i <= pageConfig.totalPages; i++) {
        html += `
            <li class="page-item ${i === pageConfig.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    // 下一页
    html += `
        <li class="page-item ${pageConfig.currentPage === pageConfig.totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${pageConfig.currentPage + 1})">下一页</a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

// 切换页码
function changePage(pageNum) {
    if (pageNum < 1 || pageNum > pageConfig.totalPages) return;
    pageConfig.currentPage = pageNum;
    renderProductList(pageNum);
    renderPagination();
    document.getElementById('productList').scrollIntoView({ behavior: 'smooth' });
}

// 统一的登录状态检查函数（兼容两种存储方式）
function checkLoginStatus() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const oldUsername = localStorage.getItem('loginUser');
    const username = userInfo.username || oldUsername;
    
    const userAuthArea = document.getElementById('userAuthArea');
    
    if (username) {
        userAuthArea.innerHTML = `
            <span class="username">欢迎，${username}</span>
            <a href="javascript:logout()" class="me-2">退出登录</a>
            <a href="cart.html" class="cart-icon">
                <i class="fa fa-shopping-cart"></i>
                <span class="cart-badge" id="cartCount">0</span>
            </a>
        `;
    } else {
        userAuthArea.innerHTML = `
            <a href="login.html" class="me-2">登录</a>
            <a href="reg.html" class="me-2">注册</a>
            <a href="cart.html" class="cart-icon">
                <i class="fa fa-shopping-cart"></i>
                <span class="cart-badge" id="cartCount">0</span>
            </a>
        `;
    }
}

// 计算购物车商品总数
function calculateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let totalCount = 0;
    cart.forEach(item => {
        totalCount += item.quantity || 0; // 防止quantity为空的情况
    });
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = totalCount;
    }
}

// 统一的退出登录函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('loginUser');
        localStorage.removeItem('userInfo');
        alert('已成功退出登录！');
        window.location.reload();
    }
}

// 页面初始化
function init() {
    checkLoginStatus();
    calculateCartCount();
    renderProductList(pageConfig.currentPage);
    renderPagination();
}

// 页面加载完成后初始化 必须保留
window.onload = init;