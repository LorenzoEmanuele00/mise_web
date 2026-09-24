@AGENTS.md

## Comandi

- Dev: `npm run dev`. Con ECC va lanciato dentro tmux, altrimenti l'hook lo blocca.
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Test e2e (Playwright, smoke in sola lettura): `npm test`. Avvia da solo il dev server se non gira già. Per testare un deploy online: `PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app npm test`
- I test non devono mai inviare form: scriverebbero sul dataset Sanity dell'ambiente.

## Documentazione

Note di progetto nel vault Obsidian: `Progetti/Sito Mise Gello (mise_web)/mise_web - Indice.md`. Le regole sono in `~/.claude/CLAUDE.md`. I docs tecnici del repo sono in `docs/`.
