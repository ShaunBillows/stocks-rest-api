# rest-api for storing stock portfilios

example query

{
  "username": "insert_user",
  "password": "insert_password",
  "email": "insert_email",
  "addStock": {
    "stock": "AAPL",
    "quantity": 2
  }
}

dotenv environment variables

MONGO_URI=mongodb_uri
SECRET=jwt_key
