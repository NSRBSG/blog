# 문서 작성법

```text
└── docs
    └── [slug]
        └── [language]
            └── article.md
```

---

### [slug]

- 문서를 나타내는 `[slug]` 는 `Kebab case` 를 사용해요. (example : `my-first-post`)
- 문서는 여러개 있을 수 있어요.
- 문서에는 `[language]` 폴더가 있어요.

---

### [language]

- 문서의 언어를 나타내는 `[language]` 는 국가별 언어 코드를 사용해요. (example : `ko`)
- 언어는 여러개 있을 수 있어요.
- 언어에는 `post.md` 파일이 있어요.

---

### post.md

- 문서 내용이 포함된 파일을 의미해요.
- 최상단에는 해당 언어 문서의 `Metadata` 가 포함되어 있어요.
- 예시 내부 구조는 아래와 같아요.

```md
---
id: 1
title: 'example title'
description: 'example description'
categories: ['category1', 'category2']
tags: ['tag1', 'tag2']
date: '2025-09-29T05:40:13.586Z'
thumbnailUrl: '/images/example.jpg'
---

> markdown
```

---

### thumnailUrl

- `post.md` 파일 안에 `thumbnailUrl` 이미지 파일은 꼭 `public/images/` 폴더에 위치 되어야 해요.
