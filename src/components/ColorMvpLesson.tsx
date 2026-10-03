"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { ThreeLessonScene } from "@/components/ThreeLessonScene";

const colors = [
  { word: "Red", thai: "สีแดง", hex: "#ef4444" },
  { word: "Blue", thai: "สีน้ำเงิน", hex: "#3b82f6" },
  { word: "Yellow", thai: "สีเหลือง", hex: "#eab308" },
  { word: "Green", thai: "สีเขียว", hex: "#22c55e" },
  { word: "Purple", thai: "สีม่วง", hex: "#a855f7" }
];

const colorWords = colors.map((item) => item.word);
const steps = ["Intro", "Learn", "Explore", "Listen", "Game", "Quiz", "Reward"] as const;
const listenTargets = [1, 0, 3];
const gameTargets = [3, 4, 2];

const quiz = [
  {
    prompt: "Which word means “สีแดง”?",
    options: ["Blue", "Red", "Green"],
    answer: "Red"
  },
  {
    prompt: "Which color is this?",
    swatch: "#3b82f6",
    options: ["Yellow", "Blue", "Purple"],
    answer: "Blue"
  },
  {
    prompt: "Choose the English word for “สีเขียว”.",
    options: ["Purple", "Green", "Red"],
    answer: "Green"
  },
  {
    prompt: "Listen and choose.",
    speak: "Purple",
    options: ["Purple", "Yellow", "Blue"],
    answer: "Purple"
  },
  {
    prompt: "Which sentence matches this color?",
    swatch: "#eab308",
    options: ["It is red.", "It is yellow.", "It is green."],
    answer: "It is yellow."
  }
];

function starsFor(score: number) {
  if (score >= 5) return 3;
  if (score >= 3) return 2;
  return 1;
}

