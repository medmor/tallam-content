# Building an Interactive Lesson

This guide explains how to create an interactive lesson for the Taallam learning platform.

## Directory Structure

Each lesson lives in its own folder under the appropriate subject and semester path:

```
Content/
  primary6/
    02_الرياضيات/
      الدورة_الأولى/
        01_الأعداد_الصحيحة_الطبيعية/
          lesson.json          ← the lesson definition (required)
          segment.svg          ← SVG illustrations (optional)
          midpoint.svg
          ...
          lesson.pdf           ← source PDFs (not used by the app)
          lesson.txt           ← extracted text (not used by the app)
```

Folder names follow this pattern: `NN_Arabic_Name` where `NN` is the lesson number within the semester.

## lesson.json

The main file. It defines all steps, activities, and the exam. Here's the full schema:

```json
{
  "id": "01-natural-numbers",
  "title": "الأعداد الصحيحة الطبيعية",
  "subject": "الرياضيات",
  "semester": "الدورة الأولى",
  "steps": [ ... ],
  "exam": { ... }
}
```

- **id**: A short English slug (unique per lesson)
- **title**: Arabic lesson title
- **subject**: Arabic subject name
- **semester**: Arabic semester name

### Steps

Each step in the `steps` array can be one of three types:

#### 1. Content Step

Presents information to the student. Use `title` for a heading.

```json
{
  "type": "content",
  "title": "المليون",
  "body": "**المليون** هو العدد الذي يلي مباشرة العدد `999 999`"
}
```

#### 2. Example Step

Shows a question and its solution.

```json
{
  "type": "example",
  "question": "ما هو العدد الذي يلي `999 999` مباشرة؟",
  "solution": "$$1 000 000$$ (مليون)"
}
```

#### 3. Activity Step

An interactive exercise. The `activity` object can be one of five types (see below).

```json
{
  "type": "activity",
  "activity": { ... }
}
```

## Text Formatting

You can use these formatting options in any text field (`body`, `question`, `solution`, `explanation`, `instruction`, `text`):

| Syntax | Effect | Example |
|--------|--------|---------|
| `$$...$$` | Math/monospace block (centered) | `$$1 000 000 = 1 + 999 999$$` |
| `` `...` `` | Inline code/highlight | `` `999 999` `` |
| `**...**` | Bold | `**المليون**` |
| `{{svg:filename.svg}}` | SVG illustration (inline) | `{{svg:segment.svg}}` |
| Markdown table | Table rendering | See comparison table example |

### Math Formulas

When `$$...$$` appears **alone on its own line**, it renders as a centered block:

```
بحيث:
$$1 000 000 = 1 + 999 999$$
```

When `$$...$$` appears **within text**, it renders inline:

```
النقطة O هي منتصف القطعة $$[AB]$$
```

### SVG Illustrations

Instead of embedding SVGs directly in JSON (which causes quote-escaping issues), save them as `.svg` files in the same lesson folder and reference them with `{{svg:filename.svg}}`:

```json
{
  "type": "content",
  "title": "القطعة المستقيمة",
  "body": "**القطعة المستقيمة** محدودة من طرفيها.\n\n{{svg:segment.svg}}\n\nالنقطتان A و B هما طرفا القطعة."
}
```

The `{{svg:filename.svg}}` placeholder is resolved server-side when the lesson is loaded.

## Activity Types

### fill-blank

Student fills in blanks. Use `{{blankN}}` placeholders in the text.

```json
{
  "type": "fill-blank",
  "text": "المليون هو العدد الذي يلي مباشرة العدد {{blank1}}، بحيث: $$1 000 000 = {{blank2}} + 999 999$$. ومليون واحد يساوي {{blank3}} ألف.",
  "blanks": [
    { "id": "blank1", "answer": "999 999" },
    { "id": "blank2", "answer": "1" },
    { "id": "blank3", "answer": "ألف" }
  ],
  "explanation": "المليون يكتب $$1 000 000$$ وهو يلي العدد $$999 999$$."
}
```

