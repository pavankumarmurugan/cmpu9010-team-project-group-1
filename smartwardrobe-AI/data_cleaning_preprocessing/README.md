**H&M Personalized Fashion Recommendations dataset**

**Data Source** :
<https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations/data>

**Initial Analysis :**

Performed an initial EDA (Exploratory Data Analysis) on the data and
identified required features for the project and visualized the same.

Notebook : h&m_visulaization.ipynb

Insights : Data was missing some features like season, occasion,
material

**Feature extraction :**

**Season Extraction:**

Approach 1: Using pre-defined hugging-face transformer models
(ResNet50(weights=\'imagenet\') on transformed sentances
(\'sentence-transformers/all-MiniLM-L6-v2\')

Notebook : h&m_cleaning_sentance_transformer.ipynb

**Outcomes** : Wasn't able to get accurate results with plain features
and descriptions of products.

Approach 2: Using pre-defined hugging-face transformer models
(ResNet50(weights=\'imagenet\') and cluster the products based on
seasons and segregate

Notebook : Season_extraction.ipynb

Outcomes: Wasn't able to get accurate results of clusters.

Other models used: (\'bert-base-uncased\')

**Simple and Better approach:**

**Feature mapping for season,occasion,material**

With a pre-defined set of mapping for all the product types, this
approach helped in mapping the whole dataset with those features. (
manual intervention and cleaning was needed wherever necessary)

Notebook : h&m_cleaning.ipynb

**Outcome** : All the required features are obtained **\'Image\',
\'Product_name\', \'Product_type\', \'Pattern\', \'Color\',
\'Color_shade\', \'Material\',\'Occasion\', \'Applicabe_season\',
\'Description\', \'Applicable_season\'**

**DeepFashion-MultiModal Dataset**

**Source :** <https://github.com/yumingj/DeepFashion-MultiModal>

The dataset had quality images; parsed version of images compatible for
VR try on feature.

The data set didn't have the required features or details about the
products.

Features extraction:

Approach : Generate low-level features out of images from hugging face
pre-trained models and convert the features to readable text with other
models or gpt API

Models used : openai/clip-vit-base-patch32 , gpt -2 (pre-trained models
in hugging face)

Notebook : clip_model.ipynb

Other models used : MobileNetV2(weights=\'imagenet\'),
VGG16(weights=\'imagenet\')

Other approaches tried : Multimodal training with already obtained h&m
dataset.

Notebook : train_model.ipynb

**Outcomes :** Pre-trained models generated more features (around 10000)
which wasn't used to generate text and rgb colours were not identified
properly to colour code and get shade of product

Final approach : gpt API (gpt -- 4o mini)

Used GPT API to generate features out of product images

Pros: Accurate features and detailed descriptions.

Cons: un structured data with different formats of responses from gpt
API

Sample:

![image](https://github.com/user-attachments/assets/cebf1f46-2929-4127-9933-1a5da561901c)

Notebook : Features_openai_image.ipynb

This enabled us to gather responses for around 2k images with required
features

This further needed deep cleaning with keywords.

Notebook : feature_cleaning.ipynb
