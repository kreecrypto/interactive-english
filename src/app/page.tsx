import { ColorMvpLesson } from "@/components/ColorMvpLesson";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">English Adventure · ป.1</p>
          <h1>เรียนอังกฤษผ่านการฟัง เล่น และสำรวจ</h1>
          <p className="hero-copy">
            MVP ที่เล่นจบได้จริง: Learn → Explore 3D → Listen → Game → Quiz → Reward
          </p>
        </div>
        <div className="hero-note">
          <strong>MVP Focus</strong>
          <span>L08 · Colors Around Me</span>
        </div>
      </section>

      <ColorMvpLesson />
    </main>
  );
}
