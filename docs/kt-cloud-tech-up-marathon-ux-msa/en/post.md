---
id: 6
title: '[kt cloud TECH UP] From Blind Clicking to Tailored UX and MSA Transition'
description: 'Sharing experiences from building a 15,000 concurrent user ticketing platform: redesigning UX for runners and restructuring a Spring Boot project into a multi-module architecture.'
categories: ['Architecture', 'Project']
tags: ['Spring Boot', 'MSA', 'UX', 'kt cloud TECH UP', 'Multi-module']
date: '2026-01-25T10:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

This post is the first record detailing the rigorous process of building a specialized marathon ticketing platform as a key ongoing project during the **kt cloud TECH UP** intensive program. I will continue to share the technical challenges and retrospectives encountered during this project as time progresses.

---

## 1. Discovering the Problem: Why "Marathon Ticketing"?

The marathon market is experiencing explosive structural growth. Competitions grew by 10x from merely 19 in 2020 to 254 in 2024, attracting over a million participants. However, ticketing systems were vastly underprepared for this demand.

*   **Massive Traffic Failures:** Major events like the Seoul Marathon, boasting 40,000 slots, repeatedly suffered severe server crashes.
*   **Generic Platforms Ignoring the Runner’s Context:** Traditional platforms like Interpark only cared about "who clicked fastest." They lacked mechanisms to allocate users based on the fundamental nature of marathons—such as specific courses (Full, 10K) and individual pace groups.
*   **Loss of Fairness:** Widespread use of AI macro bots and scalpers scooping up hundreds of tickets severely damaged brand credibility.

**We concluded that marathon ticketing is not merely a 'one-off sales event'. It is a complex engineering problem of assigning tailored spots to runners in a 15,000-concurrent-user environment while actively halting AI macros.** We aimed to solve this chronic market issue from its roots.

---

## 2. Redesigning UX: True Ticketing for Runners

We boldly discarded the standard festival ticketing architecture: "Connect -> Infinite Queue Wait -> Frantically pick leftover spots -> Massive refunds due to mismatches."

Instead, we designed a targeted UX: Users must definitively select their **[Target Course (5K/10K/Half) & Pace Group (2min~6min/km)]** *before* they even enter the queue. They are then placed into specific sub-queues.
This paradigm ensures that ticketing winners are not merely those with swift fingers, but participants who clearly understand their racing specs. This drastically lowered the mismatch rate and operational refund risks.

---

## 3. Backend Survival Strategy: Monolithic to Multi-Module

Once the UX was established, the backend engineering question became: "How do we handle this massive influx of traffic alongside complex domain logic?" Our single monolithic repository featured an intricate web of user, auth, and business logic (ticketing, payments) tangled in 'main'.
As the crucial first step toward a Microservices Architecture (MSA), we initiated a **Multi-Module Refactoring** effort.

### 3.1. Separating `common` and `auth`
*   **`common` module:** Extracted universal logic like security utilities (`JwtTokenProvider`) into an independent package usable by all layers.
*   **`main` module:** Liberated to exclusively focus on and scale the highly trafficked core business (ticketing) logic.
*   **`auth` module:** We isolated authentication controllers and services. Crucially, we completely severed the dependency of `auth` from the `main` module, dramatically decoupling our domains.

### 3.2. First Trade-off: Should Auth and User Be Split?
The fiercest architectural debate was whether to completely split the **Auth** module from the **User** module.
*   **If Split:** `Auth` would inherently need to depend heavily on `User`. Managed poorly, this risks a fatal Circular Dependency.
*   **Our Choice (Consolidated):** Authentication mechanisms (login, JWT issuing, verification) inherently require continuous fetching of user data to operate. Given our current operational scale, we made the pragmatic architectural decision to tightly couple and unify the `User` domain inside the `Auth` module to minimize complexity and centralize the management perimeter.

Having separated the backend skeleton, defining the precise dependency boundaries and encapsulating domains became critical. This naturally triggered a profound debate at the build system level (Gradle).

➡️ ***(To be continued in the next post)***
