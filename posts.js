// Loads posts.json and renders post cards + full post pages.
// To add a new post: open posts.json and add one object to the array
// (include a unique "slug" and a "content" array of paragraph strings).
// No other file needs to change.

async function loadPosts() {
  try {
    const res = await fetch('posts.json');
    if (!res.ok) throw new Error('Could not load posts.json');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function tagClass(tag) {
  const map = { RUN: 'tag-run', LIFT: 'tag-lift', MOBILITY: 'tag-mobility', FUEL: 'tag-fuel', LIFE: 'tag-life' };
  return map[tag] || 'tag-life';
}

function renderPostCard(post) {
  return `
    <a href="post.html?slug=${encodeURIComponent(post.slug)}" style="text-decoration:none;color:inherit;">
      <div class="post-card" data-tag="${post.tag}">
        <div class="post-meta"><span>${post.tag}</span><span>${post.meta}</span></div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
      </div>
    </a>`;
}

// Homepage: show latest 3 posts
async function renderLatest(targetId, count = 3) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const posts = await loadPosts();
  const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  el.innerHTML = sorted.slice(0, count).map(renderPostCard).join('') ||
    `<div class="empty-state">No entries yet. First one's coming soon.</div>`;
}

// Log page: full list + filter chips
async function renderLog(targetId, filterBarId) {
  const el = document.getElementById(targetId);
  const bar = document.getElementById(filterBarId);
  if (!el) return;
  const posts = await loadPosts();
  const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  function draw(filter) {
    const filtered = filter === 'ALL' ? sorted : sorted.filter(p => p.tag === filter);
    el.innerHTML = filtered.map(renderPostCard).join('') ||
      `<div class="empty-state">Nothing tagged ${filter} yet.</div>`;
  }

  if (bar) {
    bar.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        bar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        draw(chip.dataset.filter);
      });
    });
  }

  draw('ALL');
}

// Individual post page: reads ?slug= from the URL and renders the full article
async function renderPost(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const posts = await loadPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    el.innerHTML = `<div class="empty-state">Couldn't find that entry. <a href="log.html" style="color:var(--ember-deep);">Back to the Log &rarr;</a></div>`;
    document.title = "Not found — The Fueled Project";
    return;
  }

  document.title = post.title + " — The Fueled Project";
  var descTag = document.querySelector('meta[name="description"]');
  if (descTag) descTag.setAttribute('content', post.excerpt);
  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', post.excerpt);
  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', post.title + " — The Fueled Project");

  const dateStr = new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const bodyHtml = (post.content || []).map(p => `<p style="margin-bottom:18px;">${p}</p>`).join('');

  el.innerHTML = `
    <div class="post-meta" style="margin-bottom:10px;">
      <span class="pillar-tag ${tagClass(post.tag)}" style="margin-bottom:0;">${post.tag}</span>
      <span class="fp-date">${dateStr} &middot; ${post.meta}</span>
    </div>
    <h1 style="font-size:clamp(28px,4.2vw,44px);color:var(--forest-deep);max-width:22ch;margin-bottom:24px;">${post.title}</h1>
    <div style="font-size:16px;color:var(--ink-soft);max-width:64ch;line-height:1.7;">${bodyHtml}</div>
    <a href="log.html" class="mono" style="display:inline-block;margin-top:24px;font-size:13px;letter-spacing:0.06em;color:var(--ember-deep);">&larr; BACK TO THE LOG</a>
  `;
}
