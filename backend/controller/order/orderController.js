const orderModel = require('../../models/orderProductModel')

const orderController = async (req, res)=> {
    try{
        const currentUserId = req.userId;
        const orderList = await orderModel.find({userId: currentUserId}).sort({createdAt : -1 });
        console.log("order list ->", orderList)
        res.status(200).json({
            data : orderList,
            message : "Order list",
            success : true
        })

    } catch (error) {
        res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = orderController;