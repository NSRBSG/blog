---
id: 10
title: '[kt cloud TECH UP] Zero Load Media Handling: S3 Presigned URLs & State Management'
description: 'Sharing architectural insights on utilizing AWS S3 Presigned URLs for direct client uploads to eliminate backend bottlenecks, alongside robust state management for garbage collection.'
categories: ['Performance', 'Architecture', 'Project']
tags: ['AWS S3', 'Presigned URL', 'Spring Boot', 'kt cloud TECH UP', 'Performance']
date: '2026-02-21T10:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

This post chronicles the continuous evolution of our marathon ticketing platform developed during the **kt cloud TECH UP** intensive project. (Previous post: [Controlling the Influx: API Gateway Waiting Room and Redis Rate Limiting](../kt-cloud-tech-up-marathon-rate-limiting))

---

## 1. The Multipart/form-data Trap: Backend Suffocation

After successfully establishing the core ticketing system, we moved on to develop the "My Page" and Community features, where marathon runners upload their profile pictures or "Finisher certification shots."

Initially, we implemented the most classical approach: `Multipart/form-data`.
The client browser hurls an image file at the backend (Spring), the backend loads that hefty byte stream into its memory, and then arduously relays it across the network to an AWS S3 bucket.

However, this methodology is the absolute antithesis of a **high-load text-transactional ticketing system**.
If the server attempts to relay 1,000 concurrent 10MB image uploads, explosive network bandwidth (I/O) and memory consumption obliterates resources. Consequently, the crucial ticketing payment threads end up blocked by saturated file upload threads, triggering catastrophic response delays.

---

## 2. Bypassing the Bottleneck: Enter S3 Presigned URLs

We needed to drastically strip the backend of the heavy responsibility of "File I/O relaying" to prioritize pure business logic execution. We achieved this by transitioning to an **S3 Presigned URL** architecture.

### The Revamped Workflow
1.  **Client:** Sends a lightweight JSON request to the backend saying, "I intend to upload an image."
2.  **Backend:** Uses the AWS SDK to command S3: "Generate a temporary authorized ticket (Presigned URL) that permits a direct file upload to this specific Object Key for the next 5 minutes." It then returns only this concise URL string to the client.
3.  **Client:** Bypasses the backend entirely, using the browser to fling the heavy image binary directly at the AWS S3 URL via a fiery `PUT` request.

**The results were dramatic.** The backend server was entirely liberated from I/O bottlenecks. It touched exactly 0 bytes of the heavy image payloads, simply acting as a lightweight ticket vendor issuing URLs.

---

## 3. Unearthing a New Problem: Cloud Ecosystem Garbage (Orphaned Objects)

While performance skyrocketed, this elegant architecture harbored a virulent side effect.

Clients are notoriously fickle. They might request and receive 10 Presigned URLs from the backend (readying S3 to receive files), only to abruptly click "Cancel" or close the browser tab.
Conversely, what if the browser successfully blasts the image into S3, but fails to fire the final, crucial API call to the backend saying, "Upload complete, please save this post"?

**The S3 Bucket begins accumulating "Zombie Images (Orphaned Objects)" that belong to no actual post. This uncontrollable buildup rapidly transforms into massive, unnecessary storage billing bombs.**

---

## 4. Engineering the Media State Management Table

To enforce totalitarian authority over the file lifecycle, we integrated a Dedicated State Management table (`media`) within our RDBMS.

1.  When the backend issues a Presigned URL, it simultaneously records the file's metadata in the DB `media` table, explicitly flagging its status as `PENDING`.
2.  Only when the client successfully uploads to S3 AND finalizes the post creation request does the backend flip the media state to `CONFIRMED`.
3.  **The Scheduled Garbage Collector:** We registered a Spring Scheduled Batch job. Every midnight, it ruthlessly hunts down any "Zombie Media records" that have lingered in the `PENDING` state for more than 24 hours. The batch script actively fires AWS SDK `DeleteObjects` commands to nuke the physical files from S3, before executing an SQL delete to wipe the local DB records.

Through this **[State Management + Asynchronous Garbage Collector]** paradigm, the system effortlessly offloads monstrous file upload traffic to the external cloud (S3), while surgically neutralizing the financial risk of a bucket polluted with abandoned garbage data.

The project troubleshooting saga continues. In the next post, I will explore how we thawed the communication ice age between frontend and backend teams by globally refactoring Exceptions and ErrorCodes.
