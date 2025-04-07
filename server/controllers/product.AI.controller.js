import OpenAI from "openai";
import Order from "../models/order.model.js";
import Wishlist from "../models/wishlist.model.js";
import Cart from "../models/cart.model.js";
import asyncHandler from "../middlewares/async.midleware.js";
import Product from "../models/product.model.js";
import {
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
  OPENAI_MODEL,
} from "../config/env.js";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
});

const model = OPENAI_MODEL;

const recommendProducts = async (
  allProducts,
  userData,
  recommendQuantity = 7
) => {
  const prompt = `
    You are an expert in e-commerce recommendations.
    Given the list of all available products: ${JSON.stringify(allProducts)},
    and a user's history: ${JSON.stringify(userData)},
    suggest ${recommendQuantity} product IDs that the user is most likely to buy.
    Only return an array of product IDs.
  `;

  const completion = await openai.chat.completions.create({
    model: model,
    messages: [{ role: "user", content: prompt }],
  });

  let responseText = completion.choices[0].message.content.trim();

  // Remove potential code block formatting
  if (responseText.startsWith("```json")) {
    responseText = responseText
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim();
  }

  const recommendedProductIds = JSON.parse(responseText);
  return recommendedProductIds;
};

const getUserData = async (id) => {
  const orders = await Order.find({ user: id })
    .populate({
      path: "orderItems.product",
      select: "brand category",
    })
    .select(
      "orderItems.product orderItems.name orderItems.price orderItems.size orderItems.color"
    );
  const wishlist = await Wishlist.find({ user: id })
    .populate({
      path: "products.product",
      select: "brand category",
    })
    .select(
      "products.product products.name products.price products.size products.color"
    );
  const cart = await Cart.find({ user: id })
    .populate({
      path: "products.product",
      select: "brand category",
    })
    .select(
      "products.product products.name products.price products.size products.color"
    );
  return {
    orders: orders,
    wishlist: wishlist,
    cart: cart,
  };
};

const getProductsData = async (inputLimit) => {
  const allProducts = await Product.find({ isPublished: true })
    .populate("category")
    .populate("brand")
    .sort({ createdAt: -1 })
    .limit(inputLimit || 100)
    .select(
      "-totalInStock -variants.countInStock -isFeatured -isPublished -__v"
    );
  return allProducts;
};

export const getAutoRecommendedProducts = asyncHandler(
  async (req, res, next) => {
    //param: userId, recommendQuantity, inputLimit
    try {
      const { userId, recommendQuantity, inputLimit } = req.query;
      if (!userId) {
        const error = new Error("User ID is required");
        error.statusCode = 400;
        throw error;
      }
      const allProducts = await getProductsData(inputLimit);

      // return res.status(200).json({ ...allProducts });

      const { orders, wishlist, cart } = await getUserData(userId);
      const userData = {
        userId: userId,
        orders: orders,
        wishlist: wishlist,
        cart: cart,
      };
      // return res.status(200).json({ ...userData });

      const recommendedProductIds = await recommendProducts(
        allProducts,
        userData,
        recommendQuantity
      );

      const recommendedProducts = await Product.find({
        _id: { $in: recommendedProductIds },
      });

      res.status(200).json({
        success: true,
        message: "Recommended products fetched successfully",
        data: {
          recommendedProducts,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

const recommendProductsWithReason = async (
  allProducts,
  userData,
  description,
  recommendQuantity = 7
) => {
  const prompt = `
    You are an expert in e-commerce recommendations.
    Given the list of all available products: ${JSON.stringify(allProducts)},
    a user's history: ${JSON.stringify(userData)},
    and the user's description of their needs: "${description}",
    suggest ${recommendQuantity} products that best match their needs.

    Provide ONLY valid JSON in this exact format:
    {
      "reason": "Explain why these products are recommended.",
      "recommendedProductIds": ["productId1", "productId2", ...]
    }
    NO extra text, NO explanations, NO comments, JUST JSON.
  `;

  const completion = await openai.chat.completions.create({
    model: model,
    messages: [{ role: "user", content: prompt }],
  });

  let responseText = completion.choices[0].message.content.trim();

  // Remove Markdown JSON block formatting if present
  if (responseText.startsWith("```json")) {
    responseText = responseText
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim();
  }

  // **Remove comments (lines starting with //) before parsing**
  responseText = responseText.replace(/\/\/.*$/gm, "").trim();

  console.log(responseText);
  const responseObject = JSON.parse(responseText);
  return responseObject;
};

export const getRecommendedProductsWithReason = asyncHandler(
  async (req, res, next) => {
    try {
      const { userId, recommendQuantity, inputLimit, description } = req.query;
      if (!description) {
        const error = new Error("User description is required");
        error.statusCode = 400;
        throw error;
      }

      const allProducts = await getProductsData(inputLimit);
      let userData = null;

      if (userId) {
        const { orders, wishlist, cart } = await getUserData(userId);
        userData = { userId, orders, wishlist, cart };
      }

      const { reason, recommendedProductIds } =
        await recommendProductsWithReason(
          allProducts,
          userData,
          description,
          recommendQuantity
        );

      // return res.status(200).json(resText);
      const recommendedProducts = await Product.find({
        _id: { $in: recommendedProductIds },
      });

      res.status(200).json({
        success: true,
        message: "Recommended products with reasons fetched successfully",
        data: {
          reason,
          recommendedProducts,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);
