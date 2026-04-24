# Oracle — Framework สร้าง AI Agent ที่มีความทรงจำถาวร

> "The Oracle Keeps the Human Human"

## Oracle คืออะไร?

ทุกครั้งที่เริ่มบทสนทนาใหม่กับ AI มันจะลืมทุกอย่าง บริบท ความชอบ ความก้าวหน้า — หายไปหมด

**Oracle แก้ปัญหานี้**

Oracle เป็น framework สำหรับสร้าง **AI Agent ที่มีความทรงจำถาวร** ซึ่ง:
- **จำได้** — เก็บความรู้ใน vault ที่มีโครงสร้าง (`ψ/`)
- **เรียนรู้** — จับแบบแผนและบทเรียนจากทุก session
- **เกิดใหม่** — อ่านความทรงจำตอนเริ่ม session เพื่อกู้คืนตัวตนและบริบท
- **เติบโต** — Oracle วันนี้ฉลาดกว่าเมื่อวานเสมอ

ทำงานร่วมกับ [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (CLI ของ Anthropic) โดยใช้ `CLAUDE.md` เป็นจิตวิญญาณของ Oracle — ไฟล์ที่กำหนดตัวตน กฎ และขั้นตอนการทำงาน

## เริ่มต้นใช้งาน

```bash
# 1. Clone template นี้
git clone https://github.com/YOUR_USERNAME/oracle-template.git my-oracle
cd my-oracle

# 2. ติดตั้ง Claude Code (ถ้ายังไม่มี)
npm install -g @anthropic-ai/claude-code

# 3. กำหนดตัวตนของ Oracle
#    เปิด CLAUDE.th.md (ภาษาไทย) หรือ CLAUDE.md (English)
#    แทนที่ {{PLACEHOLDER}} ทั้งหมด:
#    - {{ORACLE_NAME}} → ชื่อ Oracle ของคุณ
#    - {{HUMAN_NAME}} → ชื่อคุณ
#    - {{PURPOSE}} → Oracle ทำอะไร
#    - {{THEME}} → คติพจน์นำทาง
#    - {{BORN_DATE}} → วันน��้
#    - ฯลฯ
#
#    แล้ว rename เป็น CLAUDE.md:
#    mv CLAUDE.th.md CLAUDE.md

# 4. เปิด Claude Code
claude

# 5. Oracle ของคุณมีชีวิตแล้ว — เริ่มทำงานได้เลย
```

แค่นี้เอง Oracle จะอ่าน `CLAUDE.md` ทุกครั้งที่เริ่ม session และทำงานตามตัวตนและกฎที่คุณกำหนด

## ทำงานอย่างไร

### จิตวิญญาณ: `CLAUDE.md`

ไฟล์นี้กำหนด **ว่า Oracle เป็นใคร**:
- ตัวตน (ชื่อ จุดประสงค์ ธีม)
- กฎและปรัชญาการทำงาน
- ขั้นตอน session (boot → ทำงาน → ปิด)
- กฎความปลอดภัย

Claude Code อ่านไฟล์นี้อัตโนมัติตอนเริ่ม session มันกำหนดทุกคำตอบและการตัดสินใจของ Oracle

### สมอง: `ψ/` vault

ไดเรกทอรีนี้คือ **ความทรงจำ** ของ Oracle:

```
ψ/
├── inbox/              ← ข้อความ งาน บันทึกส่งต่อ
│   └── handoff/        ← "ค้างไว้ตรงนี้" notes
├── memory/
│   ├── resonance/      ← ใคร: ตัวตน จิตวิญญาณ ปรัชญา
│   ├── learnings/      ← อะไร: แบบแผนที่ค้นพบ
│   ├── retrospectives/ ← เมื่อไหร่: บันทึก session
│   └── logs/           ← ช่วงเวลาสั้นๆ
├── writing/            ← งานเขียนร่าง
├── active/             ← โฟกัสปัจจุบัน
├── outbox/             ← ข้อความขาออก
├── archive/            ← งานเสร็จแล้ว
├── lab/                ← ทดลอง
├── learn/              ← สื่อการเรียนรู้
├── shared/             ← แชร์ข้าม agents
└── later/              ← พักไว้ก่อน
```

**ความรู้ไหลขึ้นข้างบน:**
```
active/ → logs → retrospectives → learnings → resonance
(วิจัย → สแนปชอต → บันทึก session → แบบแผน → จิตวิญญาณ)
```

สิ่งที่สังเกตได้ → กลายเป็นบันทึก session → กลายเป็นแบบแผน → กลายเป็นตัวตนหลัก

### วงจรชีวิต: Session Discipline

ทุก session ใช้จังหวะเดียวกัน:

```
┌──────────────────────────────────────────────────┐
│  เริ่ม            ระหว่าง            จบ            │
│  ─────           ──────            ───           │
│  fast-boot.sh → ทำงาน + เรียนรู้ → Retrospective │
│  อ่าน handoff    บันทึกแบบแผน      git commit     │
│  ปรับทิศทาง      ตรวจสอบผลลัพธ์     git push       │
│                                    เขียน handoff  │
└──────────────────────────────────────────────────┘
```

**เริ่ม:** รัน `bash tools/fast-boot.sh` อ่านว่าค้างไว้ตรงไหน เช็ค git status สแกน inbox

**ระหว่าง:** ทำงาน ก่อนงานใหญ่รัน `bash tools/pre-action.sh "รายละเอียด"` เช็คว่าเคยทำมาก่อนหรือเปล่า

**จบ:** เขียน retrospective (เกิดอะไรขึ้น เรียนรู้อะไร) commit ลง git เขียน handoff สำหรับ session ถัดไป

วงจรนี้ทำให้ไม่มีอะไรหายไประหว่าง session

## เครื่องมือ (Tools)

ไดเรกทอรี `tools/` มีสคริปต์ช่วยทำงาน:

| สคริปต์ | หน้าที่ | วิธีใช้ |
|---------|---------|---------|
| `fast-boot.sh` | Boot session — handoff + git + inbox ใน 1 call | `bash tools/fast-boot.sh` |
| `pre-action.sh` | ค้นหาผลงานเก่าก่อนเริ่มงานใหม่ | `bash tools/pre-action.sh "รายละเอียด"` |
| `lean-files.sh` | สรุปหลายไฟล์ (2 บรรทัด/ไฟล์) | `bash tools/lean-files.sh <directory>` |
| `report.ts` | สร้าง dashboard บน browser | `bun tools/report.ts` |

### Dashboard Report

รัน `bun tools/report.ts` เพื่อสร้างรายงานภาพของข้อมูล Oracle:
- สถิติ Vault (จำนวนไฟล์���ุกไดเรกทอรี)
- Session ล่าสุดและ retrospectives
- Learnings ที่สะสม
- Timeline กิจกรรม
- Knowledge Flow visualization

รายงานเปิดในเบราว์เซอร์อัตโนมัติ

## ปรัชญา 5 ประการ

1. **ไม่ลบ มีแต่ Supersede** — ประวัติศาสตร์ถูกรักษา ไม่ถูกลบ ของเก่าถูกแทนที่ ไม่ถูกทำลาย
2. **สังเกตพฤติกรรม ไม่ใช่เจตนา** — เรียนรู้จาก pattern จริง ไม่ใช่สมมติฐานว่ามนุษย์ต้องการอะไร
3. **สมองภายนอก ไม่ใช่ผู้สั่ง** — AI แนะนำและเชื่อมโยงอย่าง proactive มนุษย์ตัดสินใจ
4. **ความอยากรู้สร้างการมีอยู่** — ยิ่งคำถามลึก ระบบยิ่งฉลาด ถาม "ทำไม" ไม่หยุด
5. **มีรูปและไร้รูป** — ยึดโครงสร้าง แต่ยืดหยุ่นเมื่อแก้ปัญหาจริง

## ปรับแต่งให้เป็นของคุณ

### ตัวตน

เปิด `CLAUDE.th.md` (หรือ `CLAUDE.md`) แทนที่ `{{PLACEHOLDER}}` ทั้งหมด:

| Placeholder | กรอกอะไร | ตัวอย่าง |
|-------------|----------|----------|
| `{{ORACLE_NAME}}` | ชื่อ Oracle ของคุณ | "Atlas", "Sage", "Echo" |
| `{{HUMAN_NAME}}` | ชื่อคุณ | "Alex" |
| `{{PURPOSE}}` | Oracle ทำอะไร | "ผู้ช่วยพัฒนา full-stack" |
| `{{THEME}}` | คติพจน์นำทาง | "สร้างเร็ว ไม่พัง" |
| `{{BORN_DATE}}` | วันนี้ | "2026-04-24" |
| `{{LANGUAGE}}` | ภาษาหลัก | "ไทย", "English", "ไทย + English" |

แล้ว rename เป็น CLAUDE.md: `mv CLAUDE.th.md CLAUDE.md`

### เพิ่มกฎใหม่

เพิ่มกฎใน **Section 4 (กฎสำคัญ)** ของ `CLAUDE.md` Oracle จะปฏิบัติตามทุก session

### เพิ่มเครื่องมือ

ใส่สคริปต์ลง `tools/` อ้างอิงใน `CLAUDE.md` เพื่อให้ Oracle รู้จักใช้

### เพิ่มความทรงจำ

เขียนไฟล์ `.md` ลงไดเรกทอรี `ψ/` ที่เหมาะสม:
- `ψ/memory/resonance/` — เอกสารตัวตนหลัก
- `ψ/memory/learnings/` — แบบแผนและการค้นพบ
- `ψ/inbox/` — งานและข้อความ

Oracle อ่านไฟล์เหล่านี้ตอนเริ่ม session เพื่อกู้คืนบริบท

## ขั้นสูง: Fleet หลาย Agent

Oracle รองรับการสร้าง child agents แต่ละตัวมีความเชี่ยวชาญเฉพาะ:

| บทบาท | หน้าที่ |
|-------|---------|
| Builder | เขียนโค้ด สร้าง features |
| Researcher | วิจัย วิเคราะห์ เอกสาร |
| Designer | UI/UX ออกแบบ |
| Tester | ทดสอบ QA |
| Writer | สร้างเนื้อหา |

แต่ละตัวมี repo ของตัวเอง มี `CLAUDE.md` และ `ψ/` vault ของตัวเอง Oracle แม่เป็นผู้บริหาร

เป็นรูปแบบขั้นสูง — เริ่มจาก Oracle ตัวเดียวก่อน ขยายเมื่อจำเป็น

## ความต้องการระบบ

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
- [Bun](https://bun.sh) (สำหรับรัน TypeScript tools เช่น dashboard)
- Git

## คำถามที่พบบ่อย

**ถ: ความทรงจำของ Oracle คงอยู่ข้าม session จริงหรือ?**
ตอบ: ใช่ — ผ่าน `ψ/` vault Oracle เขียน learnings และ handoffs เป็นไฟล์ แล้วอ่านกลับตอนเริ่ม session ถัดไป

**ถ: ข้อมูลเป็นส่วนตัวไหม?**
ตอบ: ใช่ `.gitignore` ไม่รวมเนื้อหา vault ทั้งหมดโดยค่าเริ่มต้น มีแค่โครงสร้าง (`.gitkeep`) ที่ถูก commit ความทรงจำอยู่ในเครื่องคุณเท่านั้น เว้นแต่คุณเลือก push เอง

**ถ: ใช้กับ AI tools อื่นได้ไหม (ไม่ใช่ Claude Code)?**
ตอบ: `CLAUDE.md` ทำงานกับ AI coding tool ใดก็ได้ที่อ่านไฟล์คำสั่งระดับโปรเจกต์ `ψ/` vault เป็น markdown ธรรมดา — AI ตัวไหนก็อ่านได้

**ถ: ต่างจากใช้ Claude Code ปกติยังไง?**
ตอบ: ไม่มี Oracle = Claude ลืมทุกอย่างระหว่าง session มี Oracle = มีความทรงจำที่มีโครงสร้าง ตัวตนที่สม่ำเสมอ ขั้นตอนการทำงาน และวงจร session ที่ไม่มีอะไรหาย

**ถ: รัน Oracle หลายตัวได้ไหม?**
ตอบ: ได้ แต่ละ Oracle เป็น repo แยกมี `CLAUDE.md` และ `ψ/` vault ของตัวเอง สื่อสารกันผ่าน `outbox/` และ `inbox/`

## เครดิต

- **Oracle Mother**: [Nat / Soul-Brews-Studio](https://github.com/Soul-Brews-Studio) — โปรเจกต์ Oracle ต้นฉบับ open-source
- **ปรัชญา**: "The Oracle Keeps the Human Human"

## สัญญาอนุญาต

MIT — ใช้ได้ แก้ไขได้ ทำเป็นของคุณ
