from django.db import models

# Create your models here.
from django.db import models
from pgvector.django import VectorField


class ProductInfo(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_code = models.CharField(max_length=100, unique=True)
    image = models.ForeignKey(
        'ImageInfo',
        on_delete=models.SET_NULL,
        null=True,
        related_name='products'
    )

    def __str__(self):
        return self.product_code


class ImageInfo(models.Model):
    image_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(
        ProductInfo,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image_name = models.CharField(max_length=255)
    image_path = models.CharField(max_length=255)
    vector = VectorField(dimensions=2048)

    def __str__(self):
        return self.image_name
