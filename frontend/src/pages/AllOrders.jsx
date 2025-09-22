import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import moment from 'moment'
import displayINRCurrency from '../helpers/displayCurrency'

const AllOrder = () => {
    const [data,setData] = useState([])

    const fetchOrderDetails = async()=>{
      const response = await fetch(SummaryApi.allOrder.url,{
        method : SummaryApi.allOrder.method,
        credentials : 'include'
      })

      const responseData = await response.json()

      setData(responseData.data)
      console.log("order list",responseData)
    }

    useEffect(()=>{
      fetchOrderDetails()
    },[])

    if (!data.length) {
    return (
      <div className="h-[calc(100vh-190px)] flex items-center justify-center text-gray-500 font-medium">
        No Orders available
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-scroll p-4 space-y-6 scrollbar-none">
      {data.map((item, index) => (
        <div key={item.userId + index} className="space-y-2">
          <p className="font-semibold text-lg text-[#f64a72]">
            {moment(item.createdAt).format("LL")}
          </p>

          <div className="border rounded-lg shadow-sm p-4 bg-white space-y-4">
            {/* Products */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 space-y-3">
                {item?.productDetails.map((product, idx) => (
                  <div
                    key={product.productId + idx}
                    className="flex gap-4 p-2 bg-gray-100 rounded-lg items-center"
                  >
                    <img
                      src={product.image[0]}
                      alt="product_image"
                      className="w-28 h-28 bg-white object-scale-down p-2 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-lg line-clamp-1">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-6 mt-2 text-sm lg:text-base">
                        <span className="text-[#f64a72] font-semibold">
                          {displayINRCurrency(product.price)}
                        </span>
                        <span>Quantity: {product.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment & Shipping */}
              <div className="flex flex-col gap-4 min-w-[280px] bg-gray-50 p-3 rounded-lg">
                <div>
                  <div className="text-lg font-medium text-[#f64a72]">
                    Payment Details
                  </div>
                  <p className="ml-1">Method: {item.paymentDetails.payment_method_type[0]}</p>
                  <p className="ml-1">Status: {item.paymentDetails.payment_status}</p>
                </div>

                <div>
                  <div className="text-lg font-medium text-black">
                    Shipping Details
                  </div>
                  {item.shipping_options.map((shipping, idx) => (
                    <p key={idx} className="ml-1">
                      Shipping Amount: {displayINRCurrency(shipping.shipping_amount)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="text-right font-semibold text-lg text-black">
              Total Amount: {displayINRCurrency(item.totalAmount)}
            </div>
          </div>
        </div>
      ))}
    </div>
    )
}

export default AllOrder