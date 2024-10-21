# FLASK API for Image Search

## API Endpoint

- `localhost:5000/search`

## Model

- ResNet50

## Run

- `flask --app app run`

## Request

- method: post

```JSON
{
  "image": {
    "mime": "image/jpeg",
    "data": "BASE64_ENCODED_IMAGE_DATA"
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
