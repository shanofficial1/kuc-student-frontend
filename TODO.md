# TODO

- [ ] Update `src/pages/forms/FinalReviewForm.jsx` to convert these sections to strict diff-only rendering:
  - [ ] Family
  - [ ] Education
  - [ ] Residential
  - [ ] Financial
  - [ ] Professional
  - [ ] Documents
  - [ ] Mentor
- [ ] Ensure each target section uses exact gating pattern:
  - [ ] `hasAnyChanges("<section>")`
  - [ ] `sectionDiffs.<section>`
  - [ ] field-by-field conditional rendering
- [ ] Remove all fallback/placeholder rendering in those sections:
  - [ ] Remove `value || "Not provided"`
  - [ ] Remove `field ? field : "Not provided"`
  - [ ] Remove `No Preview Available` placeholder cards for unchanged documents
  - [ ] Remove empty-state components and default object dumps
- [ ] Ensure nested objects and arrays render only changed properties/items.
- [ ] Verify visually:
  - [ ] Only changed sections/cards appear
  - [ ] Only changed fields/properties appear
  - [ ] No unchanged fields/items render
- [ ] Run build/lint/tests to ensure JSX compiles.

