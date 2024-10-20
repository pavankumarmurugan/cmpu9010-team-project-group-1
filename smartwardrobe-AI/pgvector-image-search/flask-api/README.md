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
{
    "Results": [
        [
            "0541500001",
            0.1513595830639909
        ],
        [
            "0598795016",
            0.1724507263396352
        ],
        [
            "0700907007",
            0.17393510490685393
        ],
        [
            "0508542004",
            0.17533671176579002
        ],
        [
            "0733027002",
            0.17902621537403696
        ],
        [
            "0693677006",
            0.1810843408577687
        ]
    ]
}
```
