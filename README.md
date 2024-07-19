# 문서 작성법

```text
└── docs
    └── [slug]
        ├── [language]
        │   └── article.md
        └── metadata.ts
```

---

### [slug]

- 문서를 나타내는 [slug] 는 Kebab case 를 사용해요. (example : my-first-article)
- 문서는 여러개 있을 수 있어요.
- 문서에는 [language] 폴더와 metadata.ts 파일이 있어요.

---

### [language]

- 문서의 언어를 나타내는 [language] 는 국가별 언어 코드를 사용해요. (example : ko)
- 언어는 여러개 있을 수 있어요.
- 언어에는 article.md 파일이 있어요.

---

### metadata.ts

- 문서에서 모든 언어를 통틀어 관리하는 데이터를 의미해요.
- `lib/article-manager.ts` 에서 Metadata를 확인할 수 있어요.
- 현재 Metadata Interface 와, metadata.ts 는 아래와 같아요.

```ts
type Category = 'hobby' | 'study' | 'work';

interface Metadata {
  date: Date;
  category: Category;
}
```

```ts
import { Metadata } from '@/lib/article-manager';

export const metadata: Metadata = {
  date: new Date('2024-07-19T01:51:44.224Z'),
  category: 'hobby',
};
```

---

### article.md

- 문서 내용이 포함된 파일을 의미해요.
- 최상단에는 해당 언어 문서의 Metadata 가 포함되어 있어요.
- 예시 내부 구조는 아래와 같아요.

```md
---
title: 'example title'
description: 'example description'
keywords: ['example', '...']
---

content
```

---
