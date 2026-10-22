// Keep the original Contact page layout and add official community links.
pageRegistry["/community/contact"] = () => legacyPage("/community/contact").replace(
  'Join the official Telegram and Discord communities.</p>',
  'Join the official Telegram and Discord communities.</p><div class="cta-row numen-community-links"><a class="btn btn-primary" href="https://t.me/numen_network" target="_blank" rel="noopener noreferrer">Join Telegram ↗</a><a class="btn btn-secondary" href="https://discord.gg/ajPKdvrvJK" target="_blank" rel="noopener noreferrer">Join Discord ↗</a></div>'
);
