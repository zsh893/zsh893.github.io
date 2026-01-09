// ===== productDetailData.js 商品详情页 初始库存+完整商品数据 (纯数据解耦) =====
// 全局商品数据（用于持久化库存）
let globalProductData = [];
// 初始库存数据（用于重置）
const INIT_PRODUCT_DATA = [
    {id:1001,name:"小米14 旗舰智能手机",price:2999,stock:500,categoryName:"数码产品",imgName:"product1.png",intro:"高清大屏，超长续航",features:"骁龙8 Gen3 | 徕卡光学镜头",origin:"中国大陆",color:"黑色/白色/青色",spec:"12GB+256GB",size:"6.36英寸",shelfDate:"2023-10-26"},
    {id:1002,name:"华为MatePad 11.5英寸平板",price:2499,stock:350,categoryName:"数码产品",imgName:"product2.png",intro:"柔光版，学习办公首选",features:"麒麟芯片 | 144Hz高刷屏",origin:"中国大陆",color:"深空灰/雪域白",spec:"8GB+256GB",size:"11.5英寸",shelfDate:"2024-02-28"},
    {id:2001,name:"耐克Air Max 休闲运动鞋",price:799,stock:280,categoryName:"服装鞋帽",imgName:"product5.png",intro:"透气舒适，防滑耐磨",features:"气垫缓震 | 网面透气",origin:"越南",color:"黑色/白色/红色",spec:"男女款",size:"36-45码",shelfDate:"2024-01-10"},
    {id:3001,name:"美的智能电饭煲",price:399,stock:250,categoryName:"家居用品",imgName:"product9.png",intro:"多功能，大容量",features:"IH加热 | 预约功能",origin:"中国广东",color:"白色",spec:"5L",size:"380×280×260mm",shelfDate:"2023-12-05"},
    {id:4001,name:"欧莱雅保湿面霜",price:129,stock:550,categoryName:"美妆护肤",imgName:"product11.png",intro:"补水保湿，提亮肤色",features:"玻尿酸 | 维生素C",origin:"法国",color:"乳白色",spec:"50ml",size:"50ml",shelfDate:"2023-08-15"},
    {id:4002,name:"雅诗兰黛小棕瓶精华",price:899,stock:150,categoryName:"美妆护肤",imgName:"product12.png",intro:"修护抗老，夜间修复",features:"二裂酵母 | 抗氧化",origin:"美国",color:"棕色",spec:"100ml",size:"100ml",shelfDate:"2023-10-01"}
];