import fastapi
from tinkoff.invest import Client
from tinkoff.invest import Quotation, CandleInterval
from tinkoff.invest.constants import INVEST_GRPC_API

from datetime import datetime, timedelta
import json

import indicators

import numpy as np

app = fastapi.FastAPI(debug=True)

def quotation_to_float(quotation : Quotation):
    return quotation.units + quotation.nano / 1e9

def get_json(obj):
    return json.loads(
        json.dumps(obj, default=lambda o: getattr(o, '__dict__', str(o)))
    )

def get_timeframe(str_tf):
    TFS = {
        "m5" : {"tf" : CandleInterval.CANDLE_INTERVAL_5_MIN,
                "td" : timedelta(minutes=5)},
        "h1" : {"tf" : CandleInterval.CANDLE_INTERVAL_HOUR,
                "td" : timedelta(hours=1)},
        "h4" : {"tf" : CandleInterval.CANDLE_INTERVAL_4_HOUR,
                "td" : timedelta(hours=4)},
        "d1" : {"tf" : CandleInterval.CANDLE_INTERVAL_DAY,
                "td" : timedelta(days=1)}
        }
    return TFS[str_tf]["tf"], TFS[str_tf]["td"]

@app.get("/get_candlestick_data")
def get_candlestick_data(token : str, figi : str, timeframe : str):
    tf, td = get_timeframe(str_tf=timeframe)
    data = []
    with Client(token, target = INVEST_GRPC_API) as client:
        candles = client.get_all_candles(figi=figi, 
                               interval=tf,
                               to=datetime.now(),
                               from_=datetime.now() - td * 2000)
        for candle in candles:
            candle_data = {
                "open" : quotation_to_float(candle.open),
                "high" : quotation_to_float(candle.high),
                "low" : quotation_to_float(candle.low),
                "close" : quotation_to_float(candle.close),
                "time" : int(candle.time.timestamp())
            }
            data.append(candle_data)
    return data

@app.get("/get_levels")
def get_support_levels(token : str, figi : str, timeframe: str):
    ohlct = get_candlestick_data(token, figi, timeframe)

    min_, max_ = [], []
    for ohlc in ohlct:
        min_.append(ohlc["low"])
        max_.append(ohlc["high"])

    l_sup, l_res, l_sup_idx, l_res_idx = indicators.support_resistence(min_=np.array(min_), max_=np.array(max_), prominence=5*0.01)

    data = {
        "support" : list(l_sup),
        "resistence" : list(l_res),
    }

    return data