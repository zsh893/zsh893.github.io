// ===== cartData.js 购物车固定数据配置 =====
// 初始库存数据（和商品详情页保持一致）
const INIT_PRODUCT_DATA = [
    {id:1001,name:"小米14 旗舰智能手机",price:2999,stock:500},
    {id:1002,name:"华为MatePad 11.5英寸平板",price:2499,stock:350},
    {id:2001,name:"耐克Air Max 休闲运动鞋",price:799,stock:280},
    {id:3001,name:"美的智能电饭煲",price:399,stock:250},
    {id:4001,name:"欧莱雅保湿面霜",price:129,stock:550},
    {id:4002,name:"雅诗兰黛小棕瓶精华",price:899,stock:150}
];

// 【测试用】初始化购物车数据（可删除，用于测试）
function initTestCart() {
    const testData = [
        {
            id:1001,
            name: "小米14 旗舰智能手机",
            img: "product1.png",
            desc: "高清大屏，超长续航",
            price: 2999,
            quantity: 2,
            checked: true
        },
        {
            id:1002,
            name: "华为MatePad 11.5英寸平板",
            img: "product2.png",
            desc: "柔光版，学习办公首选",
            price: 2499,
            quantity: 1,
            checked: true
        }
    ];
    localStorage.setItem('cart', JSON.stringify(testData));
}
// 首次加载可执行（仅测试用，注释掉即可关闭）
// if (!localStorage.getItem('cart')) initTestCart();