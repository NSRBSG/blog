---
id: 15
title: '[kt cloud TECH UP] Next.js vs Spring Boot: Who Holds the Burden of Auth?'
description: 'A fierce architectural debate between Frontend and Backend regarding authentication. Balancing Next-Auth centralization against Client-Direct API routing for high-traffic ticketing.'
categories: ['Architecture', 'Security', 'Project']
tags: ['Next.js', 'Spring Boot', 'Authentication', 'Next-Auth', 'kt cloud TECH UP']
date: '2026-02-12T09:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

Welcome to Part 4 of the **kt cloud TECH UP** mentoring retrospective series. In this post, we dive into the most heated architectural debate between our Backend and Frontend developers: **"Ultimately, who leads and manages the Authentication lifecycle, and how?"**)

---

## 1. The Frontend's Arsenal: Next.js and Next-Auth

In modern web development, the Frontend is no longer merely "painting the screen." It operates as a fully-fledged server (Next.js) executing powerful Server Side Rendering (SSR). 
Naturally, our Frontend team proposed utilizing **Next-Auth**, a formidable library designed to elegantly centralize session and JWT (JSON Web Token) management within the Next.js ecosystem.

**The Initial Proposal (Next-Auth Centric Design):**
1. User attempts login. The Next.js Server communicates with the Backend (Spring) to obtain Access/Refresh Tokens.
2. Next-Auth encrypts these tokens and securely bakes them into the browser's HttpOnly Cookies.
3. The browser reliably maintains the logged-in state by communicating exclusively with the Next.js server via these strictly managed cookies.

From a Frontend perspective, this architecture was secure and structurally flawless. However, colliding with the **massive traffic** requirements of a marathon ticketing platform, the Backend Team raised a razor-sharp counter-argument.

---

## 2. The Backend's Rebuttal: "Traffic Bottlenecks and SSR Limitations"

The Backend tier highlighted two fatal flaws residing within this Next-Auth centric design paradigm.

### Flaw 1. The Next.js Server Traffic Bottleneck
When ticketing opens and 15,000 frantic API requests bombard the system, what happens if the data flow is strictly **Client Browser -> Next.js Server -> Backend API Gateway**?
Our Next.js Server's Node.js threads—already burdened with generating complex SSR HTML views—would face catastrophic bottleneck risks (or complete meltdown) trying to relentlessly proxy/relay tens of thousands of heavy transactional API payloads. 
The Backend countered: "Only the initial login handshake should involve the Next.js Server. For the tens of thousands of heavy ticketing requests, traffic must completely bypass the frontend node and fire **directly from the Browser to the Backend API Gateway** to distribute load."

### Flaw 2. Server-to-Server (S2S) Auth in SSR Environments
If the browser fires APIs directly at the backend, we can simply rely on the browser to automatically attach the authentication cookies (`withCredentials`).
However, what happens when Next.js attempts its core capability: **Server Components (SSR)**? To pre-render a screen, the Next.js Server must fetch data from the Spring Boot Backend. Since this is Server-to-Server (S2S) communication, there is no browser intermediary to automagically attach cookies. 
This meant the Next.js Server would have to manually rummage through its cookie store, extract the token, and painfully inject it into the HTTP headers for every single SSR fetch—an architecture prone to omissions and complexity.

---

## 3. The Mentor’s Mediation: Breaking the Dilemma

The industry mentor accurately weighed the Frontend's desire for session management convenience (Next-Auth) against the Backend's necessity for traffic decoupling, ultimately providing a definitive architectural compromise.

1.  **Confirming the Direct Routing Architecture:** Validating the Backend's concern, for ultra-high-stress logic like ticketing, requests must **bypass the Next.js Server entirely**. The Browser communicating directly with the Backend Gateway is the industry standard for extreme high-volume traffic processing.
2.  **Evaluating Next-Auth in a Decoupled World:** 
    *   If managing browser sessions and tokens securely within the Next.js environment is causing friction, deploying Next-Auth provides undeniable cryptographic convenience.
    *   However, the S2S authentication issue during SSR fetching (where `withCredentials` fails) is an unavoidable reality. The mentor advised that the Frontend team must engineer a robust module (like a global Interceptor) tasked explicitly with intercepting S2S requests, extracting the cookie, and injecting the JWT header manually before it hits the backend.

---

## 4. There Are No Perfect Architectures, Only Trade-offs

Ultimately, we reached a unified architectural accord: **"We will leverage Next-Auth for robust, convenient session management. In exchange, the Frontend accepts the engineering burden of manually injecting tokens during SSR fetching. Simultaneously, we guarantee that all critical ticketing APIs will fire via direct Browser ↔ Backend communication, structurally obliterating the risk of a Frontend proxy bottleneck."**

Through this intense technical debate and mentoring, we internalized an engineering truth. Between Security (Auth), Performance (Traffic), and Developer Convenience (Next.js), there is no single architecture that perfectly satisfies all conditions without trade-offs. True system engineering lies in selecting the most rational **'Trade-offs'** aligned with the business objective, and meticulously writing code to patch the inherent disadvantages of that choice.

In the final post of our series, we step away from code to discuss the ultimate catalyst preventing project failure: **How we drastically reduced communication costs across a massive 17-person team utilizing DSU (Daily Stand-Up).**
