// ===== cart.js 购物车页面核心业务脚本 =====
// 统一获取登录用户名的函数（兼容两种存储格式）
function getLoginUsername() {
    // 优先读取新格式（userInfo对象），兼容旧格式（loginUser字符串）
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const oldUsername = localStorage.getItem('loginUser');
    return userInfo.username || oldUsername;
}

// 检查并更新登录状态显示
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

// 退出登录函数
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

// 恢复商品库存（删除购物车商品时调用）
function restoreProductStock(productId, addNum) {
    // 读取当前商品数据
    const savedProductData = localStorage.getItem('productData');
    let productData = savedProductData ? JSON.parse(savedProductData) : [...INIT_PRODUCT_DATA];
    
    // 找到对应商品恢复库存
    const productIndex = productData.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        // 恢复库存（不超过初始库存）
        const initStock = INIT_PRODUCT_DATA.find(item => item.id === productId).stock;
        productData[productIndex].stock = Math.min(initStock, productData[productIndex].stock + addNum);
        // 保存更新后的库存
        localStorage.setItem('productData', JSON.stringify(productData));
    }
}

// 从localStorage获取购物车数据
function getCartData() {
    const cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : [];
}
// 保存购物车数据到localStorage
function saveCartData(cartData) {
    localStorage.setItem('cart', JSON.stringify(cartData));
    // 更新购物车角标
    checkLoginStatus();
}

// 保存勾选状态到cart数据
function saveCheckStatus() {
    const cartData = getCartData();
    // 遍历所有商品项，同步勾选状态
    document.querySelectorAll('.cart-item').forEach((itemDom, index) => {
        const isChecked = itemDom.querySelector('.item-check').checked;
        cartData[index].checked = isChecked; // 把勾选状态存入cart数据
    });
    saveCartData(cartData); // 保存更新后的cart数据
}

// 渲染购物车
function renderCart() {
    const cartData = getCartData();
    const cartList = document.getElementById('cartList');
    const checkoutArea = document.getElementById('checkoutArea');
    const selectAllRow = document.getElementById('selectAllRow');
    
    if (cartData.length === 0) {
        cartList.innerHTML = `
                    <div class="row mb-2" id="selectAllRow" style="display: none;">
                        <div class="col-md-1">
                            <input type="checkbox" id="selectAll" checked>
                            <label for="selectAll" class="ms-1">全选</label>
                        </div>
                    </div>
                    <div class="empty-cart">
                        <h5>购物车空空如也~</h5>
                        <p>快去挑选心仪的商品吧！</p>
                        <a href="index.html" class="btn btn-primary">去首页逛逛</a>
                    </div>
                `;
        checkoutArea.style.display = 'none';
        return;
    }

    // 显示全选行和结算区域
    selectAllRow.style.display = 'flex';
    checkoutArea.style.display = 'flex';
    
    // 先判断是否全选
    const allChecked = cartData.every(item => item.checked !== false);
    
    let cartHtml = '';
    cartData.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        // 读取item的checked状态，默认选中
        const isItemChecked = item.checked !== false;
        cartHtml += `
                    <div class="cart-item row align-items-center" data-index="${index}" data-id="${item.id}" data-price="${item.price}">
                        <div class="col-md-1">
                            <input type="checkbox" class="item-check" ${isItemChecked ? 'checked' : ''}>
                        </div>
                        <div class="col-md-2">
                            <img src="pimg/${item.img}" alt="${item.name}">
                        </div>
                        <div class="col-md-3">
                            <h6>${item.name}</h6>
                            <p class="text-muted mb-0">${item.desc}</p>
                        </div>
                        <div class="col-md-2">
                            <span class="product-price single-price">¥${item.price}</span>
                        </div>
                        <div class="col-md-2">
                            <input type="number" class="form-control w-50 item-quantity" value="${item.quantity}" min="1">
                        </div>
                        <div class="col-md-2">
                            <span class="text-danger item-total">¥${itemTotal}</span>
                            <button class="btn btn-link text-danger p-0 ms-2 delete-btn">删除</button>
                        </div>
                    </div>
                `;
    });
    // 插入全选行+商品列表（同步全选状态）
    cartList.innerHTML = `
                <div class="row mb-2" id="selectAllRow">
                    <div class="col-md-1">
                        <input type="checkbox" id="selectAll" ${allChecked ? 'checked' : ''}>
                        <label for="selectAll" class="ms-1">全选</label>
                    </div>
                </div>
                ${cartHtml}
            `;
    bindCartEvents();
    calculateTotal();
}

