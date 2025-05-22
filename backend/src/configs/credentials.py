import os

from dotenv import load_dotenv

load_dotenv()

credentials = {
    "username": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "db": os.getenv("POSTGRES_DB"),
}


def get_credentials():
    return credentials
