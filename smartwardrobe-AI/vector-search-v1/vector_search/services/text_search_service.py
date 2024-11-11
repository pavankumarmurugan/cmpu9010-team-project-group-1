import json
import os
import torch
import openai
from transformers import CLIPModel, CLIPProcessor
from vector_search.models.text_search_model import get_db_connection, add_numpy_adapter

# Get API Key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize the model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Initialize OpenAI API
openai.api_key = OPENAI_API_KEY


def expand_search_query_with_gpt(search_query):
    print(search_query)
    prompt = f"""Based on the user's product search query: '{search_query}', three more specific product search queries are generated. Each generated search query must contain all the text of the user's original product search query. Possible expansion directions include: Type, pattern, color, material, and applicable season. Each generated search query should not exceed 10 words. 
Ensure the responses are in valid JSON format, structured as follows:
    {{
        "query1": "description1",
        "query2": "description2",
        "query3": "description3"
    }}
    Make sure the responses are in exact JSON format and do not add anything else."""

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a shopping assistant, helping the user find more accurate products."},
                {"role": "user", "content": prompt}
            ],
            # response_format={"query": "json_object"},
            max_tokens=100
        )
        print("Response from GPT:", response)
        # Extract the generated detailed description list from the response
        response_content = response.choices[0].message.content
        print("response_content:", response_content)
        # Remove extra line breaks and indents
        cleaned_response = response_content.strip().replace("\n", "").replace("  ", "")
        print("Cleaned Response:", cleaned_response)

        # Parse valid JSON
        try:
            expanded_queries = json.loads(cleaned_response)
            print("Expanded queries:", expanded_queries)
            # Convert to target structure
            transformed_data = [
                {"query": query} for query in expanded_queries.values()
            ]

            # Print JSON
            print(json.dumps(transformed_data, indent=4))
            return transformed_data
        except json.JSONDecodeError as e:
            print("Error decoding JSON:", e)
            return []
        return transformed_data


    except Exception as e:
        print("Error in GPT API call:", e)
        return []


# Text Search service
def perform_search(search_query, top_k=200):
    # Add numpy type adapter
    add_numpy_adapter()

    # Expand search query using GPT
    expanded_queries = expand_search_query_with_gpt(search_query)

    # Generate embedding vectors for the search query
    inputs = processor(text=search_query, return_tensors="pt", padding=True)
    with torch.no_grad():
        search_embedding = model.get_text_features(**inputs).numpy().flatten()

    search_embedding_str = ','.join([str(x) for x in search_embedding])

    # sql_query = f"""
    #     select t1.image_name, t2.id, 1 - (t1.text_vector <=> '[{search_embedding_str}]') AS similarity
    #     from {table_name} t1, products t2
    #     where t1.image_name = t2.image_name
    #     ORDER BY similarity DESC
    #     LIMIT {top_k};
    #    """

    # sql_query = f"""
    #     select t1.image_name, t2.id, t1.text_vector <=> '[{search_embedding_str}]' AS similarity
    #     from products_des_embedding t1, products t2
    #     where t1.image_name = t2.image_name
    #     ORDER BY similarity
    #     LIMIT {top_k};
    #    """

    sql_query = f"""
        SELECT t1.image_name, t2.id, t1.text_vector <=> '[{search_embedding_str}]' AS similarity
        FROM products_des_embedding t1
        JOIN products t2 ON t1.image_name = t2.image_name
        ORDER BY similarity
        LIMIT {top_k};
    """

    # Get database connection
    conn = get_db_connection()

    # Execute query and return results
    try:
        with conn.cursor() as cur:
            cur.execute(sql_query)
            results = cur.fetchall()

        return {
            "search_results": [{"image_name": row[0], "product_id": row[1]} for row in results],
            "expanded_queries": expanded_queries
        }

    finally:
        conn.close()
