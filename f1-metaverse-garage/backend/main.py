# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ai.trainer import train_driver
import random

app = FastAPI()

class RaceConfig(BaseModel):
    track: str
    ai_difficulty: int
    laps: int
    car_team: str
    collisions: bool
    damage: str
    starting_grid: str
    weather: str
    dynamic_weather: bool

@app.post("/api/race/setup")
def save_race_config(config: RaceConfig):
    # Later this can integrate with your AI training or race simulation
    print(f"✅ Race setup received: {config}")
    return {"status": "success", "received": config.dict()}

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Racing Backend Ready!"}

@app.post("/train")
def train_ai_driver(episodes: int = 100):
    q_table = train_driver(episodes)
    return {"status": "training_complete", "episodes": episodes, "q_table_shape": str(q_table.shape)}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Setup(BaseModel):
    downforce: float
    drag: float
    engine: float
    tire: str
    fuel: float

@app.get("/")
def root():
    return {"message": "F1 Metaverse Garage Backend Running 🚗"}

@app.post("/predict")
def predict(setup: Setup):
    # temporary simple formula
    performance_score = (setup.engine * 0.5) + (setup.downforce * 0.3) - (setup.drag * 0.2)
    lap_time = 90 - (performance_score * 0.2)
    return {"predicted_lap_time": lap_time}


@app.get("api/ai/drive")
def ai_drive():
    return{
        "throttle": random.uniform(0.8,0.1),
        "steering":random.uniform(-0.1, 0.1)
    }
