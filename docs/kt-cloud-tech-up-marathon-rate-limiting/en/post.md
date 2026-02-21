---
id: 9
title: '[kt cloud TECH UP] Controlling the Influx: API Gateway Waiting Room and Redis Rate Limiting'
description: 'Gateway’s second mission to withstand 15,000 concurrent users. Exploring the WaitingRoom filter, Redis-backed Rate Limiting, and Bot Detection mechanisms.'
categories: ['Architecture', 'Performance', 'Project']
tags: ['API Gateway', 'Redis', 'Rate Limiting', 'kt cloud TECH UP', 'Spring Boot']
date: '2026-02-20T10:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

This post is an ongoing record detailing the rigorous marathon ticketing platform build during the **kt cloud TECH UP** project. (Previous post: [API Gateway Auth Integration and Header Spoofing Defense](../kt-cloud-tech-up-marathon-gateway-spoofing))

---

## 1. Unpredictable 15k Traffic and Bot Incursions

Having initially resolved authentication bottlenecks and security vulnerabilities, our API Gateway was confronted with another monumental duty: **"Flawlessly shielding the backend (main) server from merciless traffic."**

When marathon ticketing opens, it's not just 15,000 legitimate users attempting to secure a spot. Concurrently, hundreds of automated bots and macro scripts ruthlessly bombard the server. Permitting this unfiltered torrent of traffic to hit the backend business servers (where heavy database queries execute) guarantees one universal outcome: System Collapse.

We resolved to engineer a formidable "dam" at the Gateway tier to surgically regulate traffic flow and block malicious requests pre-emptively.

---

## 2. The First Dam: WaitingRoom and Bot Detection

The first additions to our Gateway filter chain were the **Bot Detection** and **WaitingRoom** filters.

1.  **Bot Detection Filter:** Identifies requests hitting the ticketing API at unnaturally rapid intervals or originating from irregular User-Agent signatures. It proactively denies (403 Forbidden) suspected bot traffic before it ever touches business logic.
2.  **WaitingRoom Filter:** Even for legitimate users who pass bot detection, the moment total traffic exceeds the backend server's maximum safe throughput, the Gateway reroutes excess users into a virtual waiting room. Clients see their "Current Queue Position" and proceed to enter sequentially.

Thanks to this architecture, the backend server only ever receives a "consistent, totally digestible volume of traffic," allowing it to process payments and allocate seats with unwavering stability.

---

## 3. The Second Dam against Individual Spikes: Redis Rate Limiting

The WaitingRoom alone wasn't impenetrable. We had to control scenarios where a single legitimate user (or IP) bypassed bot detection and frantically pounded F5 (refresh) dozens of times a second. We deployed **Redis-backed Rate Limiting** to combat this.

Spring Cloud Gateway provides a native `RedisRateLimiter`. Using this, we strictly defined parameters for critical routes (like the Ticketing API): **"The maximum allowed requests per second per user/IP (replenishRate) and the absolute maximum temporary burst capacity (burstCapacity)."**

### ⚠️ Hair-raising Troubleshooting: Rate Limit NPE
While confidently running load tests after applying the Rate Limits, the Gateway routing inexplicably crashed, spewing thousands of `NullPointerExceptions` into the logs. (Ref: Our commit `security(backend): Fix JWT vulnerability and Rate Limit NPE`)

**[Root Cause Analysis]**
Spring's Redis Rate Limiter requires a 'Key' to apply restrictions against. We used a Key Resolver to extract the current user's identity (the `X-User-Id` header injected from JWT). However, when requests arrived for unauthenticated routes (Permit All) or with expired tokens, our Key resolver inadvertently returned `null`. The Redis component predictably threw an NPE when commanded to rate limit a `null` key.

**[The Fix]**
We completely overhauled the Key Resolver code. We safely wrapped it to execute a fallback: if an anonymous user lacks an `X-User-Id` header, the system dynamically extracts their raw Client IP address to function as the fallback Rate Limiting Key. (We also meticulously ensured extraction of the `X-Forwarded-For` header to account for clients hidden behind load balancers.)

---

## 4. What is a Gateway to a Backend Developer?

Ultimately, our business server (`main`) has achieved absolute serenity. Whether a massive marketing spike drives 20,000 users or hackers deploy botnets, the backend server quietly and efficiently executes its singular duty: Domain Logic.

From multi-module separation to dependency encapsulation, unified authentication, and now immense traffic regulation. Building this marathon platform cemented a profound realization: An API Gateway is not merely a 'proxy that passes requests'. **It is the most intelligent, gigantic vanguard holding the lifeblood of the entire system architecture in an MSA environment.**

The project flows on. In the next post, I will share how we drastically resolved network I/O bottlenecks caused by media uploads.
