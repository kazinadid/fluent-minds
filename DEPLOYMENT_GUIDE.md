# 🚀 Fluent Minds — Deployment Guide
## Deploy to Netlify (Free) + Admin Access Setup

---

## STEP 1: Create a GitHub Repository

1. Go to https://github.com and sign in (or create a free account)
2. Click the **+** icon → **New repository**
3. Name it: `fluent-minds`
4. Set it to **Public** (required for free Netlify deployment)
5. Click **Create repository**
6. Upload all the files from this folder to the repo:
   - Click **uploading an existing file**
   - Drag and drop all files/folders from this package
   - Click **Commit changes**

---

## STEP 2: Deploy to Netlify

1. Go to https://netlify.com and sign up for a free account (use your GitHub to sign in)
2. Click **Add new site** → **Import an existing project**
3. Click **Deploy with GitHub**
4. Select your `fluent-minds` repository
5. Build settings:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.` (a single dot)
6. Click **Deploy site**

✅ Your site will be live in ~30 seconds at a URL like `https://random-name-123.netlify.app`

**Customize your URL:**
- Go to **Site settings** → **Domain management** → **Options** → **Edit site name**
- Set it to something like `fluent-minds` → your URL becomes `fluent-minds.netlify.app`

---

## STEP 3: Enable Admin Access (Netlify Identity + Decap CMS)

### A. Enable Netlify Identity
1. In your Netlify dashboard, go to **Site settings** → **Identity**
2. Click **Enable Identity**
3. Under **Registration preferences**, select **Invite only**
   *(This means only you can have admin access)*
4. Scroll down to **Git Gateway** → click **Enable Git Gateway**

### B. Invite Yourself as Admin
1. Go to **Identity** tab in your Netlify dashboard
2. Click **Invite users**
3. Enter your email address
4. Check your email and click the invite link
5. Set your admin password

### C. Access the Admin Panel
1. Go to: `https://your-site.netlify.app/admin`
2. Log in with the email and password you just set
3. You now have a full admin CMS panel to:
   - **Write new blog posts** with a rich text editor
   - **Set categories, read time, featured images**
   - **Save drafts** before publishing
   - **Edit or delete existing posts**

---

## STEP 4: Update the Config File

Open `admin/config.yml` and replace the two placeholder URLs:

```yaml
site_url: https://YOUR-SITE.netlify.app
display_url: https://YOUR-SITE.netlify.app
```

With your actual Netlify URL, e.g.:
```yaml
site_url: https://fluent-minds.netlify.app
display_url: https://fluent-minds.netlify.app
```

Commit this change to GitHub — Netlify will auto-redeploy.

---

## STEP 5: (Optional) Connect a Custom Domain

If you have a domain like `fluentminds.org`:
1. Go to **Site settings** → **Domain management** → **Add domain**
2. Enter your domain name
3. Follow the instructions to update your domain's DNS settings
4. Netlify provides a free SSL certificate automatically

---

## SITE STRUCTURE

```
fluent-minds/
├── index.html          ← Homepage
├── blog.html           ← Blog listing
├── about.html          ← About page
├── contact.html        ← Contact page
├── resources.html      ← Resources page
├── netlify.toml        ← Netlify config
├── admin/
│   ├── index.html      ← Admin CMS panel
│   └── config.yml      ← CMS configuration
└── posts/
    ├── 2025-01-05-science-of-confident-speaking.md
    └── 2024-12-10-breathing-exercises.md
```

---

## WRITING BLOG POSTS

### Via Admin Panel (Recommended)
1. Go to `/admin` on your live site
2. Log in
3. Click **Blog Posts** → **New Blog Post**
4. Fill in: Title, Category, Excerpt, Body (rich text editor)
5. Click **Publish** (or **Save Draft** to keep it private)
6. Netlify will auto-rebuild your site in ~60 seconds

### Via GitHub (Direct)
1. Create a new `.md` file in the `/posts` folder
2. Copy the format from existing posts
3. Commit — Netlify auto-deploys

---

## NEED HELP?

- Netlify docs: https://docs.netlify.com
- Decap CMS docs: https://decapcms.org/docs
- Netlify Identity: https://docs.netlify.com/visitor-access/identity/
