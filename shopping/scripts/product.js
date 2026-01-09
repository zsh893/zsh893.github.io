// ===== product.js 商品详情页核心业务脚本 =====
// 核心变量
let currentProduct = null;

// 1. 从本地存储读取商品数据（含更新后的库存）
async function getProductData() {
    try {
        // 先读取本地存储的商品数据，没有则用初始数据
        const savedProductData = localStorage.getItem('productData');
        if (savedProductData) {
            globalProductData = JSON.parse(savedProductData);
            return globalProductData;
        }
        
        // 保存初始数据到本地存储
        localStorage.setItem('productData', JSON.stringify(INIT_PRODUCT_DATA));
        globalProductData = [...INIT_PRODUCT_DATA];
        return INIT_PRODUCT_DATA;
    } catch (e) {
        console.error("读取商品数据失败：", e);
        return [];
    }
}

// 读取URL参数中的商品ID
function getUrlProductId() {
    return new URLSearchParams(window.location.search).get('id') ? parseInt(new URLSearchParams(window.location.search).get('id')) : null;
}

// 渲染商品详情（带重置库存按钮）
function renderProductDetail(product) {
    currentProduct = product;
    const html = `
        <div class="row">
            <div class="col-md-5"><img src="pimg/${product.imgName}" alt="${product.name}" class="product-img"></div>
            <div class="col-md-7">
                <h2 class="product-name">${product.name}</h2>
                <p class="product-price">¥${product.price}</p>
                <p class="product-stock">库存状态：<span class="stock-num" id="stockNum">${product.stock}</span> 件</p>
                <div class="product-attrs">
                    <p class="product-attr"><span>分类：</span>${product.categoryName}</p>
                    <p class="product-attr"><span>简介：</span>${product.intro}</p>
                    <p class="product-attr"><span>特点：</span>${product.features}</p>
                    <p class="product-attr"><span>产地：</span>${product.origin}</p>
                    <p class="product-attr"><span>颜色：</span>${product.color}</p>
                    <p class="product-attr"><span>规格：</span>${product.spec}</p>
                </div>
                <div class="quantity-wrap">
                    <span class="quantity-label">购买数量：</span>
                    <input type="number" class="quantity-input" id="quantityInput" value="1" min="1" max="${product.stock}">
                </div>
                <div class="btn-wrap">
                    <button class="btn-add-cart" id="addToCartBtn">加入购物车</button>
                    <button class="btn-continue" onclick="window.location.href='index.html'">继续购物</button>
                    <button class="btn-reset-stock" id="resetStockBtn" onclick="resetProductStock(${product.id})">重置该商品库存</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('productDetail').innerHTML = html;
    
    // 绑定事件
    document.getElementById('addToCartBtn').addEventListener('click', addToCart);
    document.getElementById('quantityInput').addEventListener('input', function() {
        this.value = Math.max(1, Math.min(product.stock, parseInt(this.value) || 1));
    });
}

// 统一获取登录用户名的函数
function getLoginUsername() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const oldUsername = localStorage.getItem('loginUser');
    return userInfo.username || oldUsername;
}

// 更新商品库存（减少库存）
function updateProductStock(productId, reduceNum) {
    const productIndex = globalProductData.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        globalProductData[productIndex].stock = Math.max(0, globalProductData[productIndex].stock - reduceNum);
        localStorage.setItem('productData', JSON.stringify(globalProductData));
        // 更新页面显示
        currentProduct.stock = globalProductData[productIndex].stock;
        document.getElementById('stockNum').textContent = currentProduct.stock;
        document.getElementById('quantityInput').max = currentProduct.stock;
    }
}

// 恢复商品库存（删除购物车时调用）
function restoreProductStock(productId, addNum) {
    const productIndex = globalProductData.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        // 恢复库存（不超过初始库存）
        const initStock = INIT_PRODUCT_DATA.find(item => item.id === productId).stock;
        globalProductData[productIndex].stock = Math.min(initStock, globalProductData[productIndex].stock + addNum);
        localStorage.setItem('productData', JSON.stringify(globalProductData));
        // 如果当前页面是该商品，更新显示
        if (currentProduct && currentProduct.id === productId) {
            currentProduct.stock = globalProductData[productIndex].stock;
            document.getElementById('stockNum').textContent = currentProduct.stock;
            document.getElementById('quantityInput').max = currentProduct.stock;
        }
    }
}

// 重置单个商品的库存为初始值
function resetProductStock(productId) {
    if (confirm(`确定要将【${currentProduct.name}】的库存重置为初始值（${INIT_PRODUCT_DATA.find(item => item.id === productId).stock}件）吗？`)) {
        const initStock = INIT_PRODUCT_DATA.find(item => item.id === productId).stock;
        const productIndex = globalProductData.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
            globalProductData[productIndex].stock = initStock;
            localStorage.setItem('productData', JSON.stringify(globalProductData));
            // 更新页面显示
            currentProduct.stock = initStock;
            document.getElementById('stockNum').textContent = initStock;
            document.getElementById('quantityInput').max = initStock;
            showToast('库存重置成功！');
        }
    }
}

// 加入购物车（库存减少）
function addToCart() {
    // 登录校验
    const username = getLoginUsername();
    if (!username) {
        if (confirm('请先登录！是否前往登录页？')) {
            window.location.href = 'login.html';
        }
        return;
    }

    // 库存判断
    const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
    if (quantity > currentProduct.stock) {
        showToast(`库存不足！最多可购${currentProduct.stock}件`);
        return;
    }

    // 处理购物车逻辑
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existItem = cart.find(item => item.id === currentProduct.id);
    
    let addQuantity = quantity;
    if (existItem) {
        const newQuantity = Math.min(existItem.quantity + quantity, currentProduct.stock);
        addQuantity = newQuantity - existItem.quantity;
        existItem.quantity = newQuantity;
    } else {
        cart.push({
            id: currentProduct.id, 
            name: currentProduct.name, 
            price: currentProduct.price, 
            quantity: quantity, 
            img: currentProduct.imgName,
            desc: currentProduct.intro
        });
    }

    // 保存购物车数据
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 减少库存
    updateProductStock(currentProduct.id, addQuantity);
    
    showToast(`成功加入${addQuantity}件商品到购物车！`);
    calculateCartCount();
}

// 购物车删除商品时恢复库存 供购物车页面调用
window.restoreStockAfterDelete = function(productId, deleteQuantity) {
    restoreProductStock(productId, deleteQuantity);
    calculateCartCount();
}

// 辅助函数：提示弹窗、登录状态、购物车计数
function showToast(msg, duration=2000) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', duration);
}

function checkLoginStatus() {
    const username = getLoginUsername();
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

function calculateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = totalCount;
    }
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('loginUser');
        localStorage.removeItem('userInfo');
        alert('退出成功！');
        window.location.reload();
    }
}

// 页面初始化
async function init() {
    checkLoginStatus();
    calculateCartCount();
    
    const productId = getUrlProductId();
    if (!productId) {
        document.getElementById('productDetail').innerHTML = `<div class="text-center py-5"><p class="text-danger fs-4">未找到指定商品！</p><a href="index.html" class="btn btn-primary mt-3">返回首页</a></div>`;
        return;
    }

    await getProductData();
    const product = globalProductData.find(item => item.id === productId);
    
    if (!product) {
        document.getElementById('productDetail').innerHTML = `<div class="text-center py-5"><p class="text-danger fs-4">商品不存在！</p><a href="index.html" class="btn btn-primary mt-3">返回首页</a></div>`;
        return;
    }

    renderProductDetail(product);
}

window.onload = init;