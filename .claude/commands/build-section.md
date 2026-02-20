Build the $ARGUMENTS section of the AEI home page.

Before writing any code:
1. Read `docs/AEI_Website_Design_Document_v2.md` and find the specification for this section
2. Read `theme.json` for the current design tokens
3. Check `frontend/components/` for any existing components you can reuse

When building:
- Create the component in the appropriate `frontend/components/` subfolder
- Use only Tailwind token classes from our theme — no hardcoded colors
- Include loading, error, and empty states where applicable
- Respect `prefers-reduced-motion`
- Test responsiveness at mobile (< 768px), tablet (768–1024px), and desktop (> 1024px)
- Add the section to the home page in `frontend/app/page.tsx`