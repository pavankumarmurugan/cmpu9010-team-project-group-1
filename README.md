# 🛍️ **SmartWardrobe** 🎨

Welcome to the **AI-Driven Fashion Shopping Platform** project! This is an innovative fashion e-commerce site that harnesses the power of Artificial Intelligence (AI) to provide a **personalized, smart, and intuitive** shopping experience. Please use this URL to checkout out website https://smartwardrobe.store/

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

### 💻 **Smart Backend** [![Codecov](https://codecov.io/gh/pavankumarmurugan/cmpu9010-team-project-group-1/branch/develop/graph/badge.svg?token=71e3fa8b-4ff2-497d-bf2e-36f39c66a9e5)](https://codecov.io/gh/pavankumarmurugan/cmpu9010-team-project-group-1)

## Description

Smartwardrobe-backend is an advanced e-commerce backend repository built with clean code architecture using the Nest.js framework. It is designed to handle a wide range of features for modern e-commerce platforms. The backend leverages AWS RDS PostgreSQL as its database.

To set up the project, create a .env file under the src folder and populate it with relevant configurations from the env/sample.env file. Replace the placeholders with your actual credentials and settings.

Key Features:

1. User Authentication and Management:
   - Secure user authentication using Passport.js.
   - Password hashing implemented with Bcrypt for added security.
2. Product Management:
   - CRUD operations for products, categories, and subcategories.
3. Cart Functionalities:
   - Add, update, and manage cart items.
4. Collaborative Chat Room:
   - Support for user-to-user and group messaging.
   - Attachment handling and message typing.
5. AI-Powered Similar Items API:
   - Integration with OpenAI CLIP Model for finding visually and contextually similar products.
   - Uses Faiss Search library to recommend similar products.
6. Friendship and Social Features:
   - Friend requests, friendship management, and group creation.
   - Notifications for real-time updates.

## Database Schema

The database schema supports a variety of e-commerce modules, including users, products, categories, inventory, carts, chats, social features, and more. Below is a high-level depiction:

![alt text](https://sw-uploads-img.s3.eu-north-1.amazonaws.com/db_diagram.png)

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

Modules Overview

User Module

- Handles user registration, login, and profile management.
- Includes password reset and secure token generation.
  Product Module
- Supports hierarchical categorization with categories and subcategories.
- Real-time inventory management through triggers and procedures.
  Cart
- Seamless cart operations for adding/removing items and tracking sizes.
  Chat and Notifications
- Real-time group and individual chats.
- In-app and email notifications for friend requests, updates, and more.
  Advanced Similar Items
- FAISS-based search implementation in Nest.js for fast similar item recommendations.

This backend is a robust solution for modern e-commerce platforms, blending scalable architecture with innovative features.
