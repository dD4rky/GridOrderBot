import fastapi
from pydantic import BaseModel

from tinkoff.invest import Client, Quotation
from tinkoff.invest import OrderDirection, OrderType
from tinkoff.invest.constants import INVEST_GRPC_API

def float_to_quotation(num : float):
    return Quotation(units=int(num), nano=int((num-int(num))*1e9))
class PlaceOrderRequest(BaseModel):
    token : str
    account_id : str
    figi : str
    start_price : float
    q_per_step : int
    steps : int
    price_step : float


class PlaceOrderResponse(BaseModel):
    status : bool

app = fastapi.FastAPI(debug=True)

@app.post("/place_orders")
def place_orders(msg : PlaceOrderRequest):
    with Client(msg.token, target = INVEST_GRPC_API) as client:
        price = msg.start_price
        for step_ in range(msg.steps):
            order = client.orders.post_order(account_id=msg.account_id,
                                    figi=msg.figi,
                                    quantity=msg.q_per_step,
                                    price=float_to_quotation(price),
                                    direction=OrderDirection.ORDER_DIRECTION_BUY,
                                    order_type=OrderType.ORDER_TYPE_LIMIT)
            print(order)
            price -= msg.price_step


        # print(client.operations.get_portfolio(account_id=msg.account_id))
        
    # response = PlaceOrderResponse()
    # response.status = True 
    return "True"