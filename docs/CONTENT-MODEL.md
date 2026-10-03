# Content Model

The application should not hard-code 20 independent lesson pages. Each lesson is data rendered by the same lesson engine.

## Lesson

| Field | Purpose |
| --- | --- |
| id | Stable lesson ID such as L08 |
| unit | Child-facing unit name |
| title | Lesson title |
| goal | Thai learning objective |
| sentence | Core sentence pattern |
| scene | Interaction/visual scene type |
| words | Vocabulary items |
| challenge | Child-facing mini challenge |

## Vocabulary item

| Field | Purpose |
| --- | --- |
| word | English word |
| thai | Thai meaning |
| audio | Approved audio URL/path (future) |
| image | Approved image URL/path (future) |
| model | GLB URL/path where 3D is needed (future) |

## Future lesson blocks

A full lesson may become an ordered list of blocks:

```json
[
  { "type": "intro" },
  { "type": "tap-to-hear" },
  { "type": "three-d-explore" },
  { "type": "listen-and-choose" },
  { "type": "quiz" },
  { "type": "reward" }
]
```

This lets the same renderer support P.1 English now and additional grades/subjects later.
