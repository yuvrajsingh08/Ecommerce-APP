import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";
import { 
  FaShoppingBag, 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaCreditCard,
  FaShippingFast,
  FaCalendarAlt,
  FaHashtag,
  FaSpinner
} from "react-icons/fa";
import { 
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle
} from "react-icons/hi";

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.getOrder.url, {
      method: SummaryApi.getOrder.method,
      credentials: "include",
    });
    const responseData = await response.json();
    setData(responseData.data || []);
    setLoading(false);
  };

  const getStatusBadgeColor = (status) => {
    const statusColors = {
      pending: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200',
      confirmed: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200',
      processing: 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200',
      shipped: 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-indigo-200',
      delivered: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200',
      cancelled: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200',
      not_shipped: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200',
      in_transit: 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200',
      out_for_delivery: 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-cyan-200',
      failed: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200'
    }
    return statusColors[status] || 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <HiOutlineClock className="w-4 h-4" />,
      confirmed: <HiOutlineCheckCircle className="w-4 h-4" />,
      processing: <HiOutlineCube className="w-4 h-4" />,
      shipped: <HiOutlineTruck className="w-4 h-4" />,
      delivered: <FaCheckCircle className="w-4 h-4" />,
      cancelled: <HiOutlineXCircle className="w-4 h-4" />,
      not_shipped: <HiOutlineCube className="w-4 h-4" />,
      in_transit: <FaTruck className="w-4 h-4" />,
      out_for_delivery: <FaShippingFast className="w-4 h-4" />,
      failed: <HiOutlineXCircle className="w-4 h-4" />
    }
    return icons[status] || <HiOutlineClock className="w-4 h-4" />
  }

  const formatStatus = (status) => {
    return status ? status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'N/A'
  }

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <section id="orders" className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-[#f64a72] to-[#e6395a] rounded-xl shadow-lg">
              <FaShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">Track and manage all your purchases</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && !data.length && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#f64a72] border-t-transparent rounded-full animate-spin"></div>
              <FaSpinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#f64a72] animate-spin" />
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">Loading your orders...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !data?.length && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <HiOutlineShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#f64a72] to-[#e6395a] rounded-full opacity-20"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 text-center max-w-md mb-6">
              You haven't placed any orders yet. Start shopping to see your order history here!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-[#f64a72] to-[#e6395a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">

          {data.map((item, index) => (
            <div
              key={item._id || item.userId + index}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Order Header with Gradient */}
              <div className="bg-gradient-to-r from-[#f64a72] via-[#e6395a] to-[#f64a72] p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <FaCalendarAlt className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg flex items-center gap-2">
                        <span>Ordered on</span>
                        <span className="font-bold">{moment(item.createdAt).format("MMMM DD, YYYY")}</span>
                      </p>
                      {item._id && (
                        <p className="text-sm text-white/90 mt-1 flex items-center gap-2">
                          <FaHashtag className="w-3 h-3" />
                          <span className="font-mono">Order #{item._id.slice(-8).toUpperCase()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                      <span className="text-xs font-medium text-white/80 block mb-1">Order Status</span>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusBadgeColor(item.orderStatus || 'pending')}`}>
                        {getStatusIcon(item.orderStatus || 'pending')}
                        {formatStatus(item.orderStatus || 'pending')}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                      <span className="text-xs font-medium text-white/80 block mb-1">Delivery</span>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusBadgeColor(item.deliveryStatus || 'not_shipped')}`}>
                        {getStatusIcon(item.deliveryStatus || 'not_shipped')}
                        {formatStatus(item.deliveryStatus || 'not_shipped')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6 space-y-6">

                {/* Product List */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FaBox className="w-5 h-5 text-[#f64a72]" />
                    <h3 className="text-lg font-bold text-gray-900">Ordered Items</h3>
                    <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {item?.productDetails?.length || 0} {item?.productDetails?.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {item?.productDetails?.map((product, idx) => (
                      <div
                        key={product.productId + idx}
                        className="flex gap-4 bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#f64a72]/30 hover:shadow-md transition-all duration-200 group/item"
                      >
                        <div className="relative">
                          <img
                            src={product.image?.[0] || '/placeholder.png'}
                            className="w-24 h-24 md:w-28 md:h-28 object-contain rounded-xl bg-white border-2 border-gray-100 p-2 group-hover/item:border-[#f64a72] transition-colors"
                            alt="product"
                          />
                          <div className="absolute -top-2 -right-2 bg-[#f64a72] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                            {product.quantity}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div className="font-semibold text-base md:text-lg text-gray-900 line-clamp-2 group-hover/item:text-[#f64a72] transition-colors">
                            {product.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Price:</span>
                              <span className="text-lg md:text-xl text-[#f64a72] font-bold">
                                {displayINRCurrency(product.price)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Subtotal:</span>
                              <span className="text-base md:text-lg text-gray-900 font-semibold">
                                {displayINRCurrency(product.price * product.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Shipping Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Payment Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <FaCreditCard className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">Payment Information</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {item.paymentDetails?.payment_method_type?.[0]?.replace('_', ' ') || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                        <span className="text-sm text-gray-600">Payment Status</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          item.paymentDetails?.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {item.paymentDetails?.payment_status?.toUpperCase() || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <FaShippingFast className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">Shipping Details</h4>
                    </div>
                    <div className="space-y-2">
                      {item.shipping_options?.length > 0 ? (
                        item.shipping_options.map((shipping, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Shipping Cost</span>
                            <span className="text-sm font-bold text-gray-900">
                              {displayINRCurrency(shipping.shipping_amount || 0)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">Shipping details will be updated soon</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total Amount Footer */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <FaShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg font-semibold text-white">Total Amount</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl md:text-3xl font-bold text-white">
                        {displayINRCurrency(item.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderPage;
