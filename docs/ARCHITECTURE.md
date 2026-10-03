# Architecture

## System

```text
Google Sheets (content source)
        ↓
Content normalization / lesson data
        ↓
Next.js Lesson Engine
   ├─ HTML/CSS/SVG activities
   ├─ Three.js activities
   ├─ Audio
   ├─ Quiz
   └─ Reward
        ↓
Progress / analytics (later phase)
```

Google Drive is the master asset repository, not the runtime CDN.

## Frontend boundaries

### Server Components
Use by default for route/layout composition and static content.

### Client Components
Use only where browser state or APIs are needed:
- lesson interaction
- Speech Synthesis
- Three.js/WebGL
- local progress UI

## Activity components

Planned reusable activities:

- TapToHear
- ListenAndChoose
- DragAndMatch
- TraceLetter
- PictureHunt
- CountAndPop
- ThreeDExplore
- Quiz
- Reward

## Three.js policy

Use 3D for lessons where spatial exploration improves understanding, such as:
- Colors on objects
- Shapes
- Counting objects
- Body parts
- Animals/objects exploration

Do not use Three.js for text-heavy phonics, reading, simple multiple choice or tracing where DOM/SVG is lighter and more accessible.

## Future data model

```text
Student
  → LessonProgress
      → ActivityAttempt
      → QuizAttempt
      → Reward
```

MVP may keep progress client-side. Authentication and shared progress storage are a later phase.
