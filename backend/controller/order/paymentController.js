const stripe = require('../../config/stripe')
const userModel = require('../../models/userModel')
const paymentController = async (request, response) => {
   try{
    const {cartItems} = request.body

    // console.log(cartItems[0].productId)
    const user = await userModel.findOne({_id: request.userId })
    const params = {
      submit_type: "pay",
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: user.email,
      metadata: {
        userId: request.userId,
      },
      line_items: cartItems.map((item, index) => {
        // console.log("Images:", item.productId.productImage)
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.productId.productName,
              
              images: item.productId.productImage,
              metadata: {
                productId: item.productId._id,
              },
            },
            unit_amount: item.productId.sellingPrice*100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params)

    response.json(session)
   } catch (error) {
    response.json({
        message : error?.message || error,
        error: true,
        success: false,
        cause: "payment gateway not working",
        reason: "if payment not check if there was any null images is not passed"
    })
   }
}

module.exports = paymentController;