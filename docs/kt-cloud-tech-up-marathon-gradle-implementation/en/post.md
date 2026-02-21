---
id: 7
title: '[kt cloud TECH UP] Perfect Module Isolation: Gradle api vs implementation'
description: 'Exploring why our team opted for "implementation" over "api" in a Spring Boot multi-module environment to fortify encapsulation and establish strict build boundaries.'
categories: ['Architecture', 'Project']
tags: ['Spring Boot', 'Gradle', 'MSA', 'kt cloud TECH UP', 'Multi-module']
date: '2026-02-06T14:30:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

This post is an ongoing record detailing the rigorous marathon ticketing platform build during the **kt cloud TECH UP** intensive project.)

---

## 1. Dilemmas Arising Between Separated Modules

In Part 1, we successfully shattered a massive monolithic `main` service into distinct `common`, `auth`, and `main` modules. However, although the code was physically partitioned, a huge hurdle of managing dependencies awaited our team.

During this phase, the fiercest debate within our backend team revolved around the build tool (Gradle) environment: **should we define external dependencies using `api` or `implementation`?**

---

## 2. Transitive Dependencies: The Sweet Temptation of `api`

The `common` module inherently serves as the bedrock that virtually every other module references. Naturally, it internally requires a host of libraries—such as those for JWT processing (`jjwt`) or Spring Security data structures.

If dependencies are declared using the `api` keyword inside `common`'s `build.gradle`, an extremely convenient benefit surfaces.
Any higher-level module depending on `common` (like `main` or `auth`) instantly gains transparent access to those libraries without having to declare them again. The dependency effectively "leaks" upwards (transitive propagation).

*   **Pros:** `build.gradle` files remain incredibly concise, drastically reducing redundant library declarations.

---

## 3. Why Did Our Team Mandate the Unforgiving `implementation`?

Despite convenience, our team's conclusion was definitive. Anchored by the architectural tenet that **"you must be able to intuitively spot which module uses which library at a glance,"** we established compiling strictly with `implementation` as our mandate. This boils down to two critical reasons.

### 3.1. Preventing Rising Module Coupling
`api` brings unintended 'side effects'.
Libraries added by a `common` module developer solely for immediate internal use can unintentionally cascade to dozens of higher-level modules. Someday, attempting to remove or alter versions of that library down at the `common` level will aggressively collide with unexpected errors across the application suite. This deeply contradicted the exact purpose of our MSA transition: snapping coupling lines.

### 3.2. Preserving the Principle of Encapsulation
The most fundamental reason was the breakdown of encapsulation. The `implementation` keyword acts as a philosophical declaration: **"This library will solely be utilized for internal mechanisms within this module, and its existence will be hidden from consumer modules above."**
The `main` module only needs to interface with the well-packaged public methods exposing the business logic from `common`. It does not need to know—nor should it be allowed to use—the underlying JWT library `common` happened to use.

---

## 4. Safety Found in Strict Dependency Boundaries

Even if it meant engineers across different modules had to endure the slight annoyance of redundantly echoing `dependencies` declarations, we adamantly shielded our **encapsulation**.

As a result, our business domain (`main`) secured a robust, insulated defensive wall; even if the total authentication implementation mechanism changes tomorrow, `main`’s build dependencies remain unscathed. This crystal-clear dependency demarcation would eventually supply the rapid momentum necessary when we decided to drastically shift all authentication burdens externally using an **API Gateway**.

➡️ ***(To be continued in the next post)***
