# My Boy — Product Wedge for University Students

Date: 2026-10-10

## The problem we are choosing
Do not position My Boy as another task list, streak app, or generic AI chat. Student planners already offer syllabus parsing, deadline extraction, and study scheduling; these are useful but not unique on their own.

## Product thesis
**My Boy turns the messy inputs students already receive into a reviewed plan and helps move the actual academic work forward.**

A student can send one of:
- a screenshot of a course announcement,
- an assignment brief or rubric PDF,
- a photo of a whiteboard,
- a voice note describing what the professor said,
- a group-project message or meeting notes,
- a deadline typed in Arabic or English.

My Boy should:
1. Extract the task, course, deadline, requirements, and uncertainties.
2. Show the original evidence and a confidence level; never silently invent a date.
3. Ask the student to confirm or correct the interpretation.
4. Turn the task into milestones sized to the student's available time.
5. Help produce the next useful artifact: an outline, checklist, study questions, presentation structure, or a draft based on the student's supplied material.
6. Keep track of what's done and revise the plan when the deadline or schedule changes.
7. Keep the student in control; no submitting assignments, messaging instructors, or making external changes without explicit approval.

## The initial killer workflow: Assignment Rescue
Example:
- Student uploads a screenshot: "Database project demo next Thursday. Include ERD, CRUD, validation, and report."
- My Boy extracts the requirements and deadline and displays the source snippet.
- It asks one clarification if the date or requirement is ambiguous.
- It creates a checklist: ERD, CRUD, validation, report, test/demo.
- It asks how much time the student has and proposes a realistic plan.
- It helps with the next step and keeps a visible evidence-linked checklist.
- If the student falls behind, it reshuffles the remaining plan instead of merely showing an overdue red task.

This is more valuable than a generic reminder because it connects **incoming information → understanding → planning → work product → follow-through**.

## Why this could matter in Jordan
This is a hypothesis to validate, not a claim that all Jordanian students behave the same way:
- Students receive course instructions in different forms and may need Arabic/English support.
- Some students combine university, commuting, family commitments, and paid work.
- Reducing manual entry is likely important: a planner that requires maintaining itself can become another chore.
- Low-cost access and clear control over uploaded course material are important product requirements.

## Competitive reality
Existing products already offer some combination of syllabus/PDF extraction, AI study planning, LMS syncing, notes, and reminders. Therefore, do not claim the idea is completely absent from the internet. My Boy must differentiate through the end-to-end workflow, support for messy real inputs, Arabic/English understanding, student-plus-work scheduling, and evidence-linked execution—not by claiming to be the first AI planner.

## MVP scope
Build in this order:
1. **Input capture:** paste text first; later image/PDF/voice input.
2. **Structured extraction:** task, course, deadline, requirements, estimated effort, source evidence, uncertainty.
3. **Confirm/edit screen:** user approves before saving.
4. **Milestone planner:** create steps based on deadline and time available.
5. **Deliverable helper:** generate an outline/checklist/questions from user-provided material; support learning rather than academic deception.
6. **Rescue mode:** when behind schedule, reprioritize and propose a recovery plan.
7. **Activity history:** show what My Boy suggested, what the user approved, and what changed.

Do not start with full LMS integrations, autonomous browser actions, social feeds, or a complicated gamification system. Prove that students return because My Boy saves effort and helps them finish real work.

## Validation before building too much
Interview 8–12 university students, including students who also work. Ask them to show the last confusing assignment announcement, the last missed/late deadline, and the tools they used. Test a clickable prototype with their real (redacted) examples. Measure:
- time from upload/paste to a confirmed task,
- extraction correction rate,
- percentage of plans followed,
- assignment milestones completed,
- repeat use over 2–3 weeks,
- whether students would recommend or pay for it.

## Success test
A student should be able to say:
"I sent My Boy the assignment instructions, and it understood what I actually have to deliver, helped me start, and kept the plan updated. I didn't have to manage another app."

## Current implementation status
The existing repository is still a static prototype with localStorage and deterministic phrase parsing. This document describes the next product direction; it does not imply these capabilities are implemented yet.
