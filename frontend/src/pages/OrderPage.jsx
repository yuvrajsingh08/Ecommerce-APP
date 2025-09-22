import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";

const OrderPage = () => {
  const [data, setData] = useState([]);

  const fetchOrderDetails = async () => {
    const response = await fetch(SummaryApi.getOrder.url, {
      method: SummaryApi.getOrder.method,
      credentials: "include",
    });
    const responseData = await response.json();
    setData(responseData.data);
    console.log("order list", responseData);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <section id="orders">
      <div className="flex h-[calc(100vh-4rem)] w-full">
        {/* Left panel (fixed height, no scroll) */}
        <div className="hidden lg:flex items-center justify-center bg-[#f64a72] w-1/3 px-10">
          <div className="max-w-md text-center space-y-6 text-white">
            <h1 className="text-4xl font-extrabold tracking-tight">My Orders</h1>
            <p className="text-lg">
              Track your past and current purchases with complete details.
            </p>
          </div>
        </div>

        {/* Right content (scrollable) */}
        <div className="flex flex-1 justify-center bg-background px-4 sm:px-6 lg:px-12 overflow-y-auto scrollbar-none">
          <div className="mx-auto w-full max-w-4xl space-y-10 py-12">
            {!data?.length && (
              <p className="text-center text-lg text-muted-foreground">
                No Orders Available
              </p>
            )}

            {data.map((item, index) => (
              <div
                key={item.userId + index}
                className="border rounded-xl shadow-sm bg-white p-6 space-y-4"
              >
                {/* Order Date */}
                <p className="font-semibold text-lg text-gray-700">
                  Ordered on {moment(item.createdAt).format("LL")}
                </p>

                {/* Order Content */}
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Product List */}
                  <div className="grid gap-4 flex-1">
                    {item?.productDetails.map((product, idx) => (
                      <div
                        key={product.productId + idx}
                        className="flex gap-4 bg-gray-50 p-3 rounded-lg"
                      >
                        <img
                          src={product.image[0]}
                          className="w-24 h-24 object-contain rounded-md bg-white border"
                          alt="product"
                        />
                        <div className="flex flex-col justify-between">
                          <div className="font-medium text-base line-clamp-1">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-5 mt-1">
                            <div className="text-lg text-red-500 font-semibold">
                              {displayINRCurrency(product.price)}
                            </div>
                            <p className="text-gray-600">
                              Quantity: {product.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment & Shipping */}
                  <div className="flex flex-col gap-6 min-w-[260px]">
                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        Payment Details
                      </div>
                      <p className="ml-1 text-gray-600">
                        Method: {item.paymentDetails.payment_method_type[0]}
                      </p>
                      <p className="ml-1 text-gray-600">
                        Status: {item.paymentDetails.payment_status}
                      </p>
                    </div>

                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        Shipping Details
                      </div>
                      {item.shipping_options.map((shipping, idx) => (
                        <p
                          key={shipping.shipping_rate + idx}
                          className="ml-1 text-gray-600"
                        >
                          Shipping Amount:{" "}
                          {displayINRCurrency(shipping.shipping_amount)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="text-right font-bold text-lg text-gray-800">
                  Total Amount: {displayINRCurrency(item.totalAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderPage;
