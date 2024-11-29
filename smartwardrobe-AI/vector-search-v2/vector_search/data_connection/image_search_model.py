import psycopg2


# Connecting to a PostgreSQL Database
def connect_db():

    connection = psycopg2.connect(
        dbname='postgres',  # database name
        user='root',  # user ID
        password='rootuser',  # cryptographic
        host='sw.clmeygaiqnad.eu-north-1.rds.amazonaws.com',  # RDSTerminal node of the instance
        port='5432'  # PostgreSQL ports
    )

    # connection = psycopg2.connect(
    #     dbname='image-search',  # database name
    #     user='postgres',  # user ID
    #     password='test-postgres',  # cryptographic
    #     host='127.0.0.1',  # RDSTerminal node of the instance
    #     port='5432'  # PostgreSQL ports
    # )

    return connection
