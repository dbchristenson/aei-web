Create a new Insights article about: $ARGUMENTS

1. Create an MDX file in `frontend/content/insights/` with proper frontmatter (title, slug, date, category, excerpt, coverImage, author)
2. If analysis data is needed, create a Python script in `analysis/` that uses `aei_theme.py` for theming and exports JSON to `frontend/public/data/insights/`
3. Use `<InsightChart />` components inline for any data visualizations
4. Follow the MDX + Plotly pipeline documented in `docs/DESIGN.md` Section 3.4