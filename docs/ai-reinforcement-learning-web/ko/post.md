---
id: 3
title: '웹 기반 멀티 에이전트 강화학습: AI 술래잡기 프로젝트 여정'
description: 'Arc Raiders에서 영감을 받아 시작한 웹 기반 AI 술래잡기 토이 프로젝트. Ray RLlib과 PettingZoo를 활용하여 게으른 에이전트(Lazy Agent) 문제를 극복하고 다단계 진화 모델을 구축한 경험을 공유합니다.'
categories: ['AI', 'Project']
tags: ['Reinforcement Learning', 'Ray RLlib', 'PettingZoo', 'Python', 'ONNX']
date: '2026-01-12T13:45:00.000Z'
thumbnailUrl: '/images/ai_tag_game_thumbnail.png'
---

## 1. 프로젝트의 시작: Arc Raiders에서 얻은 영감

최근 'Arc Raiders'라는 게임의 개발 관련 글(Embark Studios)을 읽게 되었습니다. 단순히 특정 패턴을 주입하는 것이 아니라, AI를 험난한 물리 지형에 던져두고 "정해진 곳에 도달하지 못하면 죽는다"는 생존 조건을 부여해 스스로 학습시키는 방식이 무척 인상 깊었습니다.

*관련 링크:*
- [What research means at Embark Studios](https://medium.com/embarkstudios/what-research-means-at-embark-studios-2494c5d25320)
- [Transforming animation with machine learning](https://medium.com/embarkstudios/transforming-animation-with-machine-learning-27ac694590c)

이 아이디어를 가볍고 접근성이 좋은 **웹 환경**에 구현해보고 싶었습니다. 복잡한 기획은 미뤄두고, 아래처럼 점진적으로 진화하는 3단계 AI 모델을 목표로 바로 코딩을 시작했습니다.

- 1단계: AI가 특정 목표를 수행하는 기본 기능
- 2단계: 사용자 vs AI 대결 모드
- 3단계: 사용자와 AI 동료가 협력하여 강력한 적 AI를 상대하는 모드

---

## 2. 강화학습 환경 구축: 기술 스택 선정

처음 강화학습을 접하면서 거창한 이론보다는 "도구를 잘 활용하자"는 마인드로 접근했습니다.

- **Python 3.14.0 & PyTorch**: 베이스라인 모델 구축
- **Gymnasium**: 단일 에이전트 환경의 표준 API
- **PettingZoo**: 포식자와 피식자처럼 여러 개체가 상호작용하는 '멀티 에이전트' 환경 구축
- **Ray RLlib**: 여러 코어를 활용한 분산형 강화학습 훈련
- **ONNX**: 훈련된 모델을 웹으로 내보내기 위한 포맷

---

## 3. 학습 중의 시련: 게으른 에이전트(Lazy Agent) 문제

AI가 인간을 압도할 것이라는 기대와 달리 첫 난관에 봉착했습니다. 가장 당황스러웠던 건 바로 **'게으른 에이전트(Lazy Agent)'** 현상이었습니다. 

AI가 "움직여서 실패로 인한 패널티를 받느니, 차라리 가만히 있어서 손실을 최소화하자"는 잘못된 전략(Local Minimum)에 빠진 것입니다. 

특히 모든 에이전트를 '단일 뇌(Single Brain)'로 통제했을 때 문제가 심각했습니다. 전체의 손실(Loss)을 줄이기 위해 몇몇 에이전트가 고의로 자신을 희생해버리는 기이한 현상까지 관찰되었습니다. 이를 해결하기 위해 **분산형 학습**에 대한 필요성을 깨닫게 되었습니다.

```python
# PettingZoo + Ray RLlib을 활용한 멀티 에이전트 세팅 예시
from ray.rllib.env.wrappers.pettingzoo_env import PettingZooEnv
from ray.tune.registry import register_env

def env_creator(args):
    return PettingZooEnv(my_custom_env.env())

register_env("my_env", env_creator)
```

---

## 4. 포식자의 진화: 어떻게 인간을 잡을 것인가?

"그냥 입구만 틀어막으면 이기는 거 아냐?"
포식자가 피식자(인간)를 잡기 위해 단순히 속도를 높이거나 패널티를 부여하는 일차원적인 방법은 지루했습니다. 승률이 5:5로 팽팽하게 유지되길 원했습니다. 이를 위해 각 에이전트에게 **고유한 능력**을 부여하여 밸런스를 맞췄습니다.

또한 매번 서버와 통신하며 실시간으로 사용자를 학습하는 방식은 웹 환경에서 리소스 낭비가 심했습니다. 그래서 단계적인 성장을 모델 자체의 진화로 풀었습니다.

- **1단계 (기본포식자)**: 플레이어가 숨을 곳을 찾으면 무난하게 넘길 수 있는 수준. 방심하면 잡힙니다.
- **2단계 (수색포식자)**: 플레이어가 시야에서 사라지면 숨을 만한 곳을 주도적으로 탐색합니다.
- **3단계 (인간의 패턴 학습)**: 플레이어가 즐겨 사용하는 특정 도주 경로를 카운터치도록 사전에 특화 훈련된 포식자 투입. 인간의 꼼수(꼼수 경로)마저 허용하지 않는 수준입니다.

이 과정에서 ONNX 모델 변환이 꽤 까다로웠는데, 여러 번의 실패 후 아예 훈련 스크립트(`train_rllib.py`) 내부에 ONNX 변환 로직을 직결시키는 구조로 해결했습니다.

---

## 5. 결론 및 회고

단순히 아이디어를 모방하는 것을 넘어, "출구만 막히면 성립되지 않는다"는 환경의 결함을 스스로 발견하고, 에이전트 간 밸런스를 맞춰나가는 과정이 매우 흥미로웠습니다.

웹상에 이 훈련된 모델을 성공적으로 띄우고 동작하는 모습을 보며 큰 성취감을 느꼈습니다. 다음에는 이 강화학습 컴포넌트를 이커머스나 다른 서비스에 어떻게 녹여낼지 고민해 보려 합니다.
