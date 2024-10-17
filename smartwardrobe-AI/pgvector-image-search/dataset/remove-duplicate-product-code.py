import pandas as pd


df = pd.read_csv('/Users/janezhang/final--project/pgvector/image_info.csv')

df_unique = df.drop_duplicates(subset='product_code')


df_unique.insert(0, 'id', range(1, len(df_unique) + 1))

df_unique[['id', 'product_code']].to_csv('/Users/janezhang/final--project/pgvector/pure_product.csv', index=False)

