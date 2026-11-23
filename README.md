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

## How the page is built
- `index.html` is the whole page. `assets/site.js` adds the opening countdown and the map pin animation; the page still reads fine without it.
- The countdown counts to 1 August 2027, midnight Pacific. Change `OPENING` in `assets/site.js` if the date moves.
- Fredoka and Nunito are variable fonts: one file each in `assets/fonts/` covers every weight.
- The Content-Security-Policy in `index.html` only allows scripts from this site. Don't add inline scripts or outside script hosts.
