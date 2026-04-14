## MODIFIED Requirements

### Requirement: All text inputs suppress iOS zoom
Every `<input>`, `<textarea>`, and `<select>` element in the app SHALL render at a minimum font size of 16px so that iOS Safari does not zoom the viewport on focus. This applies globally, not only to the set-logger inputs.

The CSS rule SHALL use `!important` to guarantee the 16px minimum is not overridden by component-level Tailwind utility classes (e.g. `text-sm`).

#### Scenario: No zoom on exercise name input focus
- **WHEN** user taps the exercise name input field
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on training plan name input focus
- **WHEN** user taps a training plan name input field
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on muscle group name input focus
- **WHEN** user taps a muscle group name input field
- **THEN** the viewport does not zoom in

#### Scenario: Tailwind text-sm class does not override zoom prevention
- **WHEN** an input has the `text-sm` Tailwind class applied
- **THEN** the effective font size is still at least 16px and iOS does not zoom on focus
