# Jordan Audience Research & Product Hypotheses

Last reviewed: 2026-10-10

## Purpose
Design AI Task Assistant around practical workflows for two initial audiences in Jordan:
1. University students
2. Employees in IT roles

This document separates **published evidence** from **product hypotheses**. Public sources do not tell us exactly how every Jordanian student or IT employee thinks; those assumptions must be validated with interviews and usage data.

## Published evidence

### Jordan's ICT workforce and skills
- The National Digital Skills Study 2025 reports **47,840 people employed in Jordan's ICT sector in 2025** and **12,000 ICT graduates across 2024–2025**. The study examines supply/demand skill gaps and technical and soft skills. Source: [Jordan News Agency / Petra, 15 Dec 2025](https://petra.gov.jo/ar/index.php/ar/news/%D8%AF%D8%B1%D8%A7%D8%B3%D8%A9-%D8%AD%D9%88%D9%84-%D9%81%D8%AC%D9%88%D8%A9-%D8%A7%D9%84%D9%85%D9%87%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A%D8%A9-%D8%A8%D9%82%D8%B7%D8%A7%D8%B9-%D8%AA%D9%83%D9%86%D9%88%D9%84%D9%88%D8%AC%D9%8A%D8%A7).
- The [DigiSkills 2025 study announcement](https://digiskills.jo/EN//NewsDetails/Launch_of_the_National_Study_on_the_Digital_Skills_Gap_in_the_ICT_Sector) says the study compares skills taught with skills required by the ICT labour market.
- Jordan's Ministry of Digital Economy and Entrepreneurship has highlighted advanced digital skills, digital jobs, private/public partnerships, and readiness for AI as strategic priorities. Source: [MoDEE, Economic Modernisation Vision 2026–2029 update](https://www.modee.gov.jo/En/NewsDetails/%D8%AC%D9%84%D8%B3%D8%A7%D8%AA_%D8%A7%D9%84%D8%B9%D9%85%D9%84_%D8%A7%D9%84%D9%82%D8%B7%D8%A7%D8%B9%D9%8A%D8%A9_%D9%84%D8%B1%D8%A4%D9%8A%D8%A9_%D8%A7%D9%84%D8%AA%D8%AD%D8%AF%D9%8A%D8%AB_%D8%A7%D9%84%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF%D9%8A_20262029_%D8%AA%D8%B3%D8%AA%D8%B9%D8%B1%D8%B6_%D8%A7%D8%B3%D8%AA%D8%B1%D8%A7%D8%AA%D9%8A%D8%AC%D9%8A%D8%A7%D8%AA_%D8%AA%D9%83%D9%86%D9%88%D9%84%D9%88%D8%AC%D9%8A%D8%A7%D8%8C_%D8%A7%D9%84%D8%B5%D8%AD%D8%A9%D8%8C_%D8%A7%D9%84%D9%86%D9%82%D9%84%D8%8C_%D9%88%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D8%A9).

### What Jordan IT roles can involve
- A recent [Royal Jordanian End User Support Agent vacancy](https://careers.royaljordanian.com/en/jordan/jobs/end-user-support-agent-5484433/) describes receiving, logging, categorising, prioritising, tracking and resolving support requests, maintaining records, and monitoring service-level agreements.
- A [ProgressSoft IT Help Desk Technician vacancy](https://www.bayt.com/en/jordan/jobs/it-help-desk-technician-73925067/) describes first-line support, troubleshooting, documenting incidents and routing critical issues.
- These are examples of roles, not a claim that every IT employee has the same workflow.

### University work patterns
- University materials in Jordan refer to academic calendars, coursework, projects, assignments, attendance and exam dates. Examples: [Yarmouk University Student Guide](https://www.yu.edu.jo/studentguideEn/) and [University of Jordan course policy document](https://business.ju.edu.jo/Lists/Courses/Attachments/292/Research%20Methods_1601702%20_2025-2026.pdf).
- These examples support designing around deadlines and study plans, but do not prove that students will pay for a task app.

## Initial personas and product hypotheses

### Persona A — University student
**Likely recurring tasks to support**
- Track assignments, labs, presentations, quizzes and exam dates.
- Break a large project into steps with a realistic study schedule.
- Balance university work with a part-time job, commuting and personal commitments when relevant.
- Plan revision sessions and identify upcoming deadlines.

**Product hypothesis:** The student wants to capture a task quickly in Arabic or English and see what to do today, not configure a complex project-management tool.

**Suggested experience**
- Quick-add by natural language.
- Weekly view organised around exam and submission dates.
- “Plan my study week” flow that proposes sessions but requires confirmation.
- Reminder preferences that can be changed easily.

### Persona B — IT employee
**Likely recurring tasks to support**
- Track tickets, follow-ups, troubleshooting steps and handoffs.
- Prioritise by urgency, business impact and SLA deadline.
- Record what was tried, what fixed the issue, and who needs an update.
- Track deployments, maintenance windows, documentation and recurring checks.

**Product hypothesis:** An IT employee values reliable tracking, clear ownership and concise status summaries more than a generic motivational assistant.

**Suggested experience**
- Capture an issue or follow-up in one sentence.
- Fields for priority, due time, status, owner and next action.
- Daily summary of overdue and high-priority work.
- Templates for support, development, QA, cloud and cybersecurity tasks, selected by role.

**Safety boundary:** The first release should help organise and draft work. It should not automatically change production systems, close real tickets, or send messages without explicit approval and appropriate integrations.

### Persona C — Student and employee
A combined profile should support both study and work lists, with one daily view that prevents deadlines from being hidden across separate tools.

## Localisation principles to test
- Arabic and English input; allow Arabizi later only if interviews show demand.
- Simple language and short interactions, especially on mobile.
- Dates and times displayed clearly in the user's chosen locale.
- User-configurable workdays, shifts, reminders and time zone.
- Never assume every Jordanian user follows the same work schedule or prefers Arabic.

## What we should build next
1. Keep the audience selector and role-specific suggested tasks in the MVP.
2. Ask early testers to pick their profile and use the app for one week.
3. Interview at least 5 students and 5 IT employees before expanding the feature set.
4. Ask each person to show how they currently track tasks and describe the last task they forgot or delayed.
5. Measure activation, tasks created, tasks completed, repeated weekly use, and whether the user would pay. Do not infer willingness to pay from compliments.
6. Prioritise only the top recurring pain point shared by interviews and usage evidence.

## Interview prompts
- Show me how you currently track your tasks and deadlines.
- What was the last task you forgot, delayed or had to chase someone about?
- What information do you need to decide what to do next?
- Which tools do you already use, and what do you dislike about them?
- What would make you trust an assistant's suggestion? What should always require confirmation?
- Would you pay for a tool that solves this specific problem? What would it replace?

## Current MVP status
The profile selector and example prompts are lightweight presets, not a validated user model and not AI-generated recommendations. Natural-language parsing is still a local rules-based prototype. Real AI, accounts, cloud storage, notifications and integrations remain future work.
