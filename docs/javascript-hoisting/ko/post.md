---
id: 2
title: 'JavaScript에서의 Hoisting'
description: '자바스크립트에서는 변수와 함수 선언이 호이스팅된다고 알고 있었는데, 실제로도 그럴까? var와 let, const의 차이를 실제 코드로 확인해 보고 싶었다.'
categories: ['study']
tags: ['JavaScript', 'Hoisting']
date: '2025-09-29T05:40:13.586Z'
thumbnailUrl: /images/modern-JS-deep-dive.jpg
---

### 1. 변수 호이스팅이란?

- **호이스팅(hoisting)** 이란, 변수나 함수 선언이 마치 코드의 선두로 끌어 올려진 것처럼 동작하는 자바스크립트의 특징을 말함
- 실제로 코드가 옮겨지는 것은 아니며, 자바스크립트 **엔진이 실행 컨텍스트를 생성하는 과정에서 선언을 미리 등록**하기 때문에 발생하는 현상

---

### 2. `var` 키워드의 호이스팅

```javascript
var x = 1;

function test() {
  console.log(x); // undefined

  var x = 2;
}

test();
```

실행 결과: `undefined`

- 함수 내부에서 `var x`가 새로 선언되며, 전역 변수 `x`와는 별개로 **로컬 스코프의 x**가 생성됨
- 자바스크립트 엔진은 실행 전, 변수를 **선언 + 초기화(undefined)** 단계까지 끌어올림
- 따라서 `console.log(x)` 시점에는 값이 없으므로 `undefined` 출력

---

### 3. `let` / `const` 키워드의 호이스팅

```javascript
var x = 1;

function test() {
  console.log(x); // ReferenceError

  let x = 2;
}

test();
```

실행 결과: `ReferenceError`

- `let`과 `const`도 **호이스팅은 된다**
- 하지만 `var`와 달리 **초기화는 이루어지지 않음**
- 실제 초기화가 실행되기 전까지는 **TDZ(Temporal Dead Zone, 일시적 사각지대)** 에 들어감
- 따라서 선언 이전에 접근하려 하면 **ReferenceError** 발생

---

### 4. 호이스팅 동작 차이

| 키워드 | 선언 | 초기화        | TDZ 여부 | 선언 이전 접근 시 |
| ------ | ---- | ------------- | -------- | ----------------- |
| var    | ⭕   | ⭕(undefined) | ❌       | undefined         |
| let    | ⭕   | ❌            | ⭕       | ReferenceError    |
| const  | ⭕   | ❌            | ⭕       | ReferenceError    |

---

### 5. 결론

- `var` : **선언 + 초기화(undefined)** → 전역 변수를 가려버려 `undefined` 출력
- `let / const` : **선언만 호이스팅, 초기화는 실행 시점에서 수행**
  → TDZ 구간에서는 접근 불가, `ReferenceError`

> 👉 결국 **세 키워드 모두 호이스팅은 된다.** 차이는 **초기화 시점**에 있다.
