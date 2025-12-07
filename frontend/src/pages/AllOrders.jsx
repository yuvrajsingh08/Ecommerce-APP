import React, { useEffect, useState, useRef } from 'react'
import SummaryApi from '../common'
import moment from 'moment'
import displayINRCurrency from '../helpers/displayCurrency'
import { toast } from 'react-toastify'
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
  FaSpinner,
  FaChevronDown,
  FaTh,
  FaThLarge,
  FaList,
  FaUser,
  FaEnvelope
} from 'react-icons/fa'
import { 
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle
} from 'react-icons/hi'

// Custom Dropdown Component
const CustomDropdown = ({ value, onChange, options, disabled, label, currentStatus, getStatusBadgeColor, formatStatus, getStatusIcon }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusBadgeColor(currentStatus)}`}>
          {getStatusIcon && getStatusIcon(currentStatus)}
          {formatStatus(currentStatus)}
        </span>
        <div className="flex-1 relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-left focus:outline-none focus:border-[#f64a72] disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 transition-colors shadow-sm"
          >
            <span className="font-medium text-gray-900">{selectedOption.label}</span>
            <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl overflow-hidden">
              <div className="py-1 max-h-60 overflow-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-[#f64a72]/10 hover:text-[#f64a72] transition-colors ${
                      value === option.value ? 'bg-[#f64a72]/10 text-[#f64a72] font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AllOrder = () => {
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [updatingOrderId, setUpdatingOrderId] = useState(null)
    const [localStatuses, setLocalStatuses] = useState({})
    const [gridView, setGridView] = useState(1) // 1 = 1 column, 2 = 2 columns, 4 = 4 columns

    const fetchOrderDetails = async()=>{
      setLoading(true)
      const response = await fetch(SummaryApi.allOrder.url,{
        method : SummaryApi.allOrder.method,
        credentials : 'include'
      })

      const responseData = await response.json()

      const orders = responseData.data || []
      setData(orders)
      
      // Initialize local statuses
      const initialStatuses = {}
      orders.forEach(order => {
        if(order._id) {
          initialStatuses[order._id] = {
            orderStatus: order.orderStatus || 'pending',
            deliveryStatus: order.deliveryStatus || 'not_shipped'
          }
        }
      })
      setLocalStatuses(initialStatuses)
      
      setLoading(false)
    }

    const updateOrderStatus = async (orderId, orderStatus, deliveryStatus) => {
      setUpdatingOrderId(orderId)
      try {
        const response = await fetch(SummaryApi.updateOrderStatus.url, {
          method: SummaryApi.updateOrderStatus.method,
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            orderId,
            orderStatus,
            deliveryStatus
          })
        })

        const responseData = await response.json()

        if(responseData.success) {
          toast.success('Order status updated successfully', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }
          })
          fetchOrderDetails() // Refresh the order list
        } else {
          toast.error(responseData.message || 'Failed to update order status', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }
          })
        }
      } catch (error) {
        toast.error('Error updating order status', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }
        })
        console.error('Error:', error)
      } finally {
        setUpdatingOrderId(null)
      }
    }

    useEffect(()=>{
      fetchOrderDetails()
    },[])

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

    const orderStatusOptions = [
      { value: 'pending', label: 'Pending' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'processing', label: 'Processing' },
      { value: 'shipped', label: 'Shipped' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' }
    ]

    const deliveryStatusOptions = [
      { value: 'not_shipped', label: 'Not Shipped' },
      { value: 'in_transit', label: 'In Transit' },
      { value: 'out_for_delivery', label: 'Out for Delivery' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'failed', label: 'Failed' }
    ];

    const getGridClasses = () => {
      switch(gridView) {
        case 4:
          return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6';
        case 2:
          return 'grid grid-cols-1 lg:grid-cols-2 gap-6';
        default:
          return 'grid grid-cols-1 gap-6';
      }
    };

    if (loading && !data.length) {
      return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-[#f64a72] border-t-transparent rounded-full animate-spin"></div>
              <FaSpinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#f64a72] animate-spin" />
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">Loading orders...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
          </div>
        </div>
      )
    }

    if (!data.length) {
      return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="text-center px-4">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <HiOutlineShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#f64a72] to-[#e6395a] rounded-full opacity-20"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Available</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no orders to display at the moment.
            </p>
          </div>
        </div>
      )
    }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[#f64a72] to-[#e6395a] rounded-xl shadow-lg">
                <FaShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Orders</h1>
                <p className="text-gray-600 mt-1">Manage and update order statuses</p>
              </div>
            </div>

            {/* Grid View Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-md border border-gray-200">
              <button
                onClick={() => setGridView(1)}
                className={`p-2 rounded-md transition-all ${
                  gridView === 1 
                    ? 'bg-[#f64a72] text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Single Column"
              >
                <FaList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridView(2)}
                className={`p-2 rounded-md transition-all ${
                  gridView === 2 
                    ? 'bg-[#f64a72] text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Two Columns"
              >
                <FaTh className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridView(4)}
                className={`p-2 rounded-md transition-all ${
                  gridView === 4 
                    ? 'bg-[#f64a72] text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Four Columns"
              >
                <FaThLarge className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className={getGridClasses()}>

          {data.map((item, index) => {
            const isUpdating = updatingOrderId === item._id
            const orderId = item._id
            const localOrderStatus = localStatuses[orderId]?.orderStatus || item.orderStatus || 'pending'
            const localDeliveryStatus = localStatuses[orderId]?.deliveryStatus || item.deliveryStatus || 'not_shipped'

            const handleOrderStatusChange = (value) => {
              setLocalStatuses(prev => ({
                ...prev,
                [orderId]: {
                  ...prev[orderId],
                  orderStatus: value,
                  deliveryStatus: prev[orderId]?.deliveryStatus || item.deliveryStatus || 'not_shipped'
                }
              }))
            }

            const handleDeliveryStatusChange = (value) => {
              setLocalStatuses(prev => ({
                ...prev,
                [orderId]: {
                  ...prev[orderId],
                  orderStatus: prev[orderId]?.orderStatus || item.orderStatus || 'pending',
                  deliveryStatus: value
                }
              }))
            }

            const resetLocalStatuses = () => {
              setLocalStatuses(prev => ({
                ...prev,
                [orderId]: {
                  orderStatus: item.orderStatus || 'pending',
                  deliveryStatus: item.deliveryStatus || 'not_shipped'
                }
              }))
            }

            return (
              <div 
                key={item._id || item.userId + index} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Order Header with Gradient */}
                <div className="bg-gradient-to-r from-[#f64a72] via-[#e6395a] to-[#f64a72] p-4 md:p-6 text-white">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <FaCalendarAlt className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm md:text-base flex items-center gap-2">
                            <span>{moment(item.createdAt).format("MMMM DD, YYYY")}</span>
                          </p>
                          {item._id && (
                            <p className="text-xs text-white/90 mt-1 flex items-center gap-2">
                              <FaHashtag className="w-3 h-3" />
                              <span className="font-mono">#{item._id.slice(-8).toUpperCase()}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4 md:p-6 space-y-4">
                  {/* Status Section */}
                  <div className="space-y-4 pb-4 border-b">
                    <CustomDropdown
                      value={localOrderStatus}
                      onChange={handleOrderStatusChange}
                      options={orderStatusOptions}
                      disabled={isUpdating}
                      label="Order Status"
                      currentStatus={item.orderStatus || 'pending'}
                      getStatusBadgeColor={getStatusBadgeColor}
                      formatStatus={formatStatus}
                      getStatusIcon={getStatusIcon}
                    />

                    <CustomDropdown
                      value={localDeliveryStatus}
                      onChange={handleDeliveryStatusChange}
                      options={deliveryStatusOptions}
                      disabled={isUpdating}
                      label="Delivery Status"
                      currentStatus={item.deliveryStatus || 'not_shipped'}
                      getStatusBadgeColor={getStatusBadgeColor}
                      formatStatus={formatStatus}
                      getStatusIcon={getStatusIcon}
                    />

                    {(localOrderStatus !== (item.orderStatus || 'pending') || localDeliveryStatus !== (item.deliveryStatus || 'not_shipped')) && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => updateOrderStatus(item._id, localOrderStatus, localDeliveryStatus)}
                          disabled={isUpdating}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#f64a72] to-[#e6395a] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                        >
                          {isUpdating ? (
                            <>
                              <FaSpinner className="w-4 h-4 animate-spin" />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="w-4 h-4" />
                              <span>Update Status</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={resetLocalStatuses}
                          disabled={isUpdating}
                          className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Products */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaBox className="w-4 h-4 text-[#f64a72]" />
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">Products</h3>
                      <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {item?.productDetails?.length || 0} items
                      </span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {item?.productDetails?.map((product, idx) => (
                        <div
                          key={product.productId + idx}
                          className="flex gap-3 p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-[#f64a72]/30 transition"
                        >
                          <div className="relative">
                            <img
                              src={product.image?.[0] || '/placeholder.png'}
                              alt="product_image"
                              className="w-16 h-16 md:w-20 md:h-20 bg-white object-contain p-1.5 rounded-lg border-2 border-gray-100"
                            />
                            <div className="absolute -top-1 -right-1 bg-[#f64a72] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {product.quantity}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm md:text-base line-clamp-2 text-gray-900">
                              {product.name}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                              <span className="text-sm md:text-base text-[#f64a72] font-semibold">
                                {displayINRCurrency(product.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Shipping Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCreditCard className="w-4 h-4 text-blue-600" />
                        <h4 className="text-xs font-bold text-gray-900">Payment</h4>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="text-gray-700">
                          <span className="font-medium">Method:</span> {item.paymentDetails?.payment_method_type?.[0]?.replace('_', ' ') || 'N/A'}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Status:</span>
                          <span className={`ml-1 px-2 py-0.5 rounded text-xs ${item.paymentDetails?.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {item.paymentDetails?.payment_status || 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FaShippingFast className="w-4 h-4 text-purple-600" />
                        <h4 className="text-xs font-bold text-gray-900">Shipping</h4>
                      </div>
                      <div className="space-y-1 text-xs">
                        {item.shipping_options?.length > 0 ? (
                          item.shipping_options.map((shipping, idx) => (
                            <p key={idx} className="text-gray-700">
                              <span className="font-medium">Cost:</span> {displayINRCurrency(shipping.shipping_amount || 0)}
                            </p>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">N/A</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser className="w-4 h-4 text-gray-600" />
                      <h4 className="text-xs font-bold text-gray-900">Customer</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <FaEnvelope className="w-3 h-3" />
                      <span className="truncate">{item.email || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Total Amount Footer */}
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FaShoppingBag className="w-4 h-4 text-white" />
                        <span className="text-sm font-semibold text-white">Total</span>
                      </div>
                      <span className="text-lg md:text-xl font-bold text-white">
                        {displayINRCurrency(item.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AllOrder