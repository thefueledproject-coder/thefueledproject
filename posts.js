// Loads posts.json and renders post cards.
// To add a new post: open posts.json and add one object to the array.
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
  const map = { RUN: 'tag-run', MOBILITY: 'tag-mobility', FUEL: 'tag-fuel', LIFE: 'tag-life' };
  return map[tag] || 'tag-life';
}

function renderPostCard(post) {
  return `
    <div class="post-card" data-tag="${post.tag}">
      <div class="post-meta"><span>${post.tag}</span><span>${post.meta}</span></div>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
    </div>`;
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
