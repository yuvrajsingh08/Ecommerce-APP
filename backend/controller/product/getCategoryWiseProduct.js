const productModel = require("../../models/productModel")

const getCategoryWiseProduct = async(req,res)=>{
    try{
        const { category, page, limit } = req?.body || req?.query
        let skip = parseInt(page-1)*parseInt(limit);
        let curr = parseInt(limit);
        const totalProducts = await productModel.find({category});
        const product = await productModel
        .find({ category })
        .skip(skip)
        .limit(curr);
        console.log("Total data", totalProducts);
        console.log("Current data",product)
        res.json({
            data : product,
            message : "Product",
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = getCategoryWiseProduct