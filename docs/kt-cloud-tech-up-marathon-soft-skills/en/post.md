---
id: 16
title: '[kt cloud TECH UP] Anti-Ping-Pong in a 17-Person Team: Smashing Silos with DSU'
description: 'Reflections on the vital soft skills required to manage a massive 17-person team across Design, PM, FE, BE, Infra, and AI. Breaking silos using Daily Stand-Ups and visual documentation.'
categories: ['Project', 'Collaboration', 'Mentoring']
tags: ['Soft Skills', 'Communication', 'Agile', 'DSU', 'kt cloud TECH UP']
date: '2026-02-19T14:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

This marks the 5th and final installment of our extensive **kt cloud TECH UP** mentoring retrospective series. After dissecting the hard skills of architecture, infrastructure scheduling, and AI algorithms, today we pivot to a challenge that proved far more perilous than any technical bug: **Human Soft Skills and Communication.**)

---

## 1. Drowning in the Silo Effect

Our project operated with a mammoth-sized team of 17 members scattered across vastly different disciplines: Planning (PM), Design, Frontend, Backend, Infrastructure, and AI. Because of the sheer size, members naturally entrenched themselves deeply within their own specialized domains.

Suddenly, glaring alarms began flashing across the project landscape:
*   **Backend:** "When is the Infra team provisioning the EKS cluster? We have no CI/CD pipeline so we can't test."
*   **Frontend:** "Where is the Backend API specification? The JSON field names don't match the PRD (Product Requirements Document)."
*   **AI Division:** "We're building the bot detection model, but how precisely is the Backend API planning to invoke it?"

17 individuals had trapped themselves on isolated islands (Silos). No one understood the jargon used by other departments, nor did anyone know the overall completion percentage. We had devolved into a massive **communication black box**, blindly throwing questions into the void. A single weekly all-hands meeting was entirely insufficient to manage the cascading sync issues.

---

## 2. The Mentor's Antidote: Daily Stand-Ups (DSU)

When we confessed this paralyzing communication breakdown to our mentor, the immediate prescription was implementing a core Agile methodology: the **Daily Stand-Up (DSU)**.

>**Mentor (kt cloud):**
>"When you rely on 17 people syncing up only once a week, you've already failed. Establish a strict daily kick-off time. Within the first 30 minutes, force everyone to post three things on Discord or Slack: **1) What I did yesterday, 2) What I am doing today, and crucially 3) Any Blockers obstructing me.** Even if it's not your direct task, forcing everyone to acknowledge where the bottlenecks reside across the entire team is the absolute linchpin of project success."

We instantly created a dedicated `#dsu` channel and systematically began filing daily micro-reports.
This resulted in a significant improvement in communication within days. 
Instead of waiting a week, the team naturally gained a collective context: *"Ah, Seojin from Infra is currently blocked by AWS IAM permissions. As Backend engineers, we should pivot to local Docker testing for the next few days."*

---

## 3. Stop Writing, Start Drawing (Low-fi Prototypes)

The secondary crisis was the **"Imagination Gap"** between Planners (PMs) and Frontend Developers. Despite the existence of a meticulously detailed text-based PRD, developers rarely read sprawling documents word-for-word. Predictably, PMs would look at the developed screens and repeatedly exclaim, "Wait, this isn't what I wrote!"

The mentor advised us to ditch the text essays and heavily embrace **Visualization**.

*   **PM to Frontend Sync:** We moved to Figma to draft exceedingly barebones **Low-fi Wireframes**. We attached tiny 'post-it' notes next to the drawn buttons explaining the functionality. An ugly drawing of a screen obliterated miscommunications that hundreds of lines of text couldn't resolve.
*   **Infra to Backend Sync:** The PM mandated that the labyrinthine MSA architecture (Ingress, API Gateways, Microservices) be rendered into clean **Architectural Diagrams** and blasted out to all 17 members. Visually tracing the flow of "The client enters here and hits this node" unified the entire team's mental model instantly.

---

## 4. Why 'Soft Skills' Define 'Seniority' in Backend

Concluding this integrated project, I recognized an important point: **Communication (Soft Skill) is arguably more critical than raw Coding Prowess (Hard Skill).**

It doesn't matter if you engineer the most algorithmically efficient Java code on the planet. If the Frontend developer finds your API hostile to consume, if the Infra engineer struggles to deploy your convoluted build artifact, and if your output fundamentally deviates from the PM's intention—that code is effectively dead.

**"The willingness to listen to the dialects of other disciplines (Design, Infra, PM) and proactively initiate synchronization."** 
That attitude was the true driving force that prevented our bloated 17-person ship from sinking and ultimately pushed the Marathon Ticketing Platform over the finish line.

*(Series End)*
