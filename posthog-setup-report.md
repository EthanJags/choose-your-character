<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 16 (App Router) portfolio site. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), which enables automatic pageview tracking, session replay, exception capture, and the reverse proxy through Next.js rewrites. Eight custom events were instrumented across six files to capture the full user journey — from landing on the character selection screen, through picking a character and entering their world, to scrolling through projects and clicking external links.

| Event | Description | File |
|---|---|---|
| `character_selected` | User selects a character from the stage selection screen (click or keyboard) | `app/components/StageSelectionScreen.tsx` |
| `about_tab_viewed` | User switches to the About tab on the stage selection screen | `app/components/StageSelectionScreen.tsx` |
| `character_title_entered` | User clicks "Click to enter" to proceed from the title screen to the projects screen | `app/components/TitleScreen.tsx` |
| `project_slide_viewed` | User navigates to a specific project slide in the projects screen | `app/components/ProjectsScreen.tsx` |
| `project_link_clicked` | User clicks a demo or devpost external link from the projects screen | `app/components/ProjectsScreen.tsx` |
| `project_detail_opened` | User clicks through to the project detail page | `app/components/ProjectsScreen.tsx` |
| `project_external_link_clicked` | User clicks a demo or devpost link from the project detail page | `app/project/[characterSlug]/[projectSlug]/ProjectExternalLinks.tsx` |
| `sound_toggled` | User toggles sound on or off | `app/components/SoundToggle.tsx` |

**Files created/modified:**
- `instrumentation-client.ts` — PostHog SDK initialization (new file)
- `next.config.ts` — Added reverse proxy rewrites and `skipTrailingSlashRedirect`
- `.env.local` — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`
- `app/components/StageSelectionScreen.tsx` — Added `character_selected` and `about_tab_viewed` events
- `app/components/TitleScreen.tsx` — Added `character_title_entered` event
- `app/components/ProjectsScreen.tsx` — Added `project_slide_viewed`, `project_link_clicked`, `project_detail_opened` events
- `app/components/SoundToggle.tsx` — Added `sound_toggled` event
- `app/project/[characterSlug]/[projectSlug]/ProjectExternalLinks.tsx` — New client component for tracking external link clicks on project detail pages
- `app/project/[characterSlug]/[projectSlug]/page.tsx` — Updated to use `ProjectExternalLinks` component

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/341504/dashboard/1358707)
- **Insight**: [Character Selection Funnel](https://us.posthog.com/project/341504/insights/xKuiFgCt) — Conversion funnel from character selection → title screen → project view
- **Insight**: [Engagement: Character Selections & Project Link Clicks](https://us.posthog.com/project/341504/insights/RBdpCZPD) — Daily trend of visits, engagement, and click-throughs
- **Insight**: [Most Popular Characters](https://us.posthog.com/project/341504/insights/6S08wcwI) — Which character gets selected most (broken down by slug)
- **Insight**: [About Tab & Sound Toggle Activity](https://us.posthog.com/project/341504/insights/PQftjkYm) — Weekly trend of secondary feature interactions

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
