// ===== orderData.js 订单确认页 收货地址模拟数据 (纯数据解耦) =====
// 模拟收货地址数据
let addressList = [
    {id:1, receiver:"张三", phone:"13800138000", address:"北京市朝阳区建国路88号"},
    {id:2, receiver:"李四", phone:"13900139000", address:"上海市浦东新区张江高科技园区"},
    {id:3, receiver:"王五", phone:"13700137000", address:"广东省深圳市南山区科技园"}
];
// 默认选中第一个地址
let selectedAddressId = 1;