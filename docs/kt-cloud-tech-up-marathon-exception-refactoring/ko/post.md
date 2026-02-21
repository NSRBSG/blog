---
id: 11
title: '[kt cloud TECH UP] 협업을 위한 백엔드의 기본기: ErrorCode 및 Exception 전역 리팩토링'
description: '프론트엔드-백엔드 간 커뮤니케이션 비용을 획기적으로 낮춰준 Global Exception Handler 도입과 ErrorCode Enum 설계 리뷰 경험을 다룹니다.'
categories: ['Architecture', 'Refactoring', 'Project']
tags: ['Spring Boot', 'Exception Handling', 'Refactoring', 'kt cloud TECH UP', 'Collaboration']
date: '2026-02-21T11:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

본 포스팅은 수많은 협업과 트러블슈팅이 오갔던 **kt cloud TECH UP 실무 통합 프로젝트** 마라톤 티켓팅 플랫폼 구축기의 이어지는 기록입니다.)

---

## 1. 프론트엔드의 비명: "이 에러는 대체 왜 나는 건가요?"

프로젝트 초기, 각 백엔드 개발자들은 자신이 맡은 모듈(Auth, Event, User 등)에서 각자의 스타일대로 예외 처리를 진행했습니다. 누군가는 단순한 `IllegalArgumentException`을 던졌고, 누군가는 `ResponseEntity`에 String 텍스트를 담아 반환했으며, HTTP Status Code 또한 `400 Bad Request`와 `500 Internal Server Error` 사이에서 갈피를 잡지 못했습니다.

결과는 처참했습니다. 프론트엔드 팀은 API가 실패할 때마다 나오는 제각각의 응답 포맷 때문에 공통 에러 처리 로직을 도저히 작성할 수가 없었습니다.
"이 400 에러는 토큰이 만료된 건가요? 아니면 입력값이 잘못된 건가요?" 
이런 질문이 슬랙(Slack)을 수없이 오가며 **치명적인 커뮤니케이션 비용(소모)**이 발생하고 있었습니다.

---

## 2. 예측 가능한 약속(Contract) 설계: ErrorCode Enum

가장 먼저 선행되어야 할 것은 프론트엔드와 백엔드 사이의 "에러에 대한 규약(Contract)"을 정립하는 것이었습니다. 우리는 도메인별, 상황별로 고유한 커스텀 에러 식별자를 부여하는 **`ErrorCode` Enum** 구조를 도입했습니다.

```java
// 예시: 명확하게 정의된 ErrorCode Enum
public enum ErrorCode {
    // Auth
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH_001", "토큰이 만료되었습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH_002", "유효하지 않은 토큰입니다."),

    // Event (마라톤)
    EVENT_NOT_FOUND(HttpStatus.NOT_FOUND, "EVT_001", "해당 이벤트를 찾을 수 없습니다."),
    TICKET_SOLD_OUT(HttpStatus.CONFLICT, "EVT_002", "티켓이 매진되었습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
    // ... 생성자 및 Getter
}
```

이제 프론트엔드는 더 이상 `message` 필드의 문자열을 파싱하는 위험한 짓을 하지 않아도 됩니다. 응답 포맷에 떨어지는 `EVT_002`라는 고유한 `code`만 확인하면 화면에 "티켓이 모두 매진되었습니다!" 라는 UI 모달을 즉각적으로 띄울 수 있게 되었습니다.

---

## 3. 예외의 중앙 통제소: Global Exception Handler

에러 사전을 만들었으니, 그 다음은 프로젝트 전역에 흩어져 있는 무분별한 `try-catch`와 `throw new RuntimeException()` 코드를 일괄 청소할 차례였습니다. 우리는 Spring의 `@RestControllerAdvice`를 활용해 **Global Exception Handler**를 구축했습니다.

비즈니스 로직에서는 이제 에러 포맷에 대해 전혀 신경 쓰지 않고 단 한 줄의 코드만 던지면 됩니다.

```java
// 비즈니스 로직은 순수하게 자신의 일만 수행
if (event.isSoldOut()) {
    throw new CustomException(ErrorCode.TICKET_SOLD_OUT);
}
```

이 `CustomException`이 비즈니스 레이어에서 튀어나오면, 최상단의 `@RestControllerAdvice`가 이를 낚아채어 미리 약속된 일관된 JSON 포맷(예: `{ "code": "EVT_002", "message": "티켓이 매진되었습니다." }`)으로 예쁘게 포장하여 클라이언트에게 응답을 반환합니다.

---

## 4. 리뷰와 리팩토링, 백엔드의 본질

이 리팩토링(`refactor(backend): errorcode 및 exception 개선(리뷰 후 수정)`)은 엄청난 트래픽을 감당하는 아키텍처(MSA, Gateway, Redis) 기술들처럼 화려해 보이지 않을 수 있습니다. 

하지만 백엔드 개발자에게 가장 본질적인 덕목 중 하나는 **"같이 일하는 프론트엔드 개발자(더 나아가 클라이언트 자체)가 편안하게 사용할 수 있는, 예측 가능한 단단한 API 생태계를 구축하는 것"**입니다. 이 전역 예외 처리 리팩토링은 팀 전체의 개발 속도를 비약적으로 상승시켜 준, 이번 프로젝트에서 가장 성공적인 사내 인프라 정비 작업이었습니다.

