---
id: 12
title: '[kt cloud TECH UP] Do We Really Need Kafka? Unlearning Over-engineering for MVP'
description: 'Reflecting on an architectural pivot spurred by kt cloud mentor feedback. Sharing the invaluable lesson of choosing a Redis MVP over a bloated Kafka setup to prioritize business value.'
categories: ['Architecture', 'Mentoring', 'Project']
tags: ['Kafka', 'Redis', 'MVP', 'Over-Engineering', 'kt cloud TECH UP', 'Mentoring']
date: '2026-01-24T12:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

Amid the intense development phases of the **kt cloud TECH UP** project, today I am stepping away from the raw code. Instead, I want to retrospect on a pivotal architectural pivot triggered by a deeply insightful **technology review session with a veteran kt cloud mentor**.)

---

## 1. The Junior Trap: "We must use Kafka for scale!"

During the project's inception, heavily intoxicated by the buzzwords of "massive traffic" inherent to marathon ticketing, our backend team drafted a highly ambitious architectural blueprint. 
*"If 15,000 users swarm the system, we undeniably need a queue. Let's adhere to industry standards and erect an Apache Kafka cluster for a flawless asynchronous event-driven architecture!"*

We spent considerable time wrestling with Kafka cluster configurations, topic partitioning, and consumer groups. However, during the architectural review session, a kt cloud senior engineer examined our diagram and dropped a piercing question that halted our momentum.

>**Mentor (kt cloud Senior Engineer):**
>"Given your tight two-month project timeline and limited manpower (four backend developers), **is there a concrete, undeniable business requirement dictating the absolute necessity of Kafka right now?** The traffic queueing you’ve planned can easily be managed with Redis alone. Forcing a heavyweight system into the stack merely for the sake of learning—without a clear operational need—is a textbook case of **Over-engineering**."

---

## 2. The Art of Subtraction: Marching Toward the MVP

This feedback prompted a re-evaluation of our priorities. We had gathered to solve real user "Pain Points," where delivering the service takes precedence over technical ambition. Heeding the mentor's counsel, we ruthlessly began putting our architecture on a diet.

### The True Nature of the Queue We Needed
We didn't actually need complex, decoupled, asynchronous distributed processing (like firing off payment confirmation KakaoTalk messages). What we essentially required was a simple **'Waiting Room (Turnstile)'** to serialize the massive influx of requests hitting the frontend.

```java
// Example: A spectacularly simple yet potent Waiting Room using Redis Sorted Sets
public boolean addToWaitingQueue(String userId, String eventId) {
    long timestamp = System.currentTimeMillis();
    // Insert user into Redis Sorted Set (score = arrival timestamp)
    Boolean added = redisTemplate.opsForZSet()
            .add("waitingQueue:" + eventId, userId, timestamp);
            
    // Check current queue capacity to cut off excess traffic
    Long currentSize = redisTemplate.opsForZSet().size("waitingQueue:" + eventId);
    if (added && currentSize > MAX_ALLOWED_TICKETING_USERS) {
        // User entered queue, but capacity exceeded; return 'waiting' state to client
        return false; 
    }
    return true; // Proceed immediately to ticketing screen
}
```

This single block of Spring Data Redis code, leveraging the inherent power of the `Sorted Set (ZSet)` data structure, flawlessly satisfied our core business requirements. We entirely bypassed the brutal complexity of deploying Kafka brokers and orchestrating Producer/Consumer lifecycles.

---

## 3. Real Competence is Knowing When Not to Build

The mentor left us with a parting thought.
>"In real-world startups and new corporate ventures, **the absolute highest priority is delivering a Minimum Viable Product (MVP) containing core value to the customer within the designated timeframe.** An engineer who launches to market early using foundational technologies to gather feedback is infinitely more valuable than one who delays a launch by a month designing a 'perfect' architecture. Architectures are never built perfectly on day one. Start small (Redis), and when the traffic genuinely threatens to tear your DB apart, demonstrate progressive enhancement by migrating to Kafka *then*."

Because we decisively abandoned Kafka, we reclaimed hundreds of engineering hours. We redirected that vital energy into successfully polishing **API Gateway security, S3 Presigned URL optimizations, and frontend rendering performance**—features that directly impacted user experience.

Engineers naturally romanticize complex technologies, but we must never let that romance strangle the business objective. This was undeniably the most profound professional mindset shift I acquired during the kt cloud mentoring program.

In the next post, I will share another fascinating mentoring outtake: How we strategically designed a highly cost-efficient AI Macro Defense system without going bankrupt on cloud bills.
