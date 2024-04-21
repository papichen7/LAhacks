import json
import os
from pymongo import MongoClient, InsertOne
from dotenv import load_dotenv

load_dotenv()
CONNECTION_STRING=os.getenv('MONGODB_URI')
client = MongoClient(CONNECTION_STRING)
db = client.data
collection = db.users
requesting = []

with open("../frontend/src/data/philosophers.json") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting.append(InsertOne(myDict))

result = collection.bulk_write(requesting)
client.close()