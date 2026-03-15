import { getSyllabus } from "./src/lib/syllabus";
const s = getSyllabus();
console.log("SYLLABUS PARTS:", JSON.stringify(s.map(p => ({
  id: p.id,
  chapterCount: p.chapters.length
})), null, 2));