export function ColorMvpLesson() {
  const [step, setStep] = useState(0);
  const [activeWord, setActiveWord] = useState(0);
  const [heardWords, setHeardWords] = useState<number[]>([]);
  const [exploredWords, setExploredWords] = useState<number[]>([]);
  const [listenIndex, setListenIndex] = useState(0);
  const [listenCorrect, setListenCorrect] = useState(0);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameCorrect, setGameCorrect] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizLocked, setQuizLocked] = useState(false);
  const [feedback, setFeedback] = useState("พร้อมเริ่มเรียนแล้ว!");
  const [completedBefore, setCompletedBefore] = useState(false);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) {
      setFeedback("อุปกรณ์นี้ไม่รองรับเสียงสังเคราะห์ แต่ยังทำกิจกรรมต่อได้");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.72;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    try {
      setCompletedBefore(window.localStorage.getItem("english-p1-l08-complete") === "1");
    } catch {
      setCompletedBefore(false);
    }
  }, []);

  useEffect(() => {
    if (step !== 6) return;
    try {
      window.localStorage.setItem("english-p1-l08-complete", "1");
      setCompletedBefore(true);
    } catch {
      // Completion still works without persistent storage.
    }
  }, [step]);

  const progress = Math.round((step / (steps.length - 1)) * 100);
  const currentListenTarget = colors[listenTargets[listenIndex] ?? 0];
  const currentGameTargetIndex = gameTargets[gameIndex] ?? 0;
  const currentGameTarget = colors[currentGameTargetIndex];
  const currentQuiz = quiz[quizIndex];

  const learnedCount = heardWords.length;
  const exploredCount = exploredWords.length;

  const canContinueLearn = learnedCount === colors.length;
  const canContinueExplore = exploredCount >= 3;
  const canContinueListen = listenCorrect === listenTargets.length;
  const canContinueGame = gameCorrect === gameTargets.length;

  const rewardStars = useMemo(() => starsFor(quizScore), [quizScore]);

  const rememberUnique = (items: number[], value: number) =>
    items.includes(value) ? items : [...items, value];

  const hearWord = (index: number) => {
    setActiveWord(index);
    setHeardWords((items) => rememberUnique(items, index));
    speak(colors[index].word);
    setFeedback(`${colors[index].word} — ${colors[index].thai}`);
  };

  const explorePick = (index: number) => {
    setActiveWord(index);
    setExploredWords((items) => rememberUnique(items, index));
    speak(colors[index].word);
    setFeedback(`เยี่ยม! นี่คือ ${colors[index].word}`);
  };

  const answerListen = (index: number) => {
    const expected = listenTargets[listenIndex];
    if (index !== expected) {
      setFeedback("ลองอีกครั้งนะ 👂 ฟังเสียงแล้วเลือกสีให้ตรง");
      speak(colors[expected].word);
      return;
    }

    const nextCorrect = listenCorrect + 1;
    setListenCorrect(nextCorrect);
    setFeedback("ถูกต้อง! Great job! ⭐");

    if (listenIndex < listenTargets.length - 1) {
      const next = listenIndex + 1;
      setListenIndex(next);
      window.setTimeout(() => speak(colors[listenTargets[next]].word), 350);
    }
  };

  const answerGame = (index: number) => {
    if (index !== currentGameTargetIndex) {
      setFeedback(`ยังไม่ใช่ ลองหา ${currentGameTarget.word} อีกครั้ง`);
      return;
    }

    speak(currentGameTarget.word);
    const nextCorrect = gameCorrect + 1;
    setGameCorrect(nextCorrect);
    setActiveWord(index);
    setFeedback(`เจอแล้ว! ${currentGameTarget.word} ⭐`);

    if (gameIndex < gameTargets.length - 1) {
      setGameIndex((value) => value + 1);
    }
  };

  const answerQuiz = (answer: string) => {
    if (quizLocked) return;
    setQuizLocked(true);

    const correct = answer === currentQuiz.answer;
    if (correct) {
      setQuizScore((value) => value + 1);
      setFeedback("Correct! ⭐");
    } else {
      setFeedback(`คำตอบคือ “${currentQuiz.answer}”`);
    }
  };

  const nextQuiz = () => {
    if (quizIndex >= quiz.length - 1) {
      setStep(6);
      setFeedback("เรียนจบบท Colors แล้ว! 🎉");
      return;
    }

    const next = quizIndex + 1;
    setQuizIndex(next);
    setQuizLocked(false);
    setFeedback(`Quiz ${next + 1} / ${quiz.length}`);

    if (quiz[next].speak) {
      window.setTimeout(() => speak(quiz[next].speak as string), 250);
    }
  };

  const goTo = (nextStep: number) => {
    setStep(nextStep);
    setFeedback(steps[nextStep] === "Reward" ? "เรียนจบแล้ว!" : `ด่าน: ${steps[nextStep]}`);
    if (nextStep === 3) window.setTimeout(() => speak(colors[listenTargets[0]].word), 250);
  };

  const restart = () => {
    window.speechSynthesis?.cancel();
    setStep(0);
    setActiveWord(0);
    setHeardWords([]);
    setExploredWords([]);
    setListenIndex(0);
    setListenCorrect(0);
    setGameIndex(0);
    setGameCorrect(0);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizLocked(false);
    setFeedback("พร้อมเริ่มเรียนใหม่!");
  };

  return (
    <section className="mvp-shell">
      <div className="mvp-topbar">
        <div>
          <p className="eyebrow">L08 · Colors Around Me</p>
          <h2>Colors</h2>
          <p>ฟัง พูด และแยกแยะสีพื้นฐานจากวัตถุ</p>
        </div>
        <div className="mvp-status">
          <span>{steps[step]}</span>
          <strong>{progress}%</strong>
        </div>
      </div>

      <div className="mvp-progress" aria-label={`Lesson progress ${progress}%`}>
        <div className="mvp-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <ol className="stepper" aria-label="Lesson steps">
        {steps.map((label, index) => (
          <li key={label} className={index < step ? "done" : index === step ? "active" : ""}>
            <span>{index < step ? "✓" : index + 1}</span>
            <small>{label}</small>
          </li>
        ))}
      </ol>

      <div className="mvp-panel">
        {step === 0 && (
          <div className="intro-screen">
            <div className="intro-orbs" aria-hidden="true">
              {colors.map((item) => (
                <span key={item.word} style={{ background: item.hex }} />
              ))}
            </div>
            <p className="eyebrow">English Adventure</p>
            <h3>มารู้จัก 5 สีภาษาอังกฤษกัน!</h3>
            <p>ฟังคำศัพท์ สำรวจลูกบอล 3D เล่นเกมหาเป้าหมาย และทำ Quiz ให้จบเพื่อรับดาว</p>
            {completedBefore && <div className="return-badge">🏅 เคยเรียนจบบทนี้แล้ว</div>}
            <button type="button" className="primary-button jumbo" onClick={() => goTo(1)}>
              เริ่มเรียน →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="activity-screen">
            <div className="activity-heading">
              <div>
                <p className="eyebrow">1 · Learn</p>
                <h3>แตะและฟังให้ครบ 5 สี</h3>
              </div>
              <strong>{learnedCount}/5</strong>
            </div>

            <div className="learn-grid">
              {colors.map((item, index) => (
                <button
                  key={item.word}
                  type="button"
                  className={heardWords.includes(index) ? "color-learn-card learned" : "color-learn-card"}
                  onClick={() => hearWord(index)}
                >
                  <span className="color-dot" style={{ background: item.hex }} />
                  <strong>{item.word}</strong>
                  <small>{item.thai}</small>
                  <span>{heardWords.includes(index) ? "✓ ฟังแล้ว" : "🔊 แตะเพื่อฟัง"}</span>
                </button>
              ))}
            </div>

            <div className="gate-row">
              <span>{canContinueLearn ? "ครบแล้ว! ไปสำรวจ 3D กัน" : "ฟังให้ครบทุกคำก่อนนะ"}</span>
              <button type="button" className="primary-button" disabled={!canContinueLearn} onClick={() => goTo(2)}>
                ต่อไป →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="activity-screen">
            <div className="activity-heading">
              <div>
                <p className="eyebrow">2 · Explore 3D</p>
                <h3>หมุนฉาก แล้วแตะอย่างน้อย 3 สี</h3>
              </div>
              <strong>{exploredCount}/3+</strong>
            </div>

            <div className="mvp-three-wrap">
              <ThreeLessonScene
                sceneType="colors"
                words={colorWords}
                activeIndex={activeWord}
                onPick={explorePick}
              />
            </div>

            <div className="selected-color">
              <span className="color-dot large" style={{ background: colors[activeWord].hex }} />
              <div>
                <strong>{colors[activeWord].word}</strong>
                <span>{colors[activeWord].thai}</span>
              </div>
              <button type="button" className="listen-button" onClick={() => hearWord(activeWord)}>
                🔊 ฟังอีกครั้ง
              </button>
            </div>

            <div className="gate-row">
              <span>{canContinueExplore ? "ผ่านด่าน Explore แล้ว!" : "ลองแตะสีอื่น ๆ อีก"}</span>
              <button type="button" className="primary-button" disabled={!canContinueExplore} onClick={() => goTo(3)}>
                ต่อไป →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="activity-screen compact">
            <div className="activity-heading">
              <div>
                <p className="eyebrow">3 · Listen & Choose</p>
                <h3>ฟังแล้วเลือกสีที่ได้ยิน</h3>
              </div>
              <strong>{listenCorrect}/{listenTargets.length}</strong>
            </div>

            {!canContinueListen ? (
              <>
                <button type="button" className="audio-orb" onClick={() => speak(currentListenTarget.word)} aria-label="Play word">
                  🔊
                  <span>ฟังอีกครั้ง</span>
                </button>

                <div className="listen-options">
                  {colors.map((item, index) => (
                    <button key={item.word} type="button" className="color-choice" onClick={() => answerListen(index)}>
                      <span style={{ background: item.hex }} />
                      <strong>{item.word}</strong>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="success-card">
                <div>🎧 ⭐</div>
                <h3>Listening Complete!</h3>
                <p>ตอบถูกครบ {listenTargets.length} คำแล้ว</p>
              </div>
            )}

            <div className="gate-row">
              <span>{canContinueListen ? "เก่งมาก! ไปเล่นเกมกัน" : "ฟังและตอบให้ครบ 3 ข้อ"}</span>
              <button type="button" className="primary-button" disabled={!canContinueListen} onClick={() => goTo(4)}>
                ไปเล่นเกม →
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="activity-screen">
            <div className="activity-heading">
              <div>
                <p className="eyebrow">4 · Mini Game</p>
                <h3>{canContinueGame ? "ครบทุกเป้าหมายแล้ว!" : <>Find <em>{currentGameTarget.word}</em>!</>}</h3>
              </div>
              <strong>{gameCorrect}/{gameTargets.length}</strong>
            </div>

            <p className="game-instruction">
              {canContinueGame ? "ผ่านด่าน Mini Game 🎉" : `หมุนฉากแล้วแตะลูกบอลสี ${currentGameTarget.word}`}
            </p>

            <div className="mvp-three-wrap">
              <ThreeLessonScene
                sceneType="colors"
                words={colorWords}
                activeIndex={activeWord}
                onPick={answerGame}
              />
            </div>

            <div className="target-row">
              {gameTargets.map((target, index) => (
                <span key={target} className={index < gameCorrect ? "target-chip done" : index === gameIndex && !canContinueGame ? "target-chip active" : "target-chip"}>
                  <i style={{ background: colors[target].hex }} />
                  {colors[target].word}
                </span>
              ))}
            </div>

            <div className="gate-row">
              <span>{canContinueGame ? "ผ่านแล้ว! พร้อมทำ Quiz" : "หาเป้าหมายให้ครบ 3 สี"}</span>
              <button type="button" className="primary-button" disabled={!canContinueGame} onClick={() => goTo(5)}>
                ทำ Quiz →
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="activity-screen compact">
            <div className="activity-heading">
              <div>
                <p className="eyebrow">5 · Quiz</p>
                <h3>Question {quizIndex + 1} / {quiz.length}</h3>
              </div>
              <strong>⭐ {quizScore}</strong>
            </div>

            <div className="quiz-card">
              {currentQuiz.swatch && (
                <div className="quiz-swatch" style={{ background: currentQuiz.swatch }} aria-label="Color sample" />
              )}

              <h3>{currentQuiz.prompt}</h3>

              {currentQuiz.speak && (
                <button type="button" className="audio-orb small" onClick={() => speak(currentQuiz.speak as string)}>
                  🔊
                  <span>ฟังคำ</span>
                </button>
              )}

              <div className="quiz-options">
                {currentQuiz.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={quizLocked}
                    className={quizLocked && option === currentQuiz.answer ? "quiz-option correct" : "quiz-option"}
                    onClick={() => answerQuiz(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {quizLocked && (
                <button type="button" className="primary-button quiz-next" onClick={nextQuiz}>
                  {quizIndex === quiz.length - 1 ? "ดูรางวัล →" : "ข้อต่อไป →"}
                </button>
              )}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="reward-screen">
            <div className="confetti" aria-hidden="true">● ◆ ★ ● ◆ ★</div>
            <p className="eyebrow">Lesson Complete</p>
            <h3>Great Job! 🎉</h3>
            <p>เรียนจบบท <strong>Colors Around Me</strong> แล้ว</p>

            <div className="big-stars" aria-label={`${rewardStars} stars`}>
              {[0, 1, 2].map((index) => (
                <span key={index} className={index < rewardStars ? "earned" : ""}>★</span>
              ))}
            </div>

            <div className="score-summary">
              <div><span>Quiz</span><strong>{quizScore}/5</strong></div>
              <div><span>Listening</span><strong>{listenCorrect}/3</strong></div>
              <div><span>Game</span><strong>{gameCorrect}/3</strong></div>
            </div>

            <div className="certificate">
              <span>🏅</span>
              <div>
                <small>Unlocked</small>
                <strong>Color Explorer</strong>
              </div>
            </div>

            <button type="button" className="secondary-button jumbo" onClick={restart}>
              ↻ เล่นอีกครั้ง
            </button>
          </div>
        )}
      </div>

      <div className="feedback-bar" role="status" aria-live="polite">
        <span>💬</span>
        <strong>{feedback}</strong>
      </div>
    </section>
  );
}
