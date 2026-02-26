# Session 3: Styling, Lead Capture & Polish Implementation Plan

For the final session of the Sovereign Retirement Reality Check™ (RRI) application, we will focus on polishing the UI to ensure a premium, trustworthy design, refining the results logic, and embedding the consultation scheduling widget.

## Proposed Changes

### 1. Premium UI Styling (Tailwind CSS)
- **Design System:** Review and enhance the `tailwind.config.ts` (if needed) and [globals.css](file://wsl$/Ubuntu/home/edwar/rri/frontend/src/app/globals.css) to ensure a cohesive color palette (deep blues, slates, emeralds) and modern typography (Inter).
- **Component Polish:** Add subtle micro-interactions to the `QuestionCard` buttons using Framer Motion (hover states, click animations) to make the app feel dynamic and responsive.
- **Responsive Design:** Ensure the lead capture form and results page look excellent on mobile devices.

### 2. Results & Lead Capture Logic
- **Refinement:** The core lead capture logic and Results Archetype rendering is already implemented in [page.tsx](file://wsl$/Ubuntu/home/edwar/rri/frontend/src/app/page.tsx).
- **Scheduling Widget:** We will embed a scheduling widget (e.g., Calendly or SavvyCal) onto the Results page, allowing users in the "Highly Fragile" or "Vulnerable" brackets to immediately book a "Sovereign Blueprint" consultation call. For now, we will use a dummy/placeholder embed code that can easily be swapped by the user.

### 3. End-to-End Testing & Polish
- Ensure the application builds successfully (`npm run build`).
- Verify that the API endpoint is correctly referenced from the `.env` file.

## Verification Plan
### Automated Tests
- The Next.js build process acts as a final TypeScript and ESLint verification step.

### Manual Verification
- We will ask the user to start their local development server (`npm run dev`) and complete a test run of the assessment in their browser.
- Verify the lead capture form functions correctly and the scheduling widget appears on the final results screen.
