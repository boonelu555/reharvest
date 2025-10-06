# reharvest

## overview

reharvest connects surplus food from local businesses to nearby consumers. providers can create a listing in seconds by uploading a photo; our in‑browser ai fills in a clean title, category, and short menu‑style description. consumers browse nearby items, get directions with google maps, and claim food with live quantity updates. expired items are automatically disabled and greyed out.

## features

- provider flow
  - upload a photo → ai auto‑fills title, category, and description (tensorflow.js mobilenet in the browser)
  - set quantity, pickup location, and an "available until" time
  - publish instantly

- consumer flow
  - see available listings in a clean card layout
  - open directions in google maps via the navigate button
  - claim items with a confirmation dialog
  - quantity updates live; when it reaches 0, the listing disappears
  - if time has passed, the card shows an "expired" badge and actions are disabled

- reliability & security
  - supabase for auth, database (postgres), and storage
  - row level security (rls) to protect user data
  - environment variables kept out of git (use .env)

## tech stack

- react + vite + typescript
- tailwind css + shadcn‑ui components
- supabase (auth, postgres, storage)
- tensorflow.js (mobilenet) for client‑side image classification

## getting started

### prerequisites

- node 18+ and npm
- a supabase project (url + anon/publishable key)
- a google maps api key (for navigation links; embedded map optional)

### setup

```bash
git clone <your_repo_url>
cd reharvest-van-connect
npm install

# create a .env file in the project root
cat > .env << 'EOF'
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EOF

# start the dev server
npm run dev
```

open the local url printed in the terminal (usually http://localhost:8080 or 8081).

## using the app

### as a provider
1. sign in / sign up as a provider.
2. click "create listing".
3. upload a food photo and press "auto‑fill with ai".
   - the browser runs tensorflow.js mobilenet to classify the image and generate a menu‑style description (no percentages shown).
4. set quantity, pickup location, and available‑until time.
5. publish.

### as a consumer
1. sign in as a consumer.
2. browse the card list of available food near vancouver.
3. click "navigate" to open directions in google maps.
4. click "claim" → confirm in the dialog.
   - the app creates a claim and decrements quantity live.
   - when quantity reaches 0, the listing disappears.
5. expired items are greyed out, show an "expired" badge, and cannot be claimed.

## scripts

```bash
npm run dev       # start local dev server
npm run build     # production build
npm run preview   # preview the production build locally
```

## configuration

set these environment variables in `.env`:

- `vite_supabase_url` – your supabase project url
- `vite_supabase_publishable_key` – your supabase anon/publishable key
- `vite_google_maps_api_key` – your maps api key

## data model (simplified)

- `profiles` – user profiles (provider/consumer)
- `food_listings` – title, description, category, quantity, pickup_location, available_until, image_url, status
- `claims` – who claimed which listing and when

## ai details

- runs completely in the browser (tensorflow.js + mobilenet)
- maps predictions to app categories and generates a short menu‑style description from the top class
- avoids exposing confidence percentages for a cleaner ux

## troubleshooting

- authentication issues: ensure `vite_supabase_url` and `vite_supabase_publishable_key` are present and correct.
- navigation: the "navigate" button opens google maps with the pickup location query.
- expired items: if a card shows expired, the time has passed; actions are disabled by design.

## roadmap

- embedded map with geocoding + clustering and live user location
- push/email notifications for new or expiring items
- provider analytics (waste diverted, pickup rate)
- reservation windows, qr/otp pickup verification, no‑show protection
- in‑app messaging between providers and consumers
- bulk uploads, recurring schedules, and inventory integrations
- fine‑tuned food model and allergen/dietary tags

## license

mit
