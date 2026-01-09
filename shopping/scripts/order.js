// ===== order.js 订单确认页核心业务脚本 =====
// ===================== 复用全站通用核心函数 =====================
// 统一获取登录用户名的函数（兼容两种存储格式）
function getLoginUsername() {
    // 优先读取新格式（userInfo对象），兼容旧格式（loginUser字符串）
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const oldUsername = localStorage.getItem('loginUser');
    return userInfo.username || oldUsername;
}

// 退出登录函数（和购物车页统一）
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 清除两种格式的登录信息，确保完全退出
        localStorage.removeItem('loginUser');
        localStorage.removeItem('userInfo');
        alert('退出成功！');
        window.location.reload();
    }
}

// 计算购物车商品总数（用于角标）
function calculateCartTotalCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

// 检查并更新登录状态显示（完全复用购物车页逻辑）
function checkLoginStatus() {
    const username = getLoginUsername();
    const userAuthArea = document.getElementById('userAuthArea');
    const cartCount = calculateCartTotalCount();
    
    if (username) {
        userAuthArea.innerHTML = `
            <span class="username">欢迎，${username}</span>
            <a href="javascript:logout()" class="me-2">退出登录</a>
            <a href="cart.html" class="cart-icon ms-2">
                <i class="fa fa-shopping-cart"></i>
                <span class="cart-badge" id="cartCount">${cartCount}</span>
            </a>
        `;
    } else {
        userAuthArea.innerHTML = `
            <a href="login.html" class="me-2">登录</a>
            <a href="reg.html" class="me-2">注册</a>
            <a href="cart.html" class="cart-icon ms-2">
                <i class="fa fa-shopping-cart"></i>
                <span class="cart-badge" id="cartCount">${cartCount}</span>
            </a>
        `;
    }
}

