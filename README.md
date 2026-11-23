# Little Mountain Voices website

Public website for Little Mountain Voices, a pediatric speech therapy practice (Spokane Valley, WA to Coeur d'Alene, ID). Served by GitHub Pages at littlemountainvoices.com.

## Rules for anyone editing this site
- Brand: Pine #1F5D4C, Lake #2E6F9E, Meadow #8CC2A0, Sky #BCDCEC, Sky tint #DCEEF5, Snow #F7FAF8, Ink #16302B. Fonts: Fredoka (headings), Nunito (body).
- Never put "PLLC" on the site. It belongs on legal paperwork only.
- Do not describe Kodee as licensed in Washington or Idaho until each license is issued.
- No prices on the site. Prices are shared by phone or email.
- Insurance wording, used everywhere (site, flyers, social, catalog): "We do not currently take insurance. We can give you an itemized receipt (called a superbill) to send to your insurance yourself. We're also looking into accepting HSA/FSA funds." Update the HSA/FSA part once approval is settled.
- No photos, names or stories of client children without written parent permission.
- No ad trackers or analytics that collect personal information.
- Clinical content (the parent guide) must be reviewed by Kodee before it is published.

## How the site is built
- `index.html` holds all seven pages (home, what to look for, services, how it works, meet Kodee, questions, interest list). The address after `#` picks which one shows, for example `littlemountainvoices.com/#services`.
- `assets/site.js` runs the page switching, the age trail, the service-area map, the opening countdown chip and the form checks.
- The opening countdown counts to 1 August 2027. Change `new Date(2027,7,1)` in `assets/site.js` if the date moves (months count from 0, so 7 is August).
- The interest list form is switched off (`inert` and `is-soon` on the form in `index.html`) until it is connected to Google Workspace. To turn it on, remove both, remove the "Online sign-up opens soon" note, and send the answers somewhere real.
- Fredoka and Nunito are variable fonts served from `assets/fonts/`, one file each. Don't link Google Fonts: visitors' browsers shouldn't contact Google.
- The Content-Security-Policy in `index.html` only allows scripts from this site. Don't add inline scripts or outside script hosts.
