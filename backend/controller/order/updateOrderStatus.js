const orderModel = require('../../models/orderProductModel')
const userModel = require("../../models/userModel")

const updateOrderStatus = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await userModel.findById(currentUserId);

        // Check if user is admin
        if(currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin only.",
                error: true,
                success: false
            })
        }

        const { orderId, orderStatus, deliveryStatus } = req.body;

        // Validate orderId
        if(!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                error: true,
                success: false
            })
        }

        // Validate at least one status is provided
        if(!orderStatus && !deliveryStatus) {
            return res.status(400).json({
                message: "At least one status (orderStatus or deliveryStatus) is required",
                error: true,
                success: false
            })
        }

        // Find the order
        const order = await orderModel.findById(orderId);
        if(!order) {
            return res.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            })
        }

        // Update statuses
        const updateData = {};
        if(orderStatus) {
            updateData.orderStatus = orderStatus;
        }
        if(deliveryStatus) {
            updateData.deliveryStatus = deliveryStatus;
        }

        // Update the order
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { $set: updateData },
            { new: true }
        );

        return res.status(200).json({
            data: updatedOrder,
            message: "Order status updated successfully",
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        })
    }
}

module.exports = updateOrderStatus;

