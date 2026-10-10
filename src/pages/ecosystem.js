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
    <article class="team-card">
      <div class="team-avatar" aria-hidden="true">
        ${person.avatar
          ? `<img src="${esc(person.avatar)}" alt="" loading="lazy">`
          : esc(initials(person.name))}
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

  const sections = [
    {
      title: 'Founders',
      description:
        'The individuals who initiated the Numen Network project.',
      members: team.filter(person => person.founder)
    },
    {
      title: 'Contributors',
      description:
        'Volunteers contributing to development, mining and community growth.',
      members: team
    }
  ];

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

      ${sections.map(section => `
        <section class="team-group"
                 aria-label="${esc(section.title)}">

          <div class="team-group-head">
            <div>
              <span class="eyebrow">
                NUMEN NETWORK
              </span>

              <h2>${esc(section.title)}</h2>
              <p>${esc(section.description)}</p>
            </div>

            <span class="team-group-count">
              ${section.members.length} contributors
            </span>
          </div>

          <div class="team-grid">
            ${section.members.map(personCard).join('')}
          </div>
        </section>
      `).join('')}

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