// ===================== 订单页专属函数 =====================
// 渲染订单商品：仅读取购物车中勾选的商品
function renderOrderGoods() {
    const orderGoods = document.getElementById('orderGoods');
    const orderTotal = document.getElementById('orderTotal');
    const addressSection = document.getElementById('addressSection');
    const paymentSection = document.getElementById('paymentSection');
    const submitSection = document.getElementById('submitSection');
    let cartData = [];
    let checkedGoods = [];
    let total = 0;

    // 1. 读取购物车数据（仅保留勾选的商品）
    try {
        cartData = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
        // 严格过滤：只保留checked为true的商品（兼容购物车未设置checked的情况，默认视为未勾选）
        checkedGoods = cartData.filter(item => item.checked === true);
    } catch (e) {
        console.log("购物车数据读取失败：", e);
        checkedGoods = [];
    }

    // 2. 无勾选商品：隐藏地址/支付/提交区域，显示空订单提示
    if (checkedGoods.length === 0) {
        orderGoods.innerHTML = `
            <div class="empty-order">
                <h5>暂无选中的商品</h5>
                <p>请返回购物车选择需要结算的商品</p>
                <a href="cart.html" class="btn btn-primary">返回购物车</a>
            </div>
        `;
        orderTotal.textContent = '¥0';
        // 隐藏结算相关区域
        addressSection.style.display = 'none';
        paymentSection.style.display = 'none';
        submitSection.style.display = 'none';
        return;
    }

    // 3. 有勾选商品：正常渲染，显示结算相关区域
    addressSection.style.display = 'block';
    paymentSection.style.display = 'block';
    submitSection.style.display = 'block';
    
    let goodsHtml = '';
    checkedGoods.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        goodsHtml += `
            <div class="row align-items-center mb-2">
                <div class="col-md-2">
                    <img src="pimg/${item.img || 'default.jpg'}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                </div>
                <div class="col-md-4">
                    <p class="mb-0">${item.name}</p>
                    <p class="text-muted mb-0">${item.desc || ''}</p>
                </div>
                <div class="col-md-2">
                    <p class="mb-0">¥${item.price}</p>
                </div>
                <div class="col-md-2">
                    <p class="mb-0">x${item.quantity}</p>
                </div>
                <div class="col-md-2">
                    <p class="mb-0 text-danger">¥${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    });

    orderGoods.innerHTML = goodsHtml;
    orderTotal.textContent = `¥${total.toFixed(2)}`;
}

/**
 * 渲染收货地址卡片（每行2个，响应式）
 */
function renderAddressCards() {
    const addressListEl = document.getElementById('addressList');
    addressListEl.innerHTML = '';

    addressList.forEach(address => {
        const isActive = address.id === selectedAddressId;
        const cardHtml = `
            <div class="col-md-6">
                <div class="address-card ${isActive ? 'active' : ''}" onclick="selectAddress(${address.id})">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${address.receiver}</h6>
                            <p class="mb-1 text-muted">${address.phone}</p>
                            <p class="mb-0 text-muted">${address.address}</p>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="address" id="address${address.id}" ${isActive ? 'checked' : ''} onchange="selectAddress(${address.id})">
                        </div>
                    </div>
                </div>
            </div>
        `;
        addressListEl.innerHTML += cardHtml;
    });
}

/**
 * 选择收货地址
 */
function selectAddress(addressId) {
    selectedAddressId = addressId;
    renderAddressCards();
}

/**
 * 显示新增地址模态框
 */
function showAddAddress() {
    document.getElementById('addressForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('addAddressModal'));
    modal.show();
}

/**
 * 保存新增地址
 */
function saveAddress() {
    const receiver = document.getElementById('receiverName').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const address = document.getElementById('addressDetail').value.trim();

    if (!receiver || !phone || !address) {
        alert('请填写完整的地址信息！');
        return;
    }

    const newId = addressList.length > 0 ? Math.max(...addressList.map(item => item.id)) + 1 : 1;
    addressList.push({id: newId, receiver, phone, address});
    selectedAddressId = newId;
    renderAddressCards();
    bootstrap.Modal.getInstance(document.getElementById('addAddressModal')).hide();
}

/**
 * 提交订单（显示订单信息弹窗）
 */
function submitOrder() {
    // 1. 登录校验（复用购物车页的登录判断逻辑）
    const username = getLoginUsername();
    if (!username) {
        if (confirm('请先登录！是否前往登录页？')) {
            window.location.href = 'login.html';
        }
        return;
    }

    // 2. 二次校验勾选商品
    let cartData = [];
    try {
        cartData = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
        const checkedGoods = cartData.filter(item => item.checked === true);
        if (checkedGoods.length === 0) {
            alert('暂无选中的商品，无法提交订单！');
            window.location.href = 'cart.html';
            return;
        }
    } catch (e) {
        alert('购物车数据异常，无法提交订单！');
        return;
    }

    // 3. 校验是否选择地址
    if (!selectedAddressId) {
        alert('请选择收货地址！');
        return;
    }

    // 4. 获取选中的地址信息
    const selectedAddress = addressList.find(item => item.id === selectedAddressId);
    if (!selectedAddress) {
        alert('选中的地址不存在！');
        return;
    }

    // 5. 渲染成功弹窗内容
    const orderTotal = document.getElementById('orderTotal').textContent;
    const paymentType = document.querySelector('input[name="payment"]:checked').nextElementSibling.textContent;
    const successContent = document.getElementById('orderSuccessContent');
    successContent.innerHTML = `
        <p><strong>订单总金额：</strong>${orderTotal}</p>
        <p><strong>收货人：</strong>${selectedAddress.receiver}</p>
        <p><strong>联系电话：</strong>${selectedAddress.phone}</p>
        <p><strong>收货地址：</strong>${selectedAddress.address}</p>
        <p><strong>支付方式：</strong>${paymentType}</p>
        <p class="text-success mt-2">请尽快完成支付，感谢您的购买！</p>
    `;

    // 6. 显示成功弹窗
    const modal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
    modal.show();
}

// 页面加载初始化
document.addEventListener('DOMContentLoaded', function() {
    // 先检查登录状态（复用购物车页逻辑）
    checkLoginStatus();
    // 渲染订单商品
    renderOrderGoods();
    // 渲染地址卡片
    renderAddressCards();
});