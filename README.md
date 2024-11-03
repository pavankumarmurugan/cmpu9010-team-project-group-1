# 🛍️ **SmartWardrobe** 🎨

Welcome to the **AI-Driven Fashion Shopping Platform** project! This is an innovative fashion e-commerce site that harnesses the power of Artificial Intelligence (AI) to provide a **personalized, smart, and intuitive** shopping experience.

---

## 🚀 **Project Overview**

This platform revolutionizes online shopping by allowing users to:

- **Search** for products using **natural language** queries like _"Show me eco-friendly, sleeveless jumpsuits for a summer festival under 75 euros, with reviews mentioning comfort and durability."_
- **Upload images** to find visually similar fashion items.
- Get **personalized recommendations** based on user behavior, previous purchases, and preferences.
- Enjoy **AI-powered outfit matching** and **automated review summaries** to enhance the shopping experience.

The project focuses on delivering a fast, seamless, and enjoyable experience for fashion lovers, transforming the way users discover and purchase their favorite items.

---

## 🔑 **Key Features**

### 🧠 **Smart Search**

- **Natural Language Queries**: Search using phrases like _"Find casual jackets for winter."_ or _"Show me trendy summer shoes."_
- **Visual Search**: Upload images to discover visually similar items using AI-powered image recognition.

### 🎯 **Personalized Recommendations**

- **Content-Based Filtering**: Suggest products based on attributes like color, style, or brand.
- **Collaborative Filtering**: Recommend items based on the preferences and behavior of similar users.

### 👗 **Outfit Matching**

- **AI-powered** suggestions for complementary items to complete a look.

### ✨ **Sentiment Analysis**

- **NLP-driven** sentiment analysis summarizes customer reviews into easy-to-read highlights, e.g., _"Highly rated for comfort."_

---

## 📊 **Data Sources**

- **[Kaggle H&M Personalized Fashion Recommendations Dataset](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations/data)**  
   This dataset includes transaction logs, product metadata, and customer interaction data, all crucial for personalized recommendations and insights.
- **External Fashion Trends & Metadata**: Additional fashion trend data, seasonality, and social signals.

---

### 💻 **Smart Backend** [![codecov](https://codecov.io/gh/username/repository/branch/main/graph/badge.svg?token=YOURTOKEN)](https://codecov.io/gh/username/repository)

## Description

Smartwardrobe-backend is an e-commerce backend repository made with clean code Architecture using Nest.js Framework. It uses my AWS RDS MySql as a backend.

To run the repository create a .env filder under src folder and add contents relevant in env/sample.env. Replace the content with your original details.

It includes the following modules

1. User Auth using Passport
2. Bcrypt for password hashing
3. Product
4. Product Category
5. Product Inventory
6. Cart Item
7. Collabrative Chat Room
8. Similar Items api using OPEN AI Clip Model.

## Database Schema

![alt text](https://sw-uploads-img.s3.eu-north-1.amazonaws.com/diagram.png)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:debug

# production mode
$ npm run start:prod
```
