(function () {
  var list = document.getElementById('releases-list');
  var status = document.getElementById('releases-status');
  var more = document.getElementById('releases-more');
  var page = 1;

  function loadReleases() {
    more.disabled = true;
    status.textContent = 'Loading releases…';
    fetch('https://api.github.com/repos/ZenkaiPower/DBZSM-ZenkaiPower/releases?per_page=10&page=' + page)
      .then(function (response) {
        if (!response.ok) throw new Error('Releases unavailable');
        return response.json();
      })
      .then(function (releases) {
        releases.filter(function (release) { return !release.draft; }).forEach(function (release) {
          var details = document.createElement('details');
          details.className = 'release-entry';
          details.open = list.children.length === 0;
          var summary = document.createElement('summary');
          summary.textContent = release.name || release.tag_name;
          if (release.prerelease) summary.append(' (Pre-release)');
          details.appendChild(summary);

          var meta = document.createElement('p');
          meta.className = 'release-meta';
          if (release.published_at) {
            var time = document.createElement('time');
            time.dateTime = release.published_at;
            time.textContent = new Date(release.published_at).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric'
            });
            meta.appendChild(time);
            meta.append(' · ');
          }
          var link = document.createElement('a');
          link.href = 'https://github.com/ZenkaiPower/ZenkaiPower/releases/tag/' + encodeURIComponent(release.tag_name);
          link.textContent = 'View release and downloads';
          meta.appendChild(link);
          details.appendChild(meta);

          var notes = document.createElement('div');
          notes.className = 'release-notes';
          notes.textContent = release.body || 'No release notes provided.';
          details.appendChild(notes);
          list.appendChild(details);
        });
        page++;
        more.hidden = releases.length < 10;
        status.textContent = list.children.length ? '' : 'No published releases yet.';
      })
      .catch(function () {
        status.textContent = 'Unable to load releases. Try again or view the release notes on GitHub.';
        more.textContent = 'Try again';
        more.hidden = false;
      })
      .finally(function () {
        more.disabled = false;
      });
  }

  more.addEventListener('click', function () {
    more.textContent = 'Load older releases';
    loadReleases();
  });
  loadReleases();
})();
