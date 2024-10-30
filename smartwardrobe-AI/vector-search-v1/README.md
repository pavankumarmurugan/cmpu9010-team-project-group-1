# FLASK API for Image Search

## API Endpoint

- `localhost:9090/search`

## Model

- ResNet50

## Run

- `flask --app image_search.app run --host=0.0.0.0 --port=9090`
- `flask --app app run`

## Request

- method: post

```JSON
{
  "image": {
    "image_url": "image_url"
  }
}
```

## Response

```JSON
[
  {
    "article_id": "0541500001",
    "product_code": 541500
  },
  {
    "article_id": "0598795016",
    "product_code": 598795
  },
  {
    "article_id": "0700907007",
    "product_code": 700907
  }
  ...
]
```
# Build the Docker image
 - `docker build -t <image_name> .`

# Run the Docker container
 - `docker run -d -p 9090:9090 --name <container_name> <image_name>`
