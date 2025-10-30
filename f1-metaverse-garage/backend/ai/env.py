# backend/ai/env.py
import numpy as np

class RacingEnv:
    def __init__(self, track_length=1000):
        self.track_length = track_length  # meters
        self.position = 0
        self.speed = 0
        self.tire_wear = 0
        self.fuel_used = 0
        self.done = False
        self.lap_time = 0

    def reset(self):
        self.position = 0
        self.speed = np.random.uniform(40, 60)
        self.tire_wear = 0
        self.fuel_used = 0
        self.done = False
        self.lap_time = 0
        return self._get_state()

    def step(self, action):
        """
        action = [throttle, brake, steering]
        """
        throttle, brake, steer = action

        # Apply effects
        self.speed += throttle * 2 - brake * 3
        self.speed = np.clip(self.speed, 0, 320)

        self.position += self.speed * 0.1
        self.tire_wear += abs(steer) * 0.02 + self.speed / 5000
        self.fuel_used += self.speed / 3000
        self.lap_time += 0.1

        # Check end of lap
        if self.position >= self.track_length:
            self.done = True

        reward = (
            (self.speed / 100)
            - (self.tire_wear * 0.5)
            - (self.fuel_used * 0.2)
        )

        if self.done:
            reward += 50  # bonus for finishing lap

        return self._get_state(), reward, self.done

    def _get_state(self):
        return np.array([self.speed, self.tire_wear, self.fuel_used, self.position])

    def get_lap_time(self):
        return self.lap_time
