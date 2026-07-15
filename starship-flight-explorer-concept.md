# Starship Flight Explorer — Concept Brief

## What it is
A single-page visual showcase of Starship's flight test history (IFT-1 through the latest), letting someone browse each flight and see how the program progressed.

## Core idea
Progression, not simulation. The story worth telling isn't "where is the rocket right now," it's "how far did each flight get, and how did that change over time." That's a visual doable in 2 hours; live tracking isn't.

## Primary view
A horizontal timeline, one flight per column/card, ordered IFT-1 to latest. Each card shows:
- Flight number, date, vehicle block (V1/V2/V3)
- Outcome (color-coded: success / partial / failure)
- How far it got: liftoff → stage separation → booster catch → ship reentry → splashdown, shown as a stage tracker with each stage lit up green/red depending on what happened

## Secondary interaction
Click a card to expand into detail: what happened, key milestone, one-line summary.

## Visual style
Dark, space-themed background. Clear left-to-right timeline that reads as "the program getting better over time." Think mission-control dashboard, not a literal map.

## Explicitly out of scope
Actual geographic maps, live trajectories, real coordinates. Static, data-driven storytelling piece only.

## Open decisions

1. **Flight count** — all ~13 (IFT-1 through latest Block 3 flight) vs. a curated subset (first, key milestones, most recent).
2. **Stage tracker granularity** — simple 3-stage (liftoff / separation / landing) vs. richer 5-6 stage (liftoff, max-Q, separation, boostback/catch, ship coast, reentry, splashdown).
3. **Scope confirmation** — full spectrum timeline (leaning yes) vs. single flight deep-dive.
4. **Data format for Cursor** — hand it a pre-built JSON array of flights so Plan Mode just wires UI, vs. let it generate placeholder data to fill in later. Pre-built JSON is safer for a 2-hour clock.

## Recommendation
All ~12-13 flights, 5-stage tracker, full spectrum timeline, pre-built JSON data handed to Cursor upfront.
