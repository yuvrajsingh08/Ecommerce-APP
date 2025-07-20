const stripe = require('../../config/stripe');
const addToCartModel = require('../../models/cartProduct');
const orderModel = require('../../models/orderProductModel');
const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

async function getLineItems(lineItems) {
    let ProductItems = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await stripe.products.retrieve(item.price.product)
            const productId = product.metadata.productId

            const productData = {
                productId : productId,
                name : product.name,
                price : item.price.unit_amount / 100,
                quantity : item.quantity,
                image : product.images
            }
            ProductItems.push(productData)
        }
    }

    return ProductItems
}

const webhooks = async (req, res) => {
    const payloadString = JSON.stringify(req.body)
    const sig = req.headers['stripe-signature'];
    const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: endpointSecret,
    });
    let event;

    try {
        event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
    } catch (err) {
        console.error('❌ Webhook Error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch(event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            const productDetails = await getLineItems(lineItems)
             const orderDetails = {
                productDetails : productDetails,
                email : session.customer_email,
                userId : session.metadata.userId,
                paymentDetails : {
                    paymentId : session.payment_intent,
                    payment_method_type : session.payment_method_types,
                    payment_status : session.payment_status,
                },
                totalAmount : session.amount_total / 100
            }
            const order = new orderModel(orderDetails)
            const saveOrder = await order.save()
            console.log("saveOrder", saveOrder) 
            if(saveOrder?._id){
                const deleteCartItem = await addToCartModel.deleteMany({ userId : session.metadata.userId })
            }
            break;
        default: 
            console.log(`Unhandled even type ${event.type}`);
    }


      res.status(200).send();
};

module.exports = webhooks;
