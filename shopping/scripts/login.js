// ===== login.js 登录页面核心业务脚本 =====
// ========== 通用函数：初始化用户菜单 ==========
function initUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
    
    if (userInfo && userInfo.username) {
        // 已登录状态：显示用户名+退出按钮
        userMenu.innerHTML = `
            <span class="me-2">欢迎，${userInfo.username}</span>
            <a href="javascript:logout()" class="me-2">退出登录</a>
            <a href="cart.html" class="ms-3">购物车</a>
        `;
    }
}

// ========== 通用函数：退出登录 ==========
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('userInfo'); // 清除登录状态
        window.location.href = 'index.html'; // 跳回首页
    }
}

// ========== 登录核心逻辑 ==========
document.addEventListener('DOMContentLoaded', function() {
    initUserMenu(); // 页面加载时初始化用户菜单

    // 获取DOM元素
    const loginForm = document.getElementById('loginForm');
    const loginTip = document.getElementById('loginTip');
    const loginName = document.getElementById('loginName');
    const loginPwd = document.getElementById('loginPwd');

    // 表单提交事件
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止默认提交
        loginTip.style.display = "none"; // 清空之前的提示

        // 1. 非空校验
        const username = loginName.value.trim();
        const password = loginPwd.value.trim();
        
        if (!username) {
            loginTip.textContent = "用户名不能为空";
            loginTip.style.display = "block";
            return;
        }
        if (!password) {
            loginTip.textContent = "密码不能为空";
            loginTip.style.display = "block";
            return;
        }

        // 2. 整合预设用户+注册用户数据
        // 读取注册页新增的用户数据
        const registeredUsers = JSON.parse(localStorage.getItem('users')) || [];
        // 合并所有用户数据
        const allUsers = [...presetUsers, ...registeredUsers];

        try {
            // 3. 校验用户名和密码
            const matchedUser = allUsers.find(user => 
                user.username === username && user.password === password
            );

            if (matchedUser) {
                // 4. 登录成功：存储用户信息到本地
                const userInfo = {
                    username: matchedUser.username,
                    nickname: matchedUser.nickname || matchedUser.username, // 兼容注册用户的昵称
                    isLogin: true
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                // 提示并跳转首页
                alert(`登录成功！欢迎你，${userInfo.nickname}！`);
                window.location.href = 'index.html';
            } else {
                // 5. 登录失败：提示错误
                loginTip.textContent = "用户名或者密码不正确";
                loginTip.style.display = "block";
            }
        } catch (error) {
            console.error("登录请求失败：", error);
            loginTip.textContent = "系统错误，请稍后再试";
            loginTip.style.display = "block";
        }
    });
});