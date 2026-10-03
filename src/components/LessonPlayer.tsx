"use client";

import { useCallback, useMemo, useState } from "react";
import { lessons } from "@/lib/lessons";
import { ThreeLessonScene } from "@/components/ThreeLessonScene";

export function LessonPlayer() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  const lesson = lessons[lessonIndex];
  const selectedWord = lesson.words[wordIndex] ?? lesson.words[0];

  const speak = useCallback((word: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.72;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }, []);

  const selectLesson = (index: number) => {
    setLessonIndex(index);
    setWordIndex(0);
  };

  const selectWord = useCallback(
    (index: number, playAudio = true) => {
      const item = lesson.words[index];
      if (!item) return;
      setWordIndex(index);
      if (playAudio) speak(item.word);
    },
    [lesson.words, speak]
  );

  const progress = useMemo(
    () => Math.round(((lessonIndex + 1) / lessons.length) * 100),
    [lessonIndex]
  );

  return (
    <section className="learning-shell">
      <aside className="lesson-nav" aria-label="MVP lessons">
        <p className="eyebrow">MVP Learning Map</p>
        <div className="lesson-list">
          {lessons.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === lessonIndex ? "lesson-button active" : "lesson-button"}
              onClick={() => selectLesson(index)}
              aria-pressed={index === lessonIndex}
            >
              <span>{item.id}</span>
              <strong>{item.unit}</strong>
            </button>
          ))}
        </div>

        <div className="progress-card">
          <div className="progress-label">
            <span>MVP progress</span>
            <strong>{lessonIndex + 1}/{lessons.length}</strong>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </aside>

      <div className="lesson-content">
        <header className="lesson-header">
          <div>
            <p className="eyebrow">{lesson.id} · {lesson.unit}</p>
            <h2>{lesson.title}</h2>
            <p>{lesson.goal}</p>
          </div>
          <div className="lesson-badge">Interactive Lesson</div>
        </header>

        <div className="stage-card">
          <div className="stage-heading">
            <div>
              <strong>Explore</strong>
              <span>ลากเพื่อหมุน · แตะวัตถุเพื่อเลือก</span>
            </div>
            <span className="three-badge">Three.js</span>
          </div>

          <ThreeLessonScene
            sceneType={lesson.scene}
            words={lesson.words.map((item) => item.word)}
            activeIndex={wordIndex}
            onPick={(index) => selectWord(index, true)}
          />
        </div>

        <div className="learning-grid">
          <section className="word-card">
            <p className="eyebrow">Vocabulary</p>
            <div className="word-hero">
              <div>
                <h3>{selectedWord.word}</h3>
                <p>{selectedWord.thai}</p>
              </div>
              <button type="button" className="listen-button" onClick={() => speak(selectedWord.word)}>
                🔊 ฟังเสียง
              </button>
            </div>

            <div className="word-options" aria-label="Vocabulary words">
              {lesson.words.map((item, index) => (
                <button
                  key={item.word}
                  type="button"
                  className={index === wordIndex ? "word-pill active" : "word-pill"}
                  onClick={() => selectWord(index, true)}
                  aria-pressed={index === wordIndex}
                >
                  {item.word}
                </button>
              ))}
            </div>

            <div className="sentence-box">
              <span>Say it</span>
              <strong>{lesson.sentence}</strong>
            </div>
          </section>

          <aside className="challenge-card">
            <p className="eyebrow">Mini Challenge</p>
            <h3>ลองทำดู!</h3>
            <p>{lesson.challenge}</p>
            <div className="reward-preview" aria-label="Reward preview">
              <span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
          </aside>
        </div>

        <div className="lesson-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => selectLesson((lessonIndex - 1 + lessons.length) % lessons.length)}
          >
            ← บทก่อนหน้า
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => selectLesson((lessonIndex + 1) % lessons.length)}
          >
            บทถัดไป →
          </button>
        </div>
      </div>
    </section>
  );
}
