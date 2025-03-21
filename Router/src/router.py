import fastapi
# from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import requests

import redis
import json

app = fastapi.FastAPI(debug = True)

# with open("./config.json", "r") as f:
#     origins = json.load(f)["origins"]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

class RouterPlaceOrderRequest(BaseModel):
    figi : str
    start_price : float
    q_per_step : int
    steps : int
    price_step : float

@app.get("/")
def root():
    return {"success": "true"}

@app.post("/place_orders")
def place_order(msg : RouterPlaceOrderRequest):
    r = redis.Redis(host='redis-db', port=6379, decode_responses=True)
    token = r.get('token')
    account_id = r.get('account_id')

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
    r = redis.Redis(host='redis-db', port=6379, decode_responses=True)

    cached = r.get(f'cache/get_instruments/{query}')
    if cached != None:
        return json.loads(cached)

    token = r.get('token')

    request_data = {
        "query" : query,
        "token" : token
    }
    response = requests.get('http://instrument-manager:8083/get_instruments', params=request_data)
    data = json.dumps(response.json())

    r.set(f'cache/get_instruments/{query}', data, ex=60*60)

    r.close()
    return json.loads(data)

@app.get("/get_instrument")
def get_instrument(figi : str):
    r = redis.Redis(host='redis-db', port=6379, decode_responses=True)

    cached = r.get(f'cache/get_instrument/{figi}')
    if cached != None:
        return json.loads(cached)
    
    token = r.get('token')

    request_data = {
        "figi" : figi,
        "token" : token
    }
    response = requests.get('http://instrument-manager:8083/get_instrument', params=request_data)
    data = json.dumps(response.json())

    r.set(f'cache/get_instrument/{figi}', data, ex=60*60)

    r.close()
    return json.loads(data)

@app.get("/get_candlestick_data")
def get_candlestick_data(figi : str, timeframe : str):
    r = redis.Redis(host='redis-db', port=6379, decode_responses=True)

    cached = r.get(f'cache/get_candlestick_data/{figi}-{timeframe}')
    if cached != None:
        return json.loads(cached)

    token = r.get('token')

    request_data = {
        "figi" : figi,
        "timeframe" : timeframe,
        "token" : token
    }
    response = requests.get('http://chart-loader:8084/get_candlestick_data', params=request_data)
    data = json.dumps(response.json())

    r.set(f'cache/get_candlestick_data/{figi}-{timeframe}', data, ex=60)

    r.close()
    return json.loads(data)


@app.get("/get_orders")
def get_orders():
    r = redis.Redis(host='redis-db', port=6379, decode_responses=True)
    token = r.get('token')
    account_id = r.get('account_id')

    request_data = {
        "token" : token,
        "account_id" : account_id
    }
    response = requests.get('http://order-manager:8081/get_orders', params=request_data)

    r.close()
    return response.json()