# Platform Integrity & Learning Enforcement Recommendations

## Status Legend
- ⬜ Pending
- 🔄 In Progress
- ✅ Done

---

## 1. Strengthen Learning Integrity

### 1.1 ✅ Time-on-Page Tracking
Minimum read time before Mark Complete activates. If a student spends 8 seconds on a lesson and clicks Next, that's not learning.
- Set a minimum time per page based on content length
- Mark Complete button stays disabled until minimum time is met
- Show a countdown timer so students know how long is left

### 1.2 ✅ Randomise Exam Questions
The exam is the same 60 questions in the same order every time. Students will share answers.
- Shuffle question order per attempt
- Shuffle option order per question per attempt
- Draw a random subset (e.g. 30 of 60) per attempt

### 1.3 ✅ Exam Attempt Cooldown
Nothing stops a student from retrying the exam immediately after failing.
- Failed attempts trigger a 24-hour cooldown
- Cooldown stored in DB and checked on exam load
- Admin can override/reset cooldown if needed

### 1.4 ⬜ Code Similarity Detection
Beyond paste detection, if two students submit identical code flag it for admin review.
- Hash submitted solutions on pass
- Compare hashes across students per challenge
- Flag duplicates in admin dashboard for review

---

## 2. Strengthen Certificate Value

### 2.1 ✅ Certificate Verification URL
Add a unique verification link to every certificate that employers can visit to confirm it's real.
- Generate a unique verification token per student per platform
- Public page at `/verify/[token]` showing name, program, date
- Print the URL on the certificate itself

### 2.2 ⬜ Certificate Name Lock Audit Trail
Once downloaded, name changes should have a formal admin approval trail.
- Log every name change request with timestamp and reason
- Admin sees full history before approving
- Already partially implemented — needs audit log table

---

## 3. Engagement & Accountability

### 3.1 ⬜ Weekly Progress Emails
Automated Sunday email showing each student their % completion and what's left.
- Cron job every Sunday
- Personalised email with progress bar, modules left, encouragement
- Only send to students below 100% completion

### 3.2 ⬜ Cohort Leaderboards
Anonymous ranking within a cohort drives healthy competition.
- Show rank within cohort on student dashboard
- Anonymous (show initials or first name only)
- Based on completion % and last active date

### 3.3 ⬜ Supervisor Inactivity Alerts
Supervisors should see when students haven't logged in for 7+ days.
- Flag inactive students (7+ days) in supervisor dashboard
- Optional email alert to supervisor when student goes inactive
- Already have lastActive — just needs UI surfacing

---

## 4. Platform Trust

### 4.1 ✅ Academic Integrity Agreement
A checkbox students must agree to on first login.
- "I agree to complete all work myself and not use AI or copy from others"
- Stored in DB with timestamp
- Cannot access content until agreed

### 4.2 ⬜ Admin Audit Log
Track every certificate unlock, password reset, and admin action with timestamps.
- New `admin_audit_log` table in Supabase
- Log action, admin username, target student, timestamp
- Viewable in admin Settings tab

### 4.3 ⬜ Session Timeout & Device Binding
Students sharing accounts is a real risk. Sessions currently last 8 hours.
- Reduce session to single active session per login_id
- Warn on second login from different device
- Admin can see active sessions per student

---

## Priority Order (Quick Wins First)
1. Randomise Exam Questions (1.2) — highest impact, easiest to implement
2. Time-on-Page Tracking (1.1) — enforces real reading
3. Exam Attempt Cooldown (1.3) — prevents brute forcing
4. Academic Integrity Agreement (4.1) — sets the tone from day one
5. Certificate Verification URL (2.1) — raises employer credibility
6. Weekly Progress Emails (3.1) — drives engagement
7. Supervisor Inactivity Alerts (3.3) — accountability
8. Admin Audit Log (4.2) — transparency
9. Cohort Leaderboards (3.2) — engagement
10. Code Similarity Detection (1.4) — advanced integrity
11. Session Timeout & Device Binding (4.3) — security
12. Certificate Name Lock Audit Trail (2.2) — polish
