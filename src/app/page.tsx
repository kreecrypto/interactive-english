import { LessonPlayer } from "@/components/LessonPlayer";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">English Adventure · ป.1</p>
          <h1>เรียนอังกฤษผ่านการฟัง เล่น และสำรวจ</h1>
          <p className="hero-copy">
            MVP สำหรับทดสอบ Lesson Engine ก่อนขยายเป็น 20 บทเรียนเต็ม
          </p>
        </div>
        <div className="hero-note">
          <strong>Learning loop</strong>
          <span>Learn → Listen → Practice → Game → Quiz → Reward</span>
        </div>
      </section>

      <LessonPlayer />
    </main>
  );
}
