// Numen page templates: ecosystem.js
function productGrid(){return `<div class="filter-row">${['All',...new Set(products.map(p=>p.category))].map(x=>`<button class="filter ${filter===x?'active':''}" data-filter="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="feature-grid">${products.filter(p=>filter==='All'||p.category===filter).map(p=>card(p.name,p.description,p.url,p.status,p.icon)).join('')}</div>`}

function teamDirectory() {
  const initials = name =>
    Array.from(name.trim()).slice(0, 2).join('').toUpperCase();

  const telegramLink = url => url
    ? `<a class="team-social-link"
          href="${esc(url)}"
          target="_blank"
          rel="noopener noreferrer">
          Telegram ↗
       </a>`
    : '';

  const discordLabel = username => username
    ? `<span class="team-social-link"
             title="Discord username">
          Discord: ${esc(username)}
       </span>`
    : '';

  const personCard = person => `
    <article class="team-card team-card-${esc(person.id)}">
      <div class="team-avatar" aria-hidden="true">
        ${person.avatar
          ? `<img src="${esc(person.avatar)}" alt="" loading="lazy">`
          : `<svg class="team-illustration" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="48" fill="var(--avatar-bg,#e8e1fb)"/><path d="M16 93c1-21 15-33 34-33s33 12 34 33" fill="var(--avatar-shirt,#7457c9)"/><ellipse cx="50" cy="42" rx="21" ry="25" fill="var(--avatar-skin,#dcae8c)"/><path d="M28 39c0-20 11-31 25-31 14 0 23 11 20 32-6-11-17-15-26-13-8 2-13 8-19 12z" fill="var(--avatar-hair,#29243b)"/><path d="M40 43h3m14 0h3" stroke="#382c35" stroke-width="3" stroke-linecap="round"/><path d="M45 54q5 4 10 0" stroke="#855443" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`}
      </div>

      <div class="team-person">
        <h3>${esc(person.name)}</h3>
        <p class="team-role">${esc(person.role)}</p>
      </div>

      <div class="team-socials">
        ${discordLabel(person.discordUsername)}
        ${telegramLink(person.telegram)}
      </div>
    </article>
  `;

  // Keep every person in one list; never duplicate founders in a second section.
  const members = team;

  return `
    <div class="team-directory">

      <div class="team-directory-note">
        <h2>Built by Contributors. Owned by No Team.</h2>

        <p>
          Numen Network is a decentralized, open-source
          blockchain project, not a company-controlled
          initiative or an exclusive development team.
        </p>

        <p>
          The people listed here are independent volunteers
          and contributors. Their involvement does not grant
          them ownership or exclusive control over the network.
        </p>

        <p>
          Anyone willing to contribute is welcome.
          Developers, miners, researchers, creators and
          community members can help shape the future
          of Numen Network.
        </p>

        <p>
          <strong>
            No exclusive team. No gatekeepers.
            Open to everyone.
          </strong>
        </p>
      </div>

      <section class="team-group" aria-label="Numen team members">
        <div class="team-group-head">
          <div><span class="eyebrow">NUMEN NETWORK</span><h2>Team & Contributors</h2>
            <p>Meet the independent builders, miners, designers and community contributors helping Numen grow.</p></div>
          <span class="team-group-count">${members.length} members</span>
        </div>
        <div class="team-grid">${members.map(personCard).join('')}</div>
      </section>

      <div class="team-directory-note">
        <h2>Become a Contributor</h2>

        <p>
          Numen Network welcomes contributions from
          anyone who shares its vision of decentralized
          technology, verifiable computation and
          open-source innovation.
        </p>

        <a class="team-social-link"
           href="${esc(network.github)}"
           target="_blank"
           rel="noopener noreferrer">
          Contribute on GitHub ↗
        </a>

        <a class="team-social-link"
           href="${esc(network.telegram)}"
           target="_blank"
           rel="noopener noreferrer">
          Join the Community ↗
        </a>
      </div>

    </div>
  `;
}

