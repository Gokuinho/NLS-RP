# NLS | RP — pages légales du bot Discord

Site statique (GitHub Pages) exigé par le portail développeur Discord pour l’application **NLS | RP**
(client ID `1545186081228726292`).

| Page | URL publique | Champ du portail Discord |
|---|---|---|
| Conditions d’utilisation | https://gokuinho.github.io/NLS-RP/conditions/ | General Information → Terms of Service URL |
| Politique de confidentialité | https://gokuinho.github.io/NLS-RP/confidentialite/ | General Information → Privacy Policy URL |
| Installation | https://gokuinho.github.io/NLS-RP/installer/ | Installation → Install Link (Custom URL) |

## Lien d’installation

```
https://discord.com/oauth2/authorize?client_id=1545186081228726292&permissions=131241&integration_type=0&scope=bot+applications.commands
```

`permissions=131241` = Administrator (8) + CreateInstantInvite (1) + ManageGuild (32) + ViewAuditLog (128)
+ MentionEveryone (131072) — les quatre bits que `src/deployment/bot-permissions.ts` exige explicitement
en plus de l’Administrateur.

**Garder « Public Bot » désactivé** (portail → Bot) : sinon n’importe qui ayant le lien peut ajouter le bot
à son serveur, et le bot ne quitte pas les serveurs inconnus.

## Structure

```
index.html                 accueil
conditions/index.html      conditions d’utilisation
confidentialite/index.html politique de confidentialité
installer/index.html       bouton d’installation
404.html                   page introuvable
assets/                    style.css, favicon.svg (aucune ressource externe, aucun script)
scripts/check.mjs          vérification : liens, ancres, métadonnées, lien OAuth2
scripts/check.test.mjs     tests (node --test)
.github/workflows/         CI : vérification à chaque push
```

## Vérifier en local

```
node scripts/check.mjs
node --test scripts/check.test.mjs
```

## Mettre à jour

La politique de confidentialité décrit ce que le code du bot fait réellement (registres `data/*.json`,
formulaires de `tickets.config.ts`, intents de `src/bot/client.ts`). Quand une nouvelle fonction du bot
collecte une donnée nouvelle, mettre à jour le tableau « Données traitées » **et** la date « en vigueur au »,
puis annoncer le changement sur le Discord.

## GitBook (règlement du serveur)

Le dossier `gitbook/` contient le règlement publié sur https://newls-rp.gitbook.io/nls-rp,
synchronisé par **GitBook Git Sync** (fichier `.gitbook.yaml`, racine `./gitbook/`).

* `gitbook/SUMMARY.md` est la table des matières : toute nouvelle page doit y figurer.
* Le GitBook est rédigé **au vouvoiement** (décision de la Direction du 10 septembre 2026).
* Toute modification est datée dans `gitbook/changelog.md`.

Vérifier avant de pousser :

```
node scripts/check-gitbook.mjs
node --test scripts/check-gitbook.test.mjs
```

Le script contrôle le sommaire (pages orphelines ou manquantes), les liens relatifs, les blocs
`{% hint %}` et l’absence de tutoiement.
