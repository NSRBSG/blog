---
id: 11
title: '[kt cloud TECH UP] Backend Fundamentals for Collaboration: Global Exception Refactoring'
description: 'How implementing a Global Exception Handler and an ErrorCode Enum drastically reduced communication overhead between frontend and backend teams.'
categories: ['Architecture', 'Refactoring', 'Project']
tags: ['Spring Boot', 'Exception Handling', 'Refactoring', 'kt cloud TECH UP', 'Collaboration']
date: '2026-02-21T11:00:00.000Z'
thumbnailUrl: '/images/tech-up-image.png'
---

This post is a continuation of the intense marathon ticketing platform development journey during the **kt cloud TECH UP** project. (Previous post: [Zero Load Media Handling: S3 Presigned URLs & State Management](../kt-cloud-tech-up-marathon-s3-presigned))

---

## 1. The Frontend's Cry: "Why is this error happening?"

In the early stages of our project, backend developers handled exceptions individually within their respective modules (Auth, Event, User) according to their own coding styles. Someone might nonchalantly throw an `IllegalArgumentException`, while another would manually pack a `ResponseEntity` with a raw String message. The HTTP Status Codes unpredictably oscillated between `400 Bad Request` and general `500 Internal Server Errors`.

The result was disastrous. The Frontend team found it completely impossible to write scalable, global error-handling logic because the API response formats were horribly chaotic on every failure.
*"Is this 400 error because the token expired, or because the input validation failed?"*
Questions like this flooded our Slack channels daily, generating a **catastrophic spike in communication overhead.**

---

## 2. Designing a Predictable Contract: The ErrorCode Enum

The absolute first necessity was to forge an ironclad "Error Contract" between the frontend and backend. We introduced the **`ErrorCode` Enum** architectural structure, assigning strictly unique, custom identifiers to every conceivable domain and scenario error.

```java
// Example: Concretely defined ErrorCode Enum
public enum ErrorCode {
    // Auth Domain
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH_001", "The token has expired."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH_002", "Invalid cryptographic token."),

    // Event (Marathon) Domain
    EVENT_NOT_FOUND(HttpStatus.NOT_FOUND, "EVT_001", "The requested event could not be found."),
    TICKET_SOLD_OUT(HttpStatus.CONFLICT, "EVT_002", "Tickets are completely sold out.");

    private final HttpStatus status;
    private final String code;
    private final String message;
    // ... Constructors and Getters
}
```

Now, the frontend no longer needs to resort to the dangerous practice of blindly parsing changing String texts from a `message` field. By simply verifying the highly specific `code` field (e.g., `EVT_002`) arriving in the standardized response body, the frontend UI can instantly and reliably trigger a "Tickets are completely sold out!" modal to the user.

---

## 3. The Centralized Control Tower: Global Exception Handler

With the error dictionary compiled, the next phase was a massive sweep to eradicate the haphazard `try-catch` blocks and reckless `throw new RuntimeException()` scattered across the entire repository. We utilized Spring's `@RestControllerAdvice` to construct a robust **Global Exception Handler**.

Business logic methods are now totally relieved of the burden of formatting API error responses.

```java
// Business logic remains blissfully pure and focused
if (event.isSoldOut()) {
    throw new CustomException(ErrorCode.TICKET_SOLD_OUT);
}
```

When this `CustomException` leaps out of the business layer, the apical `@RestControllerAdvice` elegantly catches it in mid-air. It automatically extracts the inner `ErrorCode` and meticulously packages it into our pre-agreed, unified JSON format (e.g., `{ "code": "EVT_002", "message": "Tickets are completely sold out." }`), returning a beautifully standardized HTTP response to the client browser.

---

## 4. Refactoring: The Quintessence of Backend Duty

This massive refactoring effort (`refactor(backend): improve errorcode and exception handling`) may not sound as dazzling or glamorous on a resume as our architectural transitions like MSA, API Gateway, or Redis Rate Limiting.

However, one of the most fundamental virtues of a backend engineer is **"building a rock-solid, predictable API ecosystem that collaborating frontend developers (and client applications) can consume with absolute peace of mind."** This global exception refactoring exponentially accelerated the productivity of the entire team, making it arguably the most successful internal infrastructure stabilization of this entire project.
