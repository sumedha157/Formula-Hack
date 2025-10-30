# backend/ai/driver_ai.py
import numpy as np
import random

class QLearningDriver:
    def __init__(self, n_states=1000, n_actions=5, alpha=0.1, gamma=0.9, epsilon=0.1):
        self.q_table = np.zeros((n_states, n_actions))
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon
        self.n_actions = n_actions

    def choose_action(self, state_idx):
        if random.uniform(0, 1) < self.epsilon:
            return np.random.randint(self.n_actions)
        return np.argmax(self.q_table[state_idx])

    def learn(self, s, a, r, s_next):
        best_next = np.max(self.q_table[s_next])
        td_target = r + self.gamma * best_next
        self.q_table[s, a] += self.alpha * (td_target - self.q_table[s, a])
