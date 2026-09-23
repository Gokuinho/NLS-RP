# Vider le cache FiveM

Crash au chargement, textures manquantes, connexion qui bloque : dans la plupart des cas, vider le cache règle le problème.

1. **Fermez complètement FiveM** (vérifiez qu’il n’est plus dans la barre des tâches).
2. Appuyez sur **Windows + R**, tapez `%localappdata%\FiveM\FiveM.app\data` et validez.
3. Supprimez les dossiers **`cache`**, **`server-cache`** et **`server-cache-priv`**.
4. **Ne supprimez pas** le dossier `game-storage` : il contient les fichiers du jeu et devrait être re-téléchargé entièrement.
5. Relancez FiveM et reconnectez-vous. Le premier chargement sera plus long : c’est normal.

{% hint style="info" %}
Le problème persiste ? Ouvrez un ticket **Bug** en indiquant le message d’erreur exact (une capture est idéale) et ce que vous avez déjà essayé.
{% endhint %}
