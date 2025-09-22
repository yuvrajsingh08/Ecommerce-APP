import React, { useEffect, useState } from 'react'
import SummaryApi from '../common';
import { Link } from 'react-router-dom';

const CategoryWise = () => {
     const [categoryProduct, setCategoryProduct] = useState([]);
     const [loading, setLoading] = useState(false);

     const categoryLoading = new Array(13).fill(null);
     const getRandomValue = () => {
       return Math.floor(Math.random() * 5) + 4;
     };

     const fetchCategoryProduct = async () => {
       setLoading(true);
       const response = await fetch(SummaryApi.categoryProduct.url);
       const dataResponse = await response.json();
       setLoading(false);
       setCategoryProduct(dataResponse.data);
     };
    //  console.log("categories wise ",categoryProduct);
     useEffect(() => {
       fetchCategoryProduct();
     }, []);

  return (
    <div className="container lg:py-12 mx-auto">
      <h1 className="font-extrabold text-center text-4xl text-[#f64a72] font-playwrite my-4">
        SHOP BY CATEGORY
      </h1>

      <div className="flex gap-8 justify-evenly flex-wrap w-full mx-auto p-8">
        {loading
          ? categoryLoading.map((_, index) => (
              <div
                key={index}
                className="h-80 w-60 p-2 bg-white shadow-lg rounded animate-pulse flex flex-col items-center justify-start"
              >
                <div className="h-52 w-full bg-pink-200 mb-4 rounded"></div>
                <div className="h-6 w-32 bg-pink-200 mb-2 rounded"></div>
                <div className="h-6 w-28 bg-pink-200 mb-2 rounded"></div>
                <div className="h-6 w-24 bg-pink-200 rounded"></div>
              </div>
            ))
          : categoryProduct.map((product, index) => {
              const discount = getRandomValue();
              return (
                <Link
                  to={"/product-category?category=" + product?.category}
                  className="cursor-pointer"
                  key={product?.category}
                >
                  <div className="h-80 w-60 overflow-hidden p-2 bg-[#f64a72] shadow-lg rounded">
                    <img
                      src={product?.productImage[0]}
                      alt={product?.category}
                      className="p-2 transition-all h-52 w-full object-scale-down bg-white rounded"
                    />
                    <p className="text-white text-lg tracking-wider text-center mt-2 uppercase">
                      {product?.category}
                    </p>
                    <p className="text-pink-100 text-2xl font-bold tracking-wider text-center uppercase">
                      Up to {discount}0% off
                    </p>
                    <p className="text-white text-lg tracking-wider text-center mb-2 uppercase">
                      Shop NOW
                    </p>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
}

export default CategoryWise
