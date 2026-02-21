---
id: 9
title: '[kt cloud TECH UP] 대규모 진입을 통제하라: API Gateway 대기열과 Redis Rate Limiting'
description: '15,000명 동시 접속을 버티기 위한 Gateway의 두 번째 역할. 대기열(WaitingRoom) 필터와 Redis를 활용한 Rate Limiting, 그리고 봇 탐지 필터 적용기를 다룹니다.'
categories: ['Architecture', 'Performance', 'Project']
tags: ['API Gateway', 'Redis', 'Rate Limiting', 'kt cloud TECH UP', 'Spring Boot']
date: '2026-02-20T10:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

본 포스팅은 치열하게 진행 중인 **kt cloud TECH UP 실무 통합 프로젝트** 마라톤 티켓팅 플랫폼 구축기의 이어지는 기록입니다. (이전 글: [API Gateway 인증 통합과 헤더 스푸핑(Spoofing) 방어전](../kt-cloud-tech-up-marathon-gateway-spoofing))

---

## 1. 예측 불가능한 15k 트래픽과 봇의 습격

인증 병목과 보안 이슈를 1차적으로 해결한 API Gateway에 또 다른 막중한 임무가 부여되었습니다. 바로 **"무자비한 트래픽으로부터 백엔드(main) 서버를 온전히 지켜내는 것"**이었습니다.

마라톤 티켓팅 오픈 시간, 짧은 순간에 15,000명이 넘는 사용자와 더불어 좋은 자리를 선점하려는 수백 개의 자동화된 봇(Bot)과 매크로 스크립트가 동시에 서버를 타격합니다. 이 트래픽을 아무런 여과 없이 DB 쿼리가 돌아가는 뒷단 비즈니스 서버로 흘려보내면 결론은 뻔했습니다. 서버 다운.

우리는 Gateway에서 트래픽의 유속을 조절하고 불량 트래픽을 쳐내는 강력한 "댐"을 만들기로 했습니다.

---

## 2. 진입을 통제하는 첫 번째 댐: 대기열(WaitingRoom)과 봇 탐지

가장 먼저 Gateway 필터 체인에 추가한 것은 **대기열(WaitingRoom)** 필터와 **봇 탐지(Bot Detection)** 필터였습니다.

1.  **봇 탐지(Bot Detection) 필터:** 비정상적으로 짧은 간격으로 티켓팅 API를 찌르는 요청, 혹은 비정상적인 규칙을 가진 User-Agent를 식별하여, 봇으로 의심되는 트래픽을 비즈니스 로직에 닿기 전에 원천 차단(403 Forbidden)합니다.
2.  **대기열(WaitingRoom) 필터:** 봇을 통과한 정상적인 유저라 할지라도, 백엔드 서버가 감당할 수 있는 최대 처리량(Throuhput)을 초과하는 순간부터는 사용자들을 가상의 대기열로 보냅니다. 클라이언트는 "현재 대기 인원"을 확인하고 잠시 대기한 뒤 순차적으로 입장하게 됩니다.

이 구조 덕분에 백엔드 서버는 본인들이 처리할 수 있는 "항상 일정하고 소화 가능한 수준의 트래픽"만 건네받으며 안정적으로 결제와 좌석 할당을 처리할 수 있게 되었습니다.

---

## 3. 개인별 폭주를 막는 두 번째 댐: Redis Rate Limiting

대기열만으로는 부족했습니다. 한 명의 유저(혹은 특정 IP)가 정상적인 봇 탐지를 우회하여 새로고침(F5)을 1초에 수십 번씩 연타하는 상황을 제어해야 했습니다. 이를 위해 **Redis 기반의 Rate Limiting(처리율 제한)**을 도입했습니다.

Spring Cloud Gateway는 내장된 `RedisRateLimiter`를 제공합니다. 이를 통해 우리는 특정 라우터(티켓팅 API 등)에 대해 **"한 유저(또는 IP)당 1초에 허용되는 최대 요청 수(replenishRate)와 일시적인 폭주 허용량(burstCapacity)"**을 엄격하게 정의했습니다.

### ⚠️ 아찔했던 트러블슈팅: Rate Limit NPE (NullPointerException)
Rate Limiting을 적용하고 신나게 부하 테스트를 진행하던 중, 알 수 없는 이유로 Gateway 로그에 `NullPointerException`이 쏟아지며 라우팅이 먹통이 되는 현상이 발생했습니다. (`security(backend): JWT 토큰 보안 취약점 및 Rate Limit NPE 수정` 커밋)

**[원인 분석]**
Spring의 Redis Rate Limiter는 제한을 걸 'Key'가 필요합니다. Key Resolver를 통해 현재 요청의 주체(IP 또는 JWT에서 추출한 User-ID)를 반환해야 하는데, 인증이 필요 없는(Permit All) API 라우트나 토큰이 만료된 요청이 들어왔을 때 이 Key 생성기에서 `null`을 반환해 버린 것입니다. Redis 구성 요소가 `null` Key를 처리하려다 NPE를 터뜨린 것이었죠.

**[해결]**
Key Resolver 코드를 수정하여, `X-User-Id` 헤더가 없는 익명 사용자의 경우 클라이언트의 원본 IP 주소를 Fallback Key로 사용하도록 안전하게 래핑(Wrapping)했습니다. (물론 프록시나 로드밸런서를 거치는 경우를 대비해 `X-Forwarded-For` 헤더를 추출하는 로직도 잊지 않았습니다.)

---

## 4. 백엔드 개발자에게 Gateway란?

결과적으로 우리의 비즈니스 서버(`main`)는 트래픽이 얼마나 쏟아지든, 해커가 봇을 돌리든 평온하게 자기 할 일(도메인 로직)만 수행하게 되었습니다.

멀티 모듈 분리부터 캡슐화, 인증 통합, 그리고 이번 대용량 트래픽 통제까지. 마라톤 플랫폼을 구축하며 다룬 API Gateway는 단순히 '요청을 전달해 주는 프록시'가 아니라, **MSA 아키텍처에서 전체 시스템의 생명줄을 쥐고 있는 가장 지능적이고 거대한 수문장**이라는 사실을 뼛속 깊이 깨달았습니다.

프로젝트는 계속 흘러갑니다. 다음 포스팅에서는 파일 업로드로 인한 네트워크 병목을 획기적으로 해결한 이야기가 이어집니다.
