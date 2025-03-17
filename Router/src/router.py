import fastapi
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import requests

import redis

app = fastapi.FastAPI(debug = True)

origins = [
    "http://176.112.66.214:8082"
]

# Добавляем CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class RouterPlaceOrderRequest(BaseModel):
    figi : str
    start_price : float
    q_per_step : int
    steps : int
    price_step : float

class OrderManagerPlaceOrderRequest(BaseModel):
    token : str
    account_id : str
    figi : str
    start_price : float
    q_per_step : int
    steps : int
    step : float


@app.get("/")
def root():
    return {"success": "true"}

@app.post("/place_orders")
def place_order(msg : RouterPlaceOrderRequest):
    # get token from db
    r = redis.Redis(host='redis-db', port=6379, decode_responses=True)
    token = r.get('token')
    account_id = r.get('account_id')
    # generate request
    request_data = {
        "token" : token,
        "account_id" : account_id,
        "figi" : msg.figi,
        "start_price" : msg.start_price,
        "q_per_step" : msg.q_per_step,
        "steps" : msg.steps,
        "price_step" : msg.price_step
    }

    response = requests.post('http://order-manager:8081/place_orders', json=request_data)

    r.close()
    print(response)
    return True

@app.get("/get_instruments")
def get_instruments(query : str):
    # get token from db
    r = redis.Redis(host='redis-db', port=6379, decode_responses=True)
    token = r.get('token')

    request_data = {
        "query" : query,
        "token" : token
    }
    response = requests.get('http://instrument-manager:8083/get_instruments', params=request_data)

    r.close()
    return response.json()

@app.get("/get_instrument")
def get_instrument(figi : str):
    # get token from db
    r = redis.Redis(host='redis-db', port=6379, decode_responses=True)
    token = r.get('token')

    request_data = {
        "figi" : figi,
        "token" : token
    }
    response = requests.get('http://instrument-manager:8083/get_instrument', params=request_data)

    r.close()
    return response.json()

@app.get("/get_candlestick_data")
def get_candlestick_data(figi : str, timeframe : str):
    r = redis.Redis(host='redis-db', port=6379, decode_responses=True)
    token = r.get('token')

    request_data = {
        "figi" : figi,
        "timeframe" : timeframe,
        "token" : token
    }
    response = requests.get('http://chart-loader:8084/get_candlestick_data', params=request_data)

    r.close()
    return response.json()