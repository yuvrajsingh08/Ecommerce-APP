const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
    productDetails : {
        type : Array,
        default : []
    },
    email : {
        type : String,
        default : ""
    },
    userId : {
        type : String,
        default : ""
    },
    paymentDetails : {
        paymentId : {
            type : String,
            default : ""
        },
        payment_method_type : [],
        payment_status : {
            type : String,
            default : ""
        }
    },
     shipping_options: {
        type: Array,
        default: []
    },
    totalAmount : {
        type : Number,
        default : 0
    },
    orderStatus : {
        type : String,
        enum : ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default : 'pending'
    },
    deliveryStatus : {
        type : String,
        enum : ['not_shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed'],
        default : 'not_shipped'
    }
},{
    timestamps : true
})

const orderModel = mongoose.model('order',orderSchema)

module.exports = orderModel