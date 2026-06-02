# DECISIONS.md

## Why this stack?

**React + Express + MongoDB** was the natural choice for this project.

React gives a clean component model that maps perfectly to this app's structure — a login page, an admin view, a student view. State management with Context API was sufficient without needing Redux or any external library, keeping the codebase lean.

Express is minimal and unopinionated which meant I could structure the API exactly how I wanted — clean route files, a single reusable auth middleware, clear separation between concerns.

MongoDB fits because the data model here is document-oriented by nature — events, users, registrations are all self-contained objects with simple relationships. Mongoose made schema validation clean and the populate() method handled joins elegantly.

---

## One decision not in the brief

**A dedicated API layer in `src/api/index.js`**

The brief required try-catch on every fetch call but didn't specify where those calls should live. I centralised every single fetch function into one file rather than writing fetch calls directly inside components.

This means if the backend URL changes, I change one constant. If I want to add a header to every request, I change one function. Components stay clean — they just call `getEvents()` or `registerForEvent()` without knowing anything about HTTP.

This pattern is standard in production React codebases and made the code significantly easier to reason about and debug.

---

## One thing I'd improve with more time

**Optimistic UI updates on registration**

Currently when a student clicks Register, the app waits for the API response and then refetches all events. With more time I'd implement optimistic updates — immediately update the UI as if the registration succeeded, then roll back if the API returns an error.

This would make the app feel significantly snappier, especially on slower connections, and is the pattern used by apps like Twitter and Notion for instant-feeling interactions.

---

## Duplicate registration — a two layer approach

Preventing a student from registering twice was handled at two levels deliberately.

At the database level, the Registration model has a unique compound index on the
student and event fields together. This means MongoDB will physically reject any
duplicate combination at the database layer — even if two requests came in simultaneously.

At the UI level, once a student registers for an event, the Register button changes
to show "✓ Registered" but remains clickable. If clicked again, it immediately shows
a clear error message: "You have already registered for this event." This satisfies
the requirement of showing a clear error on duplicate attempts rather than silently
failing or hiding the option entirely.

And if the API is somehow called again directly, the backend catches the duplicate
key error from MongoDB and returns a clear 400 response. All three layers work
together so the requirement is airtight.