// ===== reg.js 用户注册页核心业务脚本 =====
// ========== 初始化用户菜单（同步登录状态） ==========
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

// 退出登录函数 与全站统一
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('userInfo');
        window.location.href = 'index.html';
    }
}

// ========== 注册核心逻辑 ==========
document.addEventListener('DOMContentLoaded', function() {
    initUserMenu(); // 初始化用户菜单

    const registerForm = document.getElementById('registerForm');
    const regTip = document.getElementById('regTip');
    const username = document.getElementById('username');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPwd = document.getElementById('confirmPwd');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        regTip.style.display = "none"; // 清空之前的提示

        // 1. 获取并清洗输入值
        const uname = username.value.trim();
        const pphone = phone.value.trim();
        const eemail = email.value.trim();
        const pwd = password.value.trim();
        const cpwd = confirmPwd.value.trim();

        // 2. 非空校验
        if (!uname) {
            regTip.textContent = "用户名不能为空！";
            regTip.style.display = "block";
            return;
        }
        if (!pphone) {
            regTip.textContent = "手机号码不能为空！";
            regTip.style.display = "block";
            return;
        }
        if (!eemail) {
            regTip.textContent = "电子邮箱不能为空！";
            regTip.style.display = "block";
            return;
        }
        if (!pwd) {
            regTip.textContent = "密码不能为空！";
            regTip.style.display = "block";
            return;
        }

        // 3. 密码一致性校验
        if (pwd !== cpwd) {
            regTip.textContent = "两次输入的密码不一致！";
            regTip.style.display = "block";
            return;
        }

        // 4. 读取已有用户数据（无则初始化空数组）
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // 5. 校验用户名是否已存在
        const isExist = users.some(user => user.username === uname);
        if (isExist) {
            regTip.textContent = "该用户名已被注册，请更换！";
            regTip.style.display = "block";
            return;
        }

        // 6. 构造新用户数据
        const newUser = {
            username: uname,
            phone: pphone,
            email: eemail,
            password: pwd,
            nickname: uname // 昵称默认等于用户名
        };

        // 7. 存储新用户数据到localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // 8. 注册成功提示并跳转登录页
        alert(`注册成功！用户名：${uname}，请使用该账号登录`);
        window.location.href = 'login.html';
    });
});