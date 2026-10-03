# Workflow

## Source of truth

**Google Sheets**
- Curriculum
- Vocabulary
- Interactive Activities
- Quiz Bank
- Production Tracker

**Google Drive**
- Master illustrations
- Master audio
- 3D source/GLB files
- Review exports

**GitHub**
- Web application
- Lesson schemas/data
- Documentation
- QA rules

## Production pipeline

`Curriculum → Lesson Spec → Assets → Lesson Data → Interaction → Quiz → QA → Publish`

### 1. Curriculum
Define objective, vocabulary, sentence pattern, phonics, activities and quiz.

### 2. Lesson specification
Every lesson follows:

`Intro → Learn → Listen → Practice → Game → Quiz → Reward`

### 3. Asset production
Naming examples:

- `L08_color_red_01.png`
- `L08_red.mp3`
- `L08_ball.glb`

### 4. Asset review
Masters stay in Drive. Only approved web-ready assets are published to the application/CDN.

### 5. Lesson implementation
Lesson content is data-driven and rendered by reusable activity components.

### 6. QA
Run in this order:

1. Content QA
2. UX/UI QA
3. Interaction QA
4. Device/performance QA
5. Child usability test
6. Publish

## Definition of done

A lesson is done when content is approved, all required assets resolve, interactions work by touch/click, audio can replay, quiz scoring is correct, reward state appears, and the lesson passes target-device QA.
