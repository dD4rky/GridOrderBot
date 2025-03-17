import fastapi

from tinkoff.invest import Client
from tinkoff.invest import InstrumentIdType
from tinkoff.invest.constants import INVEST_GRPC_API

import json

app = fastapi.FastAPI(debug=True)

def get_json(obj):
    return json.loads(
        json.dumps(obj, default=lambda o: getattr(o, '__dict__', str(o)))
    )

@app.get("/get_instruments")
def get_instruments(token : str, query : str):
    with Client(token, target = INVEST_GRPC_API) as client:
        data = get_json(client.instruments.find_instrument(query=query))
        data['query'] = query

    return data

@app.get("/get_instrument")
def get_instrument(token : str, figi : str):
    with Client(token, target = INVEST_GRPC_API) as client:
        data = get_json(client.instruments.get_instrument_by(id_type=InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI,
                                                             id=figi))
    return data