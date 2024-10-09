# 🛍️ **AI-Powered Fashion E-Commerce Platform** 🎨

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

### 💻 **Smart Backend**

## Description

Smartwardrobe-backend is an e-commerce backend repository made with clean code Architecture using Nest.js Framework. It uses my AWS RDS MySql as a backend.

To run the repository create a .env filder under src folder and add contents relevant in env/sample.env. Replace the content with your original details.

It includes the following modules

1. User Auth using Passport
2. Bcrypt for password hashing
3. Product
4. Product Category
5. Product Inventory

Future scope

6. Payment Details
7. User Address
8. User Payment
9. Cart Item
10. Discount
11. Order Details
12. Order Items

## Database Schema

![alt text](https://smartwardrobe-misc.s3.eu-north-1.amazonaws.com/diagram.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCmV1LW5vcnRoLTEiSDBGAiEAxiWLJt2EtkKlORR65maLUGbtp15zM%2FGn5JYcxQC4nh8CIQDmP%2B7cHwnyACfvwyCGVl9QYJYqk%2F69gr90JLnZBB1%2BDSr9AghcEAAaDDA4NTA4ODg1MDA1OSIMiCOry%2Bkj%2BnFAyjREKtoChdAXwLKk%2BEslhrAp8s2vH1qJtyQDjHyicawyYNdhswkvyN%2B%2FDzkq0zQcn1BnyCJ3MPZPy%2FaYTqa1bXNq4sjBPVIA2A9r2vuw3AVe6IZeLryh%2BsIJXcQTTZ3q7j5C3Mwvcwu6bP5V%2F3U4piPBDBqEIn7%2BnZoMoqA3JL3Ro64gLlbMEgKsTPLlaVoCFZD5p6N9JKbfVMj3AdfD7LiyisFxEIZIkbeLk25E023KfizYnyH7Fb6f0357qrdZIe%2FIA6MnWZGzdkpAmuvuLfAUdOHBSrXJGmI2%2FO29zKFWXALVDm1oQro1s6tx5jgB8dK4%2BCrdFkOXXmPsMM7Pmg%2BEO1wKxZLBX002GSOsZCTkpdPKOxgYywTu8wqWBrXIw8up33ayK5aec%2FabTPFSTag6dq%2F55J66XxeN9JfWBvEeosNzwV6j2o0oVgBggNn8lAXnYHum2liR7DDW2eUcADC2ypm4BjqyAj%2FyF2V3nNGNETf4QIMEdYbq7qEr6D3Ctwr5Nevmpyhv5IHYLdb4b03IRNAClck6A3FumR8WVfaILIFceXnb3z%2FE4DutVdxFwUcZo%2Bn%2BAF4g6GCiMh93mjTwCLVdWCNIhFN%2FWQklj5RrSIUZAIrZMwGFLXXA6tgdtHjgaUruOtqJhRzzOQcvWuuwPj9spRQyWGEmVPyvd6z54vvIRlM8Pp%2FBMo4QaWylkGOOA%2BtUesHcSc9sqOYb645hqGqvr4eAISdO5zVBbmzzrh2gDY9DVB3B4ZI%2FkUM68LYK2P9%2BHwWscPBXu64xv3yqEhjQWfm4BT3jjI5cs4keckTJV%2FGoejZD3zbMB%2BaTUf5z1LLx314MvA9azYYa9nATfaFd96L5h4f9K%2Bf6RPXXkC5PPGmD%2F2euKw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20241009T113225Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIARHT5Q2CF3AI5K5CA%2F20241009%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=8bfe5d89d639241c32d196f7ad63278a985df1d67d9fe883b8724caacc49d392)

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
