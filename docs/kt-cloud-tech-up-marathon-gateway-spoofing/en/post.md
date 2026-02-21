---
id: 8
title: '[kt cloud TECH UP] API Gateway Auth Integration and Header Spoofing Defense'
description: 'API Gateway as the vanguard for 15,000 concurrent connections. The advantages of unified JWT processing and how we actively defeated a fatal "X-User-Id Header Spoofing" vulnerability.'
categories: ['Architecture', 'Security', 'Project']
tags: ['API Gateway', 'Security', 'JWT', 'Spoofing', 'kt cloud TECH UP', 'MSA']
date: '2026-02-18T09:15:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

This post is an ongoing record detailing the rigorous marathon ticketing platform build during the **kt cloud TECH UP** project.)

---

## 1. Gateway Roadmap: The Authentication Bottleneck

In a ticketing scenario bombarded by 15,000 concurrent users, 'Authentication' rapidly becomes one of the backend's most severe bottlenecks. If multiple Microservices (`main`, `payment`, etc.) each individually unpackage and mathematically verify JWT signatures, an exorbitant amount of computing resources is wasted linearly.

To remedy this, we decided to architect our distributed **API Gateway** as a colossal "Authentication Vanguard."

---

## 2. The World Behind the Gateway: Trust Only Headers

The architectural design was crisp and powerful. Every incoming client request must first traverse the Gateway, the frontline of authentication.
1. Inside the Gateway, the `JwtAuthenticationWebFilter` decrypts the client's JWT and verifies its RSA signature.
2. If validated, it extracts the user ID and roles from the payload, immediately injecting them into the HTTP Request Headers directly as `X-User-Id` and `X-User-Role`.
3. The request is then natively routed to the downstream microservices (`main`).

The lethal charm of this architecture is that **we can completely obliterate Spring Security and JWT parsing logic from the business server (`main`).** The `main` service controllers don't need to know what a token is; they blindly extract the `X-User-Id` header and focus 100% of their operational might on core business logic.

---

## 3. The Chilling Code Review: X-User-Id Header Spoofing

However, a singular, catastrophic flaw discovered during a rigorous code review sent chills down the entire team's spine.

**What happens if a malicious hacker intentionally omits the JWT token entirely, and manually injects fabricated HTTP headers (`X-User-Id: 1`) into the request sent to the Gateway?**

In our preliminary implementation, if an unauthenticated request (or one with an expired token) flowed into an unrestricted endpoint (Permit All) or slipped through exception handlers, the Gateway would unknowingly pass the client's hand-crafted `X-User-Id` header straight downstream to the `main` server.
In blind adherence to our architectural rule, the downstream server assumes: "There is an `X-User-Id` header, so this must be the fully verified User #1." Essentially, an attacker could achieve complete account takeover (Spoofing) with a single manipulated line in their HTTP header request—a colossal logical vulnerability.

### The Critical Defense: Pre-emptive Header Removal
The solution required establishing an ironclad, overriding rule at the absolute entry threshold of the Gateway's authentication filter.

**"Regardless of what headers the client transmits, the Gateway's perimeter actively and unconditionally deletes (Removes) sensitive headers (`X-User-Id`, `X-User-Role`)."**

Only upon strict verification—"when internal JWT signature validation achieves 100% cryptographic trust within the confines of the Gateway"—will the mechanism programmatically re-inject the verified values into those specific headers. Because of this, any forged header introduced externally instantly evaporates before touching the business layer, immaculately neutralizing this vicious spoofing threat.

---

## 4. Epilogue: Beyond Just Writing Code

These were challenges that simply do not arise in typical toy monoliths.
Reshaping the UX from scratch to fundamentally alter user pathways (Part 1); founding a multi-module architecture to uphold that design by endlessly debating the encapsulated philosophies of dependencies (Part 2); and finally, gracefully defending surging spikes of macro-bot traffic and hacking incursions at the Gateway edge (Part 3).

This demanding journey during **kt cloud TECH UP** has been an immensely invaluable marathon for me, expanding my development perspective far beyond "making features work," directly into the relentless, dynamic realm of "stable system engineering and resilient architecture." The project is still ongoing, and I look forward to sharing further architectural improvements in the future.
