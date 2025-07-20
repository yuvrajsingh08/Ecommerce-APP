const orderModel = require('../../models/orderProductModel')
const userModel = require("../../models/userModel")

const allOrderController = async (req, res)=> {
    const currentUserId = req.userId;
    console.log(currentUserId)
    const currentUser = await userModel.findById(currentUserId);

    if(currentUser.role !== 'ADMIN') {
         return response.status(500).json({
            message : "access denied"
        })
    }

    const allOrder = await orderModel.find().sort({ createdAt : -1 });
    return res.status(200).json({
        data : allOrder,
        success : true
    })
}

module.exports = allOrderController