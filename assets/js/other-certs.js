document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('toggleOtherCerts');
    const list = document.getElementById('otherCertsList');
    if (!btn || !list) return;

    const API_URL = 'https://api.github.com/repos/Kaustubhwagh001/portfolio/contents/assets/docs/other-certifications';
    let loaded = false;

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    btn.addEventListener('click', async () => {
        const isVisible = list.style.display !== 'none';
        if (isVisible) {
            list.style.display = 'none';
            btn.textContent = 'Other Certifications';
            return;
        }

        list.style.display = 'grid';
        btn.textContent = 'Hide Other Certifications';

        if (loaded) return;
        loaded = true;

        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('fetch failed');
            const files = await res.json();
            const pdfs = Array.isArray(files)
                ? files.filter(f => f.type === 'file' && /\.pdf$/i.test(f.name))
                : [];

            if (pdfs.length === 0) {
                list.innerHTML = '<p class="muted">More certifications coming soon.</p>';
                return;
            }

            list.innerHTML = pdfs.map(f => {
                const title = f.name.replace(/\.pdf$/i, '');
                return `<article class="project-card"><h3>${escapeHtml(title)}</h3><p><a href="${f.download_url}" target="_blank">View certificate</a></p></article>`;
            }).join('');
        } catch (err) {
            list.innerHTML = '<p class="muted">More certifications coming soon.</p>';
        }
    });
});
