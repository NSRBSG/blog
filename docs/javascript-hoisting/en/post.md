---
id: 2
title: 'Hoisting in JavaScript'
description: 'In JavaScript, it is said that variables and functions are hoisted. But is that really the case? I wanted to check the differences between var, let, and const with actual code.'
categories: ['study']
tags: ['JavaScript', 'Hoisting']
date: '2025-09-29T05:40:13.586Z'
thumbnailUrl: /images/modern-JS-deep-dive.jpg
---

### 1. What is Variable Hoisting?

- **Hoisting** refers to JavaScript’s behavior where variable and function declarations seem to be moved to the top of their scope.
- In reality, the code is not physically moved. Instead, during the creation of the **execution context**, the JavaScript engine registers declarations in advance, which creates this effect.

---

### 2. Hoisting with `var`

```javascript
var x = 1;

function test() {
  console.log(x); // undefined

  var x = 2;
}

test();
```

Result: `undefined`

- Inside the function, `var x` creates a new local variable separate from the global `x`
- Before execution, the JavaScript engine performs **declaration + initialization (to undefined)**.
- Therefore, at the point of `console.log(x)`, the variable exists but has no value, so it prints `undefined`.

---

### 3. Hoisting with `let` / `const`

```javascript
var x = 1;

function test() {
  console.log(x); // ReferenceError

  let x = 2;
}

test();
```

Result: `ReferenceError`

- Both `let` and `const` are also **hoisted**.
- However, unlike `var`, they are **not initialized** automatically.
- Until they are initialized at runtime, they are in the **TDZ (Temporal Dead Zone)**.
- Accessing them before initialization results in a **ReferenceError**.

---

### 4. Differences in Hoisting Behavior

| Keyword | Declaration | Initialization | TDZ | Access before declaration |
| ------- | ----------- | -------------- | --- | ------------------------- |
| var     | ⭕          | ⭕(undefined)  | ❌  | undefined                 |
| let     | ⭕          | ❌             | ⭕  | ReferenceError            |
| const   | ⭕          | ❌             | ⭕  | ReferenceError            |

---

### 5. Conclusion

- `var`: **Declaration + initialization (undefined)** → masks global variables, results in `undefined`.
- `let / const`: **Declaration is hoisted, but initialization happens at runtime**. → During the TDZ, they cannot be accessed and throw a `ReferenceError`.

> 👉 In short: **All three keywords are hoisted.** The difference lies in **when initialization happens**.
