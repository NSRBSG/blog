---
id: 3
title: 'Web-based Multi-Agent Reinforcement Learning: The AI Tag Game Journey'
description: 'A web-based AI tag game side-project inspired by Arc Raiders. Sharing experiences on overcoming the "Lazy Agent" problem and building a multi-stage evolution model using Ray RLlib and PettingZoo.'
categories: ['AI', 'Project']
tags: ['Reinforcement Learning', 'Ray RLlib', 'PettingZoo', 'Python', 'ONNX']
date: '2026-01-12T13:45:00.000Z'
thumbnailUrl: '/images/ai_tag_game_thumbnail.png'
---

## 1. The Beginning: Inspiration from Arc Raiders

Recently, I read some development articles from Embark Studios about the game 'Arc Raiders'. I was deeply impressed by their approach: rather than injecting specific patterns, they drop the AI into harsh physics-based terrains with a survival condition ("reach the destination or die"), allowing it to learn and adapt on its own.

*Related Links:*
- [What research means at Embark Studios](https://medium.com/embarkstudios/what-research-means-at-embark-studios-2494c5d25320)
- [Transforming animation with machine learning](https://medium.com/embarkstudios/transforming-animation-with-machine-learning-27ac694590c)

I wanted to implement this idea in an accessible, lightweight **web environment**. Deferring complex planning, I jumped straight into coding with a goal of a progressively evolving 3-stage AI model:

- Stage 1: Basic function where the AI performs specific objectives.
- Stage 2: Player vs. AI competitive mode.
- Stage 3: A cooperative mode where the player and an AI ally team up against a formidable enemy AI.

---

## 2. Setting Up the RL Environment: Tech Stack

Approaching reinforcement learning for the first time, my mindset was focused on "utilizing tools effectively" rather than dwelling on grandiose theory.

- **Python 3.14.0 & PyTorch**: For building the baseline models.
- **Gymnasium**: The standard API for single-agent environments.
- **PettingZoo**: For creating 'multi-agent' environments simulating interactions like predators and prey.
- **Ray RLlib**: For distributed reinforcement learning training utilizing multiple CPU cores.
- **ONNX**: The format used to export trained models into the web environment.

---

## 3. Trials During Training: The Lazy Agent Problem

Contrary to the expectation that the AI would quickly dominate humans, I encountered my first major hurdle: the **'Lazy Agent'** phenomenon.

The AI fell into a local minimum strategy: "Instead of moving and taking penalties for failing, it's better to stay still and minimize the loss."

This problem was exacerbated when controlling all agents with a 'Single Brain'. To reduce the overall loss, some agents intentionally sacrificed themselves—a bizarre behavior to observe. This highlighted the urgent need for **distributed learning**.

```python
# Example of multi-agent setup utilizing PettingZoo + Ray RLlib
from ray.rllib.env.wrappers.pettingzoo_env import PettingZooEnv
from ray.tune.registry import register_env

def env_creator(args):
    return PettingZooEnv(my_custom_env.env())

register_env("my_env", env_creator)
```

---

## 4. Evolution of the Predator: How to Catch a Human?

"Can't it just block the entrance to win?"
Merely increasing the predator's speed or adding simple penalties was one-dimensional and boring. I wanted the win rate to be balanced at a tense 50:50. To achieve this, I bestowed **unique abilities** to each agent to balance the gameplay.

Furthermore, conducting real-time learning on server interactions was too resource-intensive for the web. Instead, I solved the progressive growth through model evolution stages:

- **Stage 1 (Basic Predator)**: Players can easily survive by finding a hiding spot. If careless, they get caught.
- **Stage 2 (Searching Predator)**: When the player disappears from sight, it actively searches likely hiding spots.
- **Stage 3 (Pattern Learner)**: Deploys a predator pre-trained to counter the player's preferred escape routes. It essentially invalidates any human exact-path tricks.

During this process, ONNX model conversion was quite tricky. After several failed attempts, I resolved it by integrating the ONNX conversion process directly into the training script (`train_rllib.py`).

---

## 5. Conclusion and Retrospective

Beyond simply mimicking an idea, independently discovering environmental flaws—like "merely blocking the exit shouldn't guarantee a win"—and balancing the agents was immensely satisfying.

Seeing the trained model successfully run dynamically on the web gave me a huge sense of accomplishment. Next, I plan to explore how to integrate these reinforcement learning components into other services, like e-commerce.
