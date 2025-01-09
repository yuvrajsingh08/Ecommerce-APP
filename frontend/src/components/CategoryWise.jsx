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
      <h1 className="font-extrabold text-center text-4xl text-[#927ECD] font-playwrite my-4">
        SHOP BY CATEGORY
      </h1>
      <div className="flex gap-8 justify-evenly flex-wrap w-full mx-auto p-8 ">
        {categoryProduct.map((product, index) => {
          const discount = getRandomValue();
          return (
            <Link
              to={"/product-category?category=" + product?.category}
              className="cursor-pointer"
              key={product?.category}
            >
              <div className="h-80 w-60 overflow-hidden p-2 bg-[#927ECD] shadow-lg">
                <img
                  src={product?.productImage[0]}
                  alt={product?.category}
                  className="p-2  transition-all h-52 w-full object-scale-down bg-white"
                />
                <p className="text-white text-lg tracking-wider text-center mt-2 uppercase">
                  {product?.category}
                </p>
                <p className="text-gray-100 text-2xl font-bold tracking-wider text-center  uppercase">
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