// 绑定购物车事件
function bindCartEvents() {
    // 全选/取消全选
    const selectAll = document.getElementById('selectAll');
    selectAll.addEventListener('change', function() {
        document.querySelectorAll('.item-check').forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        // 保存勾选状态到cart数据
        saveCheckStatus();
        calculateTotal();
    });

    // 单个商品选择
    document.querySelectorAll('.item-check').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 同步全选状态
            const allChecked = [...document.querySelectorAll('.item-check')].every(cb => cb.checked);
            document.getElementById('selectAll').checked = allChecked;
            // 保存勾选状态到cart数据
            saveCheckStatus();
            calculateTotal();
        });
    });

    // 删除商品（添加淡出动画+恢复库存）
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemDom = this.closest('.cart-item');
            const index = parseInt(itemDom.dataset.index);
            const productId = parseInt(itemDom.dataset.id);
            const deleteQuantity = parseInt(itemDom.querySelector('.item-quantity').value);
            
            // 添加淡出动画
            itemDom.classList.add('fade-out');
            setTimeout(() => {
                // 恢复库存
                restoreProductStock(productId, deleteQuantity);
                // 删除购物车商品
                const cartData = getCartData();
                cartData.splice(index, 1);
                saveCartData(cartData);
                renderCart();
                // 提示
                alert('商品已删除，库存已恢复！');
            }, 300); // 动画时长对应CSS的transition时间
        });
    });

    // 修改数量（联动小计、总计）
    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.closest('.cart-item').dataset.index);
            const productId = parseInt(this.closest('.cart-item').dataset.id);
            let newQuantity = parseInt(this.value) || 1;
            if (newQuantity < 1) newQuantity = 1;
            
            // 获取旧数量，计算数量变化
            const cartData = getCartData();
            const oldQuantity = cartData[index].quantity;
            const quantityDiff = newQuantity - oldQuantity;

            // 如果数量减少，恢复对应库存
            if (quantityDiff < 0) {
                restoreProductStock(productId, Math.abs(quantityDiff));
            }
            
            this.value = newQuantity;
            // 更新购物车数据
            cartData[index].quantity = newQuantity;
            saveCartData(cartData);

            // 更新当前商品小计
            const price = parseFloat(this.closest('.cart-item').dataset.price);
            this.closest('.cart-item').querySelector('.item-total').textContent = `¥${(price * newQuantity).toFixed(2)}`;
            
            // 重新计算总计
            calculateTotal();
        });
    });

    // 清空购物车（清空时恢复所有商品库存）
    document.getElementById('clear-cart').addEventListener('click', function() {
        if (confirm('确定清空购物车吗？')) {
            const cartData = getCartData();
            // 恢复所有商品库存
            cartData.forEach(item => {
                restoreProductStock(item.id, item.quantity);
            });
            // 清空购物车
            localStorage.removeItem('cart');
            saveCartData([]);
            renderCart();
            alert('购物车已清空，所有商品库存已恢复！');
        }
    });
}

// 计算合计金额+已选数量
function calculateTotal() {
    let total = 0;
    let selectedCount = 0;
    
    document.querySelectorAll('.cart-item .item-check:checked').forEach(checkbox => {
        const itemTotal = parseFloat(checkbox.closest('.cart-item').querySelector('.item-total').textContent.replace('¥', ''));
        const itemQuantity = parseInt(checkbox.closest('.cart-item').querySelector('.item-quantity').value);
        
        total += itemTotal;
        selectedCount += itemQuantity;
    });

    // 更新页面显示
    document.querySelector('.total-amount').textContent = `¥${total.toFixed(2)}`;
    document.getElementById('selectedCount').textContent = selectedCount;
}

// 提交订单（进入订单页面）
function toOrder() {
    // 登录校验
    const username = getLoginUsername();
    if (!username) {
        if (confirm('请先登录！是否前往登录页？')) {
            window.location.href = 'login.html';
        }
        return;
    }

    // 先保存当前勾选状态到cart数据
    saveCheckStatus();
    
    const checkedCount = document.querySelectorAll('.cart-item .item-check:checked').length;
    if (checkedCount === 0) {
        alert('请选择要结算的商品！');
        return;
    }
    window.location.href = 'order.html';
}

// 页面加载初始化
document.addEventListener('DOMContentLoaded', function() {
    // 先检查登录状态
    checkLoginStatus();
    // 再渲染购物车
    renderCart();
});