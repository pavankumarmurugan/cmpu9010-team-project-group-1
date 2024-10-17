import pandas as pd


df = pd.read_csv('/Users/janezhang/final--project/pgvector/image_info.csv')


df.insert(0, 'id', range(1, len(df) + 1))


df.to_csv('/Users/janezhang/final--project/pgvector/article.csv', index=False)






