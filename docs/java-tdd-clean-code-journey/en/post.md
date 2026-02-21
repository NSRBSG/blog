---
id: 5
title: 'Java Clean Code and TDD Retrospective: The StringCalculator Refactoring Journey'
description: 'A retrospective on exploring TDD methodologies (Classicist vs. London school), managing JUnit shared resources, and understanding Java’s double escape mechanism while building a simple String Calculator for the Woowahan Tech Course.'
categories: ['Java', 'TDD']
tags: ['Java', 'TDD', 'Clean Code', 'JUnit', 'Refactoring', 'Woowahan Tech Course']
date: '2026-02-17T18:30:00.000Z'
thumbnailUrl: '/images/java_tdd_thumbnail.png'
---

## 1. Woowahan Tech Course and Establishing Rules

This String Calculator was developed as a mission for the Woowahan Tech Course (Wooteco). Going beyond mere functional implementation, I began by establishing conventions considering team collaboration (or my future self).

- **Test Method Naming**: After debating readability, I decided to unify test method names using camelCase to maintain **consistency with Java standards**.
- **Commit Messages**: For tool compatibility, commit types and scopes were kept in English, but considering the main communicators are Korean, titles and bodies were constructed in Korean. (e.g., `feat(calculator): 쉼표 구분자 덧셈 기능 추가`)
- **Requirements Definition**: I explicitly defined the scope of 'numbers' to integers. Decimal processing was ruled out for the current scope, treated as a potential future expanded feature.

---

## 2. Deep Reflections on TDD and Design

The greatest takeaway from this project was realizing the profound relationship between design and testing.

### Reaching the Limits of Classicist TDD and the Need for the London School
Initially, I approached it with the **'Classicist TDD'** style, testing only the public API, `StringCalculator`. While this method offered the advantage of highly flexible internal implementation, it showed clear limitations: I was only indirectly verifying the behavior of internal components like the `Parser` and `Numbers`.
This experience sparked deep contemplation on the merits and necessities of the **'London School of TDD'**, which stresses isolating each class and writing granular unit tests using Mock objects.

### Structural Changes for Testability
While designing, I experienced the process of redistributing object responsibilities specifically for the sake of testability.
In the initial design, the `Parser` directly instantiated and returned a `Numbers` object. However, I discovered this tightly coupled the `Parser`'s tests to the implementation of the `Numbers` class.

To resolve this and increase test independence, I altered the design.
I reduced the `Parser`'s responsibility to purely returning an array of parsed strings (`String[]`), and shifted the responsibility of object instantiation upwards to the `StringCalculator`. Through this, I experienced the core principle of clean code: **"Initial design is never absolute; it must be constantly refactored through the feedback discovered between testing and implementation."**

---

## 3. Learning the Java Language and Runtime Environment

Aside from TDD, I gained deeply rooted knowledge regarding how the Java language operates inherently.

### Rethinking Collection Conversions
The result of `String.split()` is a fixed-size Java array (`String[]`). I realized that unless further addition or deletion of parsed data is required, using the array structure as-is is much more concise in terms of memory and code readability, rather than unnecessarily wrapping it into a `List`.

### The Compiler and Regex 'Double Escape'
I encountered a conflict between the escape character (`\`) for the regex engine and the escape character designed for the Java compiler. For example, to match only numbers using `\d` within a Java string, the principle of 'double escaping' mandates writing it as `\\d` so it survives the compiler phase.
In a parallel context, I clearly understood why `\n` written inside source code parses differently from `\n` input via standard console input—it all boils down to whether the Java compiler's interpretation phase is involved.

### JUnit Environment and the Lifecycle of Shared (Static) Resources
The most frustrating troubleshooting involved **static shared resources** like `Scanner`.
Unlike general application runtime environments where the operating system (OS) cleans up all resources upon process termination, in JUnit, where multiple tests execute sequentially within a single JVM process, `static` resources persist across tests.
Consequently, I realized the vital importance of explicitly calling `close()` following each test (or via `@AfterEach`) to clean up resources; failing to do so results in fatal Test Pollution.

---

## Conclusion

Although it seemed like a tiny mission to implement a simple calculator, I was able to learn densely about TDD methodologies, identifying objects and assigning responsibility, and even Java compiler behavior and JVM characteristics. Moving forward, I intend to weave even more solid and flexible code built upon the foundation of these lessons.
