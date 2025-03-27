from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Set, Optional
import json
import asyncio

app = FastAPI()

# Модель для хранения активных подписок
class SubscriptionManager:
    def __init__(self):
        self.active_connections: Dict[WebSocket, Set[str]] = {}
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self.lock:
            self.active_connections[websocket] = set()

    def disconnect(self, websocket: WebSocket):
        async with self.lock:
            if websocket in self.active_connections:
                del self.active_connections[websocket]

    async def add_subscription(self, websocket: WebSocket, figi: str):
        async with self.lock:
            if websocket in self.active_connections:
                self.active_connections[websocket].add(figi)

    async def remove_subscription(self, websocket: WebSocket, figi: str):
        async with self.lock:
            if websocket in self.active_connections and figi in self.active_connections[websocket]:
                self.active_connections[websocket].remove(figi)

    async def broadcast(self, figi: str, data: dict):
        async with self.lock:
            for websocket, subscriptions in self.active_connections.items():
                if figi in subscriptions:
                    await websocket.send_json({
                        "figi": figi,
                        "data": data
                    })

manager = SubscriptionManager()

# Модели данных
class InstrumentData(BaseModel):
    figi: str
    price: float
    volume: int

class SubscriptionRequest(BaseModel):
    action: str  # "subscribe" или "unsubscribe"
    figi: str

# WebSocket endpoint для управления подписками
@app.websocket("/ws/subscriptions")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            raw_data = await websocket.receive_text()
            try:
                data = json.loads(raw_data)
                request = SubscriptionRequest(**data)
                
                if request.action == "subscribe":
                    await manager.add_subscription(websocket, request.figi)
                elif request.action == "unsubscribe":
                    await manager.remove_subscription(websocket, request.figi)
                
                await websocket.send_json({"status": "success", "figi": request.figi})
                
            except Exception as e:
                await websocket.send_json({"status": "error", "message": str(e)})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# HTTP endpoint для получения данных
@app.post("/publish")
async def publish_data(data: InstrumentData):
    await manager.broadcast(data.figi, {
        "price": data.price,
        "volume": data.volume
    })
    return {"status": "data broadcasted"}
