# backend/ai/trainer.py
from .env import RacingEnv
from .driver_ai import QLearningDriver
import numpy as np

def train_driver(episodes=200):
    env = RacingEnv()
    driver = QLearningDriver(n_states=500, n_actions=5)

    for ep in range(episodes):
        state = env.reset()
        total_reward = 0

        for t in range(500):  # steps per episode
            state_idx = int(state[0] // 10)
            action = driver.choose_action(state_idx)

            # Define simple action set
            action_map = [
                [0.5, 0.0, 0.0],  # accelerate
                [0.2, 0.1, 0.2],  # slight steer right
                [0.2, 0.1, -0.2], # slight steer left
                [0.0, 0.3, 0.0],  # brake
                [0.3, 0.0, 0.0],  # coast
            ]

            next_state, reward, done = env.step(action_map[action])
            next_idx = int(next_state[0] // 10)
            driver.learn(state_idx, action, reward, next_idx)
            total_reward += reward
            state = next_state

            if done:
                break

        print(f"Episode {ep+1}/{episodes} | Reward: {total_reward:.2f} | Lap Time: {env.get_lap_time():.2f}s")

    print("Training complete!")
    return driver.q_table
