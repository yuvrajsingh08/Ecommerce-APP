import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { IoMdClose } from "react-icons/io";
import { AppContext } from "../context";
import { toast } from "react-toastify";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingCart = new Array(4).fill(null);
  const {fetchUserAddToCart } = useContext(AppContext);
  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    const responseData = await response.json();

    if (responseData.success) {
      setData(responseData.data);
    }
  };

  const handleLoading = async () => {
    await fetchData();
  };
  
  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
      fetchUserAddToCart();
      toast.success(responseData.message);
    }
  };

  const increaseQty = async (id, qty) => {
    
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
    }
  };


  const decraseQty = async(id,qty) =>{
       if(qty >= 2){
            const response = await fetch(SummaryApi.updateCartProduct.url,{
                method : SummaryApi.updateCartProduct.method,
                credentials : 'include',
                headers : {
                    "content-type" : 'application/json'
                },
                body : JSON.stringify(
                    {   
                        _id : id,
                        quantity : qty - 1
                    }
                )
            })

            const responseData = await response.json()


            if(responseData.success){
                fetchData()
            }
        }
  }

   const totalQty = data.reduce(
     (previousValue, currentValue) => previousValue + currentValue.quantity,
     0
   );
   const totalPrice = data.reduce(
     (preve, curr) => preve + curr.quantity * curr?.productId?.price,
     0
   );
   const totalDiscount = data.reduce(
     (preve, curr) => preve + curr.quantity * (curr?.productId?.price - curr?.productId?.sellingPrice),
     0
   );
   const finalPrice = data.reduce(
     (preve, curr) => preve + curr.quantity * curr?.productId?.sellingPrice,
     0
   );
   useEffect(() => {
     setLoading(true);
     handleLoading();
     setLoading(false);
   }, []);
   console.log(data);

  return (
    <div className="container mx-auto md:px-40">
      {data.length === 0 && !loading ? (
        <div className="text-center text-lg my-3 flex justify-center items-center h-[calc(100vh-6rem)]">
          <p className=" text-[#808080ac] text-4xl font-semibold tracking-wider  py-5">
            Your Cart is Empty
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
          {/***view product */}
          <div className="w-full max-w-3xl">
            {loading
              ? loadingCart?.map((el, index) => {
                  return (
                    <div
                      key={el + "Add To Cart Loading" + index}
                      className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                    ></div>
                  );
                })
              : data.map((product, index) => {
                  return (
                    <div
                      key={product?._id + "Add To Cart Loading"}
                      className="md:w-full w-96 bg-slate-50 md:h-36 h-40 my-4 border border-slate-300  rounded grid grid-cols-[128px,1fr] mx-auto"
                    >
                      <div className="md:w-32 w-36 md:h-36 h-40 bg-slate-200">
                        <img
                          src={product?.productId?.productImage[0]}
                          className="w-full h-full object-scale-down mix-blend-multiply"
                        />
                      </div>
                      <div className="md:px-4 px-6 py-2 relative">
                        {/**delete product */}
                        <div
                          className="absolute right-0 text-black scale-110 rounded-full p-2 cursor-pointer"
                          onClick={() => deleteCartProduct(product?._id)}
                        >
                          <IoMdClose />
                        </div>

                        <h2 className="text-lg lg:text-base font-semibold text-ellipsis line-clamp-1">
                          {product?.productId?.productName}
                        </h2>
                        <p className="capitalize text-slate-500">
                          {product?.productId.category}
                        </p>
                        <div className="flex md:items-center md:justify-between mt-2 md:flex-row flex-col">
                          <div className="flex gap-2">
                            <p className="text-[#FF527B] font-medium text-base">
                              {displayINRCurrency(
                                product?.productId?.sellingPrice
                              )}
                            </p>

                            <p className="text-gray-600 font-medium text-base relative opacity-70">
                              <div className="w-full absolute top-[50%] h-[1px] bg-gray-600  z-10"></div>
                              {displayINRCurrency(product?.productId?.price)}
                            </p>
                          </div>
                          <p className="text-slate-600 font-semibold text-base">
                            {displayINRCurrency(
                              product?.productId?.sellingPrice *
                                product?.quantity
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            className="border border-[#FF527B] text-[#FF527B] hover:bg-[#fa4b74] hover:text-white w-6 h-6 pb-1 flex justify-center items-center rounded "
                            onClick={() =>
                              decraseQty(product?._id, product?.quantity)
                            }
                          >
                            -
                          </button>
                          <span className="transition-all">
                            {product?.quantity}
                          </span>
                          <button
                            className="border border-[#FF527B] text-[#FF527B] hover:bg-[#fa4b74] hover:text-white w-6 h-6 pb-1 flex justify-center items-center rounded "
                            onClick={() =>
                              increaseQty(product?._id, product?.quantity)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>

          {/***summary  */}
          <div className="mt-5 lg:mt-0 w-full max-w-sm  mx-auto ">
            {loading ? (
              <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse"></div>
            ) : (
              <div className="h-72 my-4 bg-white p-2 border border-slate-300">
                <h2 className="text-[#FF527B] px-4 py-4 font-semibold">
                  PRICE DETAILS
                </h2>
                <div className="flex items-center justify-between px-4 gap-2 my-1  text-base font-normal text-slate-600">
                  <p>Quantity</p>
                  <p>{totalQty}</p>
                </div>

                <div className="flex items-center justify-between px-4 gap-2 my-1 text-base font-normal text-slate-600">
                  <p>Total MRP Price</p>
                  <p>{displayINRCurrency(totalPrice)}</p>
                </div>

                <div className="flex items-center justify-between px-4 gap-2  my-1 text-base font-normal text-slate-600">
                  <p>Total Discount</p>
                  <p className="text-green-400">
                    -{displayINRCurrency(totalDiscount)}
                  </p>
                </div>
                <div className="w-full h-[1px] bg-slate-600 opacity-25 my-4"></div>
                <div className="flex items-center justify-between px-4 gap-2 my-2 text-base font-semibold text-black">
                  <p>Total Amount</p>
                  <p className="text-black">{displayINRCurrency(finalPrice)}</p>
                </div>

                <button className="bg-[#FF527B] p-2 mt-4 text-white w-full mx-auto tracking-wider font-bold">
                  PLACE ORDER
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
