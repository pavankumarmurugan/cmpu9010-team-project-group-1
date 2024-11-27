import numpy as np
import psycopg2

from psycopg2.extensions import register_adapter, AsIs


# Adapt numpy types to PostgreSQL
def add_numpy_adapter():
    def adapt_numpy_int64(numpy_int):
        return AsIs(numpy_int)

    def adapt_numpy_float64(numpy_float):
        return AsIs(numpy_float)

    register_adapter(np.int64, adapt_numpy_int64)
    register_adapter(np.float64, adapt_numpy_float64)


# Connect to the database
def get_db_connection():
    conn = psycopg2.connect(
        dbname='postgres',
        user='root',
        password='rootuser',
        host='sw.clmeygaiqnad.eu-north-1.rds.amazonaws.com',
        port='5432'
    )
    return conn
