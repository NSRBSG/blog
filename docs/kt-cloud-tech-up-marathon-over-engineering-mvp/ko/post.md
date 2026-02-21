---
id: 12
title: '[kt cloud TECH UP] Kafka가 꼭 필요할까? 멘토링으로 깨달은 MVP와 오버 엔지니어링의 경계'
description: 'kt cloud 현업 멘토님과의 아키텍처 리뷰를 통해, 무리한 Kafka 도입을 멈추고 Redis 기반의 MVP로 방향을 튼 "더하기보다 빼기"의 개발 경험을 공유합니다.'
categories: ['Architecture', 'Mentoring', 'Project']
tags: ['Kafka', 'Redis', 'MVP', 'Over-Engineering', 'kt cloud TECH UP', 'Mentoring']
date: '2026-01-24T12:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

치열하게 진행된 **kt cloud TECH UP 실무 통합 프로젝트**. 오늘은 코드를 직접 짠 이야기보다, 현업에 종사하시는 **kt cloud 시니어 멘토님과의 아키텍처 리뷰**를 통해 기획 방향성을 크게 수정했던 '깨달음'의 과정을 회고해 보고자 합니다.)

---

## 1. 주니어의 흔한 착각: "이왕 하는 거 Kafka 써봐야지!"

프로젝트 초기, 마라톤 티켓팅이라는 '대규모 트래픽' 키워드에 심취한 우리 백엔드 팀은 야심 찬 아키텍처를 그렸습니다. 
*"15,000명의 접속자가 몰리면 결국 Queue가 필요하다. 업계 표준에 맞춰 Apache Kafka를 도입해서 완벽한 비동기 이벤트 큐 시스템을 만들자!"*

저희는 Kafka 클러스터를 구성하고, 토픽을 나누며 수많은 시간을 고민했습니다. 하지만 곧 열린 kt cloud 멘토님과의 기술 리뷰 시간, 당당하게 내놓은 우리 아키텍처 다이어그램을 보시고 멘토님은 정곡을 찌르는 질문을 던지셨습니다.

>**멘토님 (kt cloud 클라우드 팀):**
>"현재 2개월이라는 짧은 프로젝트 기간과 한정된 인력(백엔드 4명) 안에서, **Kafka가 '꼭' 필요한 명확한 비즈니스적 이유가 있나요?** 지금 기획된 트래픽 제어는 Redis만으로도 충분히 구현할 수 있습니다. 명확한 이유 없이 기술 학습만을 위해 무거운 시스템을 끼워 넣는 건, 전형적인 **오버 엔지니어링(Over-engineering)**입니다."

---

## 2. 빼기의 미학: MVP(Minimum Viable Product)를 향해

이 피드백을 통해 프로젝트의 본질을 다시 생각하게 되었습니다. 우리는 실제 고객의 'Pain Point'를 해결하기 위해 모였으므로, 기술적 성취보다는 비즈니스적 가치 제공이 우선되어야 했습니다. 멘토님의 조언 아래, 우리는 냉정하게 아키텍처를 다이어트(Diet)하기 시작했습니다.

### 우리에게 필요한 큐(Queue)의 본질
우리가 원했던 것은 결제 완료 후의 알림 톡 발송 같은 분산 비동기 처리가 아니었습니다. 단지 프론트엔드에서 넘어오는 막대한 요청을 일렬로 세우는 **'진입 대기열(Waiting Room)'**이 필요했을 뿐입니다.

```java
// 예시: Redis Sorted Set을 활용한 단순하고 강력한 대기열 진입 로직
public boolean addToWaitingQueue(String userId, String eventId) {
    long timestamp = System.currentTimeMillis();
    // Redis의 Sorted Set에 유저 추가 (score = 진입 시간)
    Boolean added = redisTemplate.opsForZSet()
            .add("waitingQueue:" + eventId, userId, timestamp);
            
    // 현재 큐 사이즈 확인하여 최대 허용량 초과 시 컷오프
    Long currentSize = redisTemplate.opsForZSet().size("waitingQueue:" + eventId);
    if (added && currentSize > MAX_ALLOWED_TICKETING_USERS) {
        // 이미 큐가 꽉 찼다면 진입 성공했지만 '대기 상태'로 클라이언트에 반환
        return false; 
    }
    return true; // 바로 티켓팅 화면 진입
}
```

이 코드는 Kafka를 구축하고 프로듀서/컨슈머를 설정하는 복잡한 과정 없이, 단 몇 줄의 Spring Data Redis 코드와 `Sorted Set(ZSet)` 자료구조만으로 우리의 핵심 비즈니스 요구사항을 완벽하게 충족시켰습니다.

---

## 3. 타협이 아닌 '진짜 실력'

멘토님은 덧붙이셨습니다.
>"현업 스타트업이나 신규 프로젝트에서도 **가장 중요한 것은 주어진 시간 안에 핵심 가치가 담긴 MVP를 고객에게 선보이는 것**입니다. 멋진 설계를 핑계로 런칭이 한 달 늦어지는 것보다, 기본 기술로 시장에 빨리 나가 피드백을 받는 개발자가 환영받습니다. 아키텍처는 한 번에 완성되는 것이 아닙니다. 작게 시작해서(Redis), 나중에 진짜 부하가 DB를 찢을 때 그때 Kafka로 분리하는 점진적 고도화를 보여주세요."

Kafka를 내려놓은 결단 덕분에 우리는 남은 시간 동안 **API Gateway의 보안, S3 Presigned URL 최적화, 그리고 클라이언트 화면 렌더링 최적화**와 같은 다른 중요한 기능들을 성공적으로 마무리할 수 있었습니다.

개발자는 기술을 사랑하지만, 그 기술이 비즈니스(프로젝트)의 목을 조르게 놔두어서는 안 된다는 것. 이번 kt cloud 멘토링을 통해 얻은 가장 값진 실무 마인드셋입니다. 

다음 글에서는 티켓팅 시스템의 또 다른 골칫거리, AI 매크로 방어 시스템을 어떻게 비용 효율적으로 설계했는지에 대한 멘토링 후기를 공유하겠습니다.
