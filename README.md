# 🚀 TradeFlow Custom + Sniper V2

[![Version](https://img.shields.io/badge/version-2.0-purple)](https://github.com/sworm/tradeflow-custom)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Made with](https://img.shields.io/badge/made%20with-❤️-red)](https://github.com/sworm)

> Extension Chrome pour personnaliser TradeFlow et activer un mode Sniper automatique sur les tokens Solana

![TradeFlow Custom Banner](https://pbs.twimg.com/profile_banners/1878504995408019456/1736708612/600x200)

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Mode Sniper](#-mode-sniper)
- [Guide d'utilisation](#-guide-dutilisation)
- [Débogage](#-débogage)
- [FAQ](#-faq)
- [Sécurité](#-sécurité)
- [Contribuer](#-contribuer)

## ✨ Fonctionnalités

### 💰 Buy Buttons Personnalisables
- Configurez 4 boutons d'achat rapide avec vos montants préférés (en SOL)
- Sauvegarde automatique dans le localStorage
- Interface intuitive et moderne

### 🎯 Mode Sniper Automatique
- Bouton "SNIPE" sur chaque token détecté
- Clic automatique sur le bouton **3 SOL** de TradeFlow
- Navigation automatique vers le token si nécessaire
- Simulation de clic ultra-réaliste (mouseenter, mouseover, mousedown, mouseup, click)
- Gestion intelligente des erreurs et timeouts

### 🎨 Interface Moderne
- Design glassmorphism avec effets de blur
- Animations fluides et transitions
- Notifications en temps réel
- Responsive et accessible

### 🔧 Configuration Persistante
- Sauvegarde automatique de vos préférences
- Réinitialisation en un clic
- Export/Import de configuration (à venir)

## 📦 Installation

### Méthode 1: Installation manuelle (Développeur)

1. **Téléchargez les fichiers**
   ```bash
   git clone https://github.com/sworm/tradeflow-custom.git
   cd tradeflow-custom
   ```

2. **Ouvrez Chrome Extensions**
   - Allez dans `chrome://extensions/`
   - Activez le "Mode développeur" (coin supérieur droit)

3. **Chargez l'extension**
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier du projet

### Méthode 2: Console (Temporaire)

1. Ouvrez la console Chrome (`F12`)
2. Collez le contenu du fichier `injected.js`
3. Appuyez sur `Entrée`

> ⚠️ **Note**: Cette méthode est temporaire et disparaîtra au rechargement de la page.

## ⚙️ Configuration

### Accéder aux paramètres

1. Cliquez sur le bouton **"TF Config"** en bas à droite de l'écran
2. Une modale s'ouvre avec deux sections principales

### Section Buy Buttons

Configurez vos 4 boutons d'achat rapide:

| Bouton | Montant par défaut | Description |
|--------|-------------------|-------------|
| Bouton 1 | 0.25 SOL | Petit montant |
| Bouton 2 | 0.5 SOL | Montant moyen |
| Bouton 3 | 0.75 SOL | Montant élevé |
| Bouton 4 | 1 SOL | Montant maximum |

### Section Sniper Mode

- **Toggle ON/OFF**: Active ou désactive le mode Sniper
- **Montant fixe**: 3 SOL (utilise le bouton natif de TradeFlow)
- **Slippage**: 5% par défaut

### Sauvegarder

1. Modifiez vos paramètres
2. Cliquez sur **"Sauvegarder"**
3. Une notification confirme l'enregistrement

### Réinitialiser

Cliquez sur **"Réinitialiser"** pour revenir aux valeurs par défaut.

## 🎯 Mode Sniper

### Activation

1. Ouvrez la configuration (`TF Config`)
2. Activez le toggle **"Activer le mode Sniper"**
3. Sauvegardez

### Utilisation

#### Sur la page de listing des tokens:

1. Un bouton **"⚡ SNIPE"** apparaît sur chaque token
2. Cliquez sur le bouton SNIPE
3. Le script:
   - Ouvre automatiquement le token
   - Attend le chargement du panel TradeFlow
   - Cherche le bouton "3 SOL"
   - Simule un clic réaliste
   - Lance l'ordre d'achat

#### États du bouton:

| État | Description |
|------|-------------|
| ⚡ SNIPE | Prêt à sniper |
| 🔄 NAVIGATION | Ouverture du token en cours |
| ⏳ SNIPE... | Recherche du bouton 3 SOL |
| ✅ SNIPED | Clic effectué avec succès |
| ❌ FAILED | Erreur (voir console) |

### Fonctionnement technique

Le sniper utilise plusieurs méthodes pour trouver le bouton 3 SOL:

1. **Par le texte**: Cherche "3 SOL" dans le contenu du bouton
2. **Par l'attribut**: Vérifie `data-amount="3"`
3. **Par position**: Utilise le 3ème bouton (fallback)

Une fois trouvé, il simule un clic naturel avec:
```javascript
mouseenter → mouseover → mousedown → mouseup → click
```

### Timeout automatique

Les snipes en attente expirent après **30 secondes** pour éviter les opérations obsolètes.

## 📖 Guide d'utilisation

### Scénario 1: Achat rapide classique

1. Configurez vos montants dans "Buy Buttons"
2. Sur un token, utilisez les boutons personnalisés
3. L'achat se lance avec votre montant

### Scénario 2: Sniper un nouveau token

1. Activez le mode Sniper
2. Parcourez la liste des tokens
3. Cliquez sur ⚡ SNIPE sur le token souhaité
4. Le script fait tout automatiquement

### Scénario 3: Sniper depuis la page du token

1. Ouvrez manuellement un token
2. Activez le Sniper dans la config
3. Le bouton SNIPE apparaît
4. Cliquez pour lancer l'achat instantané

## 🔍 Débogage

### Console de développement

Ouvrez la console (`F12`) pour voir les logs détaillés:

```
✅ TradeFlow Custom + Sniper V2 initialisé
✅ Configuration chargée depuis localStorage
🎯 Sniper activé - Clic sur bouton 3 SOL
🔍 4 boutons buy trouvés
  Bouton: "0.25 SOL", data-amount: "0.25"
  Bouton: "0.5 SOL", data-amount: "0.5"
  Bouton: "3 SOL", data-amount: "3"
  ✅ Bouton 3 SOL identifié par texte!
🖱️ Simulation de clic sur: <button>
  ✓ Événement 1/5: mouseenter
  ✓ Événement 2/5: mouseover
  ...
```

### Test manuel du bouton 3 SOL

Collez ce code dans la console:

```javascript
function testBouton3SOL() {
    const panel = document.querySelector('.tradeflow-playground-panel');
    if (!panel) {
        console.log('❌ Panel non trouvé');
        return;
    }

    const buttons = panel.querySelectorAll('button[action="paper-buy"]');
    console.log(`🔍 ${buttons.length} boutons trouvés:`);

    buttons.forEach((btn, i) => {
        const text = btn.textContent.trim();
        const amount = btn.getAttribute('data-amount');
        console.log(`  ${i+1}. "${text}" | data-amount: "${amount}"`);

        if (text.includes('3') && text.includes('SOL')) {
            console.log('     ⭐ <- BOUTON 3 SOL!');
        }
    });
}

testBouton3SOL();
```

### Problèmes courants

#### ❌ "Bouton 3 SOL non trouvé"

**Causes possibles:**
- Panel TradeFlow pas complètement chargé
- Structure HTML de TradeFlow modifiée
- Bouton 3 SOL n'existe pas dans l'interface

**Solutions:**
1. Vérifiez que le panel est visible
2. Attendez quelques secondes et réessayez
3. Vérifiez les logs dans la console
4. Testez avec le script de débogage ci-dessus

#### ⏱️ "Snipe expiré (30s dépassées)"

Le timeout de sécurité a expiré. Relancez simplement l'opération.

#### 🔄 Navigation infinie

Si le script n'arrive pas à détecter le panel:
1. Désactivez le Sniper
2. Ouvrez manuellement un token
3. Réactivez le Sniper
4. Utilisez SNIPE depuis la page du token

## ❓ FAQ

### Q: Le sniper fonctionne-t-il sans l'API TradeFlow?

**R:** Oui! Cette version V2 simule un clic sur le bouton natif, elle ne nécessite pas l'API.

### Q: Puis-je changer le montant du sniper?

**R:** Le sniper utilise toujours le bouton 3 SOL. Pour un montant différent, modifiez la configuration du bouton 3 dans "Buy Buttons".

### Q: Est-ce que mes paramètres sont sauvegardés?

**R:** Oui, tout est sauvegardé dans le localStorage de votre navigateur.

### Q: Combien de fois puis-je sniper par minute?

**R:** Il n'y a pas de limite, mais respectez les limites de TradeFlow et du réseau Solana.

### Q: Le sniper fonctionne-t-il sur mobile?

**R:** Non, cette extension est conçue pour Chrome Desktop uniquement.

### Q: Mes données sont-elles envoyées quelque part?

**R:** Non, tout reste local dans votre navigateur. Aucune donnée n'est envoyée à des serveurs tiers.

## 🔒 Sécurité

### Bonnes pratiques

✅ **Vérifiez toujours le token** avant de sniper  
✅ **Utilisez des montants raisonnables** pour tester  
✅ **Vérifiez votre slippage** avant chaque trade  
✅ **Gardez votre wallet sécurisé** avec un mot de passe fort  

### Protections intégrées

- ✅ Désactivation du bouton pendant l'opération
- ✅ Timeout de 30 secondes pour les snipes en attente
- ✅ Nettoyage automatique des données
- ✅ Gestion complète des erreurs
- ✅ Notifications claires à chaque étape

### Avertissements

⚠️ **Utilisez cette extension à vos propres risques**  
⚠️ **Ne sniquez que sur des tokens vérifiés**  
⚠️ **Attention aux scams et aux rug pulls**  
⚠️ **Ne partagez jamais votre phrase secrète**  

## 🤝 Contribuer

Les contributions sont les bienvenues!

### Comment contribuer

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Idées de fonctionnalités

- [ ] Export/Import de configuration
- [ ] Historique des snipes
- [ ] Montants dynamiques pour le sniper
- [ ] Statistiques de trading
- [ ] Mode sombre/clair
- [ ] Raccourcis clavier
- [ ] Multi-wallet support
- [ ] Alertes de prix

## 📝 Changelog

### Version 2.0 (Actuelle)
- ✨ Nouveau système de sniper par clic simulé
- 🎨 Interface redessinée avec glassmorphism
- 🔧 Configuration persistante améliorée
- 🐛 Corrections de bugs
- 📚 Documentation complète

### Version 1.0
- 🎉 Version initiale
- 💰 Boutons personnalisables
- 🎯 Mode sniper basique

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**sworm**

- GitHub: [@sworm](https://github.com/swormm)
- Twitter: [@sworm](https://x.com/simsw4pping)

## 💖 Remerciements

- TradeFlow pour l'excellente plateforme
- La communauté Solana
- Tous les contributeurs

---

<div align="center">

**Made with ❤️ by sworm**

⭐ **N'oubliez pas de mettre une étoile si ce projet vous aide!** ⭐
