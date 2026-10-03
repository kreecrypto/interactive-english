export type LessonScene = "hello" | "colors" | "animals";

export type VocabularyItem = {
  word: string;
  thai: string;
};

export type Lesson = {
  id: string;
  unit: string;
  title: string;
  goal: string;
  scene: LessonScene;
  sentence: string;
  challenge: string;
  words: VocabularyItem[];
};

export const lessons: Lesson[] = [
  {
    id: "L01",
    unit: "Hello!",
    title: "Greetings & Introductions",
    goal: "ทักทายและแนะนำตัวเองด้วยคำและประโยคสั้น ๆ",
    scene: "hello",
    sentence: "Hello! My name is Sam.",
    challenge: "เลือกคำทักทาย แล้วกดฟังเสียงและพูดตาม",
    words: [
      { word: "Hello", thai: "สวัสดี" },
      { word: "Hi", thai: "สวัสดี" },
      { word: "Goodbye", thai: "ลาก่อน" },
      { word: "Name", thai: "ชื่อ" }
    ]
  },
  {
    id: "L08",
    unit: "Colors",
    title: "Colors Around Me",
    goal: "ฟัง พูด และแยกแยะสีพื้นฐานจากวัตถุ",
    scene: "colors",
    sentence: "It is blue.",
    challenge: "แตะวัตถุ 3D แล้วฟังชื่อสี จากนั้นพูดตาม",
    words: [
      { word: "Red", thai: "สีแดง" },
      { word: "Blue", thai: "สีน้ำเงิน" },
      { word: "Yellow", thai: "สีเหลือง" },
      { word: "Green", thai: "สีเขียว" },
      { word: "Purple", thai: "สีม่วง" }
    ]
  },
  {
    id: "L12",
    unit: "Animals",
    title: "Pets & Animals",
    goal: "ฟังและบอกชื่อสัตว์ใกล้ตัวเป็นภาษาอังกฤษ",
    scene: "animals",
    sentence: "It is a cat.",
    challenge: "เลือกสัตว์จากฉาก แล้วฟังและพูดชื่อสัตว์",
    words: [
      { word: "Cat", thai: "แมว" },
      { word: "Dog", thai: "สุนัข" },
      { word: "Bird", thai: "นก" },
      { word: "Fish", thai: "ปลา" },
      { word: "Rabbit", thai: "กระต่าย" }
    ]
  }
];