### multiple-choice

Student picks one option. `correctIndex` is 0-based.

```json
{
  "type": "multiple-choice",
  "question": "1 مليار يساوي:",
  "options": [
    "مليون ألف",
    "ألف مليون",
    "مئة مليون",
    "عشرة ملايين"
  ],
  "correctIndex": 1,
  "explanation": "$$1 مليار = ألف × مليون = ألف مليون$$"
}
```

### click-to-place

Student selects items and places them into slots.

```json
{
  "type": "click-to-place",
  "instruction": "ضع الكلمات المناسبة في الأماكن الصحيحة:",
  "items": [
    { "id": "item-yes", "label": "نعم" },
    { "id": "item-no", "label": "لا" }
  ],
  "slots": [
    { "id": "seg-limited", "label": "القطعة: محدود من الجهتين؟", "correctItemId": "item-yes" },
    { "id": "ray-limited", "label": "نصف المستقيم: محدود من الجهتين؟", "correctItemId": "item-no" }
  ],
  "explanation": "القطعة محدودة من الجهتين، أما نصف المستقيم فمحدود من طرف واحد فقط."
}
```

### order-items

Student arranges items in the correct order.

```json
{
  "type": "order-items",
  "instruction": "رتّب الخطوات التالية:",
  "items": [
    { "id": "step-1", "label": "نقسم أرقام العدد ثلاثة ثلاثة" },
    { "id": "step-2", "label": "نحدد فئة كل مجموعة" },
    { "id": "step-3", "label": "نقرأ كل مجموعة مع اسم فئتها" }
  ],
  "correctOrder": ["step-1", "step-2", "step-3"],
  "explanation": "التسلسل الصحيح للقراءة..."
}
```

### true-false

Student judges statements as true or false.

```json
{
  "type": "true-false",
  "statements": [
    {
      "text": "القطعة المستقيمة $$[AB]$$ غير محدودة",
      "correct": false,
      "explanation": "خطأ! القطعة محدودة من طرفيها."
    },
    {
      "text": "المستقيم $$(AB)$$ غير محدود من الجهتين",
      "correct": true,
      "explanation": "صحيح! المستقيم يمتد بلا حدود."
    }
  ]
}
```

## Exam

The exam section has a title, a list of questions, and a passing score (0–100):

```json
"exam": {
  "title": "اختبار الأعداد الصحيحة الطبيعية",
  "questions": [
    {
      "id": "exam-1",
      "activity": { ... }
    }
  ],
  "passingScore": 70
}
```

Each question uses the same activity types (fill-blank, multiple-choice, etc.).

## Lesson Design Tips

1. **Small chunks**: Each step should cover one concept. Split topics across multiple content steps.
2. **Alternate content and activities**: After every 1–2 content steps, add an activity to reinforce learning.
3. **Use examples**: Add example steps between content and activities to show worked solutions.
4. **SVG illustrations**: For geometry, diagrams, and visual concepts, create SVG files and reference them with `{{svg:filename.svg}}`. Keep SVGs simple and use the project color palette:
   - Primary: `#FF653F` (orange)
   - Dark: `#1E104E` (deep purple)
   - Success: `#10b981` (green)
   - Gray: `#999` / `#e5e7eb`
5. **Explanations**: Always include `explanation` fields — they're shown after the student answers.
6. **Diverse activities**: Mix fill-blank, multiple-choice, true-false, click-to-place, and order-items across the lesson.
7. **6–8 exam questions**: Cover all key concepts from the lesson steps.

## Generating the Index

After adding or modifying a lesson, regenerate the index:

```bash
node generate-index.mjs
```

This scans all lesson folders and updates `index.json`.

## CDN Deployment

Content is deployed to GitHub Pages. Push to the `main` branch and GitHub Actions will deploy automatically. SVG files in the lesson folder are served alongside `lesson.json` and resolved by the app at runtime.