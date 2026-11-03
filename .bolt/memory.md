# Project memory

## Product intent & audience

- Educational math app for Dutch- and English-speaking learners.
- Provides exercises, rounds, progress tracking, saved results, and a tangent-line exercise.
- Tangent-line learners select or draw a line and receive feedback on slope accuracy.

## Brand personality & voice

- Clear, instructional, and encouraging.
- Percentage feedback is immediately understandable; Dutch currently leads with equivalent English wording.
- Prefer result phrasing such as `70% goed` and consistent localized equivalents.

## Visual design & UX direction

- Use percentages as the primary display for exercise, round, overview, progress, and saved-result feedback.
- Reuse the same percentage in summaries and progress indicators.
- Make `100% goed` visually distinct as a complete result.
- Clearly label incomplete and not-yet-attempted states.
- Keep raw correct/total counts secondary, if shown.
- Apply the percentage treatment consistently across overview cards, round completion, progress indicators, and persisted results.
- Maintain accessible, consistent formatting in both Dutch and English.

## Decisions, constraints & rationale

- Percentages are the canonical representation of correctness and progress; fractions such as `7/10` must not be the primary display.
- Quiz answers score discretely as 0% or 100%.
- Tangent-line scoring is granular and ranges from 0% to 100%, based on distance from the correct slope; a closer slope receives a higher score.
- Existing stored 0–10 results are retained and safely converted to percentages; new results are stored directly as percentages.
- The old completion boundary of 10 was updated to the percentage boundary of 100.
- Percentage wording and behavior are applied across Dutch and English UI.
- The implementation was checked and builds without errors.

## Open questions & assumptions

- The exact tangent-line distance-to-score formula, tolerance, and behavior at extreme slope differences remain unspecified.
- It remains undecided whether raw counts should appear outside secondary/detail views.
- Assumption: legacy stored scores follow the prior 0–10 format and can be converted without loss; unusual or malformed historical values may still need fallback handling.