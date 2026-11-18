# Fluent Minds 

A blog website that helps people who stutter.

🌐 **Live site:** [fluent-minds.netlify.app](https://fluent-minds.netlify.app)

Built with HTML, CSS, and JavaScript. Hosted on Netlify.

## Guides and downloads

The site remains buildless HTML/CSS/JavaScript. Shared UI styles and behavior live in `assets/site.css` and `assets/site.js`.

- `daily-practice.html`: participation goals and a local text-file speaking plan.
- `supporting-someone.html`: listening, classroom, and meeting guidance.
- `finding-support.html`: choosing professional care and peer support.
- `downloads/`: three printable PDFs and an editable CSV tracker, linked from Resources.

Run a preview with `python -m http.server 8766`. Contact submissions require Netlify Forms on a deployed site. Local preview will report submission failure and retain the message. No subscription service is configured; the former simulated signup is replaced with links to useful resources.

New educational guides link to ASHA and the Stuttering Foundation. Content and the existing articles should receive review by a qualified speech-language professional before being presented as clinical guidance.

## Expanded resource library (18 November 2026)

- 20 new educational articles; 26 public articles and guides in total. `blog.html` has combined search and topic filters, URL-based topic/search links, result counts, reset, and an empty state.
- `bangladesh-therapy.html` has 14 service locations/departments: 11 CRP regional contacts, Evercare Dhaka rehabilitation and child development services, and Square CDC. Each has official-source, telephone, and map links. Listings are leads, not endorsements or confirmed appointments; visitors must confirm stuttering experience, age suitability, fees, and sessions directly.
- `resources.html` includes 12 external reading/community resources and eight direct downloads, including four editable text worksheets. External information was checked on 18 November 2026.
- Older technique articles retain their URLs and anchor IDs, with revised educational language, source links, related guides, and print buttons. Inactive newsletter widgets were removed.
- Netlify Forms processing is enabled for the existing `contact` form. Native submissions use `contact-success.html`; JavaScript submissions have a timeout, honest status messages, and retained input on delivery failure. No email subscription service is configured.

### Content maintenance and checks

All public pages are pre-rendered HTML and usable without a content API or sign-in. No dependency install or build command is required to deploy.

1. Edit `content/articles.json` or the directory/resource definitions in `scripts/build_content.py`.
2. Run `python scripts/build_content.py` to render article, directory, resources, and blog pages and refresh the sitemap. Provider/resource JSON files are generated reference data.
3. Run `python scripts/check_site.py` to verify local targets, fragments, assets, and button handlers. Add `--external` to check all educational/provider web destinations using HTTP requests.
4. Run `node --check assets/site.js` and `node scripts/check_interactions.mjs`, then inspect changed interactions in a local browser. The interaction checks use local fixtures and send no messages.
5. Batch all changes into one commit and one push to `main`. The connected Netlify site automatically creates the production deployment; do not also run a manual deployment.

The `.netlify/` CLI state and local preview output are ignored. Guides are not clinically reviewed and do not promise a cure, fixed improvement timeline, or specific service availability.
