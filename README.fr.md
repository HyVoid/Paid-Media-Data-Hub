[ 🌐 عربي ](README.ar.md) | [ 🇩🇪 Deutsch ](README.de.md) | [ 🇫🇷 Français ](README.fr.md) | [ 🇳🇱 Nederlands ](README.nl.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Construire une couche sémantique de reporting paid media sans maintenance dans Excel & Google Sheets

![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform: Browser + Excel](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool Type: Decision Support](https://img.shields.io/badge/Tool-Analytics%20Decision%20Support-orange.svg)

**Construis un moteur de reporting paid media réutilisable qui transforme un export Supermetrics brut en tableaux de bord clients illimités, sans requêtes supplémentaires, sans installation de logiciel et sans maintenance de tableur.**

**Aucune inscription. Aucune installation. Gratuit dans ton navigateur.**

Essaie la version navigateur gratuitement. Si tu as besoin de la version Excel, tu peux l'acheter avec une garantie de remboursement de 30 jours, sans questions.

>
> 🌐 **Ouvrir dans le navigateur** → [*version interactive HTML*](https://hyvoid.github.io/Paid-Media-Data-Hub/)
>
> 📥 **Télécharger Excel** → Version du classeur Excel *(bientôt disponible)*
>
> Disponible aux formats navigateur et Excel.

---

## Ce que cet outil t'aide à suivre

* Les dépenses marketing, les revenus et le ROAS de plusieurs clients à partir d'une source de vérité unique.
* Les écarts de performance entre campagnes de notoriété et campagnes d'acquisition.
* Les incohérences de nommage des campagnes qui fragmentent silencieusement la précision du reporting.
* Les comparaisons de performance par plateforme après élimination des variantes de nommage des fournisseurs.
* L'impact de l'intégration de nouveaux clients sans reconstruction de l'infrastructure de reporting.
* Les écarts de reporting entre les tableaux de bord historiques et les modèles analytiques reconstruits.

---

## Pourquoi j'ai construit ceci

La plupart des systèmes de reporting marketing échouent pour la même raison : ils optimisent la production de rapports plutôt que la cohérence analytique.

Dans beaucoup d'agences, chaque nouveau client crée un autre tableau de bord, une autre requête Supermetrics, une autre collection de formules personnalisées et un autre workflow de reporting. Au final, personne ne sait si les écarts de performance reflètent la réalité économique ou l'architecture du tableur.

Un exemple courant :

| Situation                        | Reporting traditionnel                    |
| -------------------------------- | ---------------------------------------- |
| Le client A se lance sur Google Ads  | Nouvelle requête créée                        |
| Le client B se lance sur Meta Ads    | Autre requête créée                        |
| Le client C demande des répartitions par canal | Onglets et formules supplémentaires             |
| L'agence ajoute 20 clients           | Des centaines de requêtes et de logique dupliquée |

Le problème opérationnel n'est pas la création de tableaux de bord.

Le problème opérationnel est l'**explosion des requêtes et la dérive sémantique**.

Par exemple, j'ai observé des agences où :

* "Google Ads"
* "googleads"
* "AdWords"
* "Google PPC"

étaient traités comme quatre canaux médias distincts.

Le résultat :

```
Reported ROAS:
Google Ads      = 4.1
AdWords         = 2.3
Google PPC      = 3.6

Decision:
Increase spend on Google Ads.
Reduce AdWords budget.
```

Après normalisation sémantique :

```
Unified Google Ads ROAS:
3.1
```

La recommandation a complètement changé.

Ce classeur transforme en produit un cadre analytique reproductible :

> **Collecter une fois → standardiser une fois → calculer une fois → rapporter à l'infini.**

Au lieu de construire un autre tableau de bord, il construit un modèle de décision réutilisable.

---

## Les problèmes courants de reporting paid media que cela résout

| Problème                      | Sans cet outil                               | Avec cet outil                                 |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Explosion des requêtes Supermetrics | Le nombre de requêtes croît linéairement avec les clients         | Un export brut alimente tous les rapports            |
| Incohérence de nommage des canaux | Les calculs de ROAS deviennent fragmentés             | Le mapping sémantique crée une source canonique unique  |
| Surcharge d'intégration client   | Les nouveaux tableaux de bord exigent des heures de configuration           | Les nouveaux clients exigent une ligne de configuration      |
| Maintenance des formules | Des centaines de formules dupliquées dérivent avec le temps | Le moteur de métriques central calcule une seule fois          |
| Risque de migration du reporting     | Les rapports historiques et reconstruits ne peuvent pas être rapprochés           | La couche de validation effectue une QA automatisée        |
| Échec du transfert de connaissances   | Les nouveaux analystes ne peuvent pas maintenir les modèles historiques  | L'architecture reste transparente et auditable |

---

## À qui cela s'adresse

Ce cadre est conçu pour :

* Les agences paid media gérant plusieurs marques.
* Les analystes marketing utilisant des exports Supermetrics.
* Les consultants en marketing performance qui maintiennent le reporting client.
* Les CMOs fractionnels qui ont besoin d'une visibilité sur les performances multi-clients.
* Les petites équipes marketing qui ont besoin d'une cohérence analytique de type entrepôt de données sans mettre en œuvre un entrepôt.

Ce cadre n'est pas conçu pour :

* Les projets de remplacement de BI d'entreprise.
* Les systèmes d'attribution en temps réel.
* Les implémentations de CDP.
* Les plateformes d'automatisation marketing.

Aucune expertise en tableur n'est requise pour exploiter les résultats. Ouvre la version navigateur ou la version Excel et commence à analyser immédiatement.

---

## À propos

Je construis des systèmes analytiques légers pour les situations où il y a trop de pièces mobiles pour les garder fidèlement en tête.

La question par laquelle je commence généralement est :

> **Quelles informations doivent exister en un seul endroit pour que la prochaine décision soit prise avec confiance ?**

Cette couche sémantique paid media est un exemple de cette approche : transformer un reporting opérationnel fragmenté en un cadre réutilisable d'aide à la décision sans nécessiter d'entrepôt de données ni de pile logicielle d'entreprise.

---

## Détails techniques

<details>
<summary><strong>Pour les réviseurs techniques, les praticiens d'Excel et les collaborateurs</strong></summary>

---

### Architecture du classeur

Le classeur suit une architecture en étoile légère entièrement implémentée dans des tableaux Excel et des matrices dynamiques. 

```text
Raw_Supermetrics_Data
            │
            ▼
Config_Setup
            │
            ▼
Data_Standardization
            │
            ▼
Metric_Calculation_Engine
        │            │
        ▼            ▼
Validation     Executive_Dashboard
```

| Couche          | Feuille de calcul                 | Objectif                           |
| -------------- | ------------------------- | --------------------------------- |
| Configuration  | Config_Setup              | Mappings sémantiques et cibles KPI |
| Données brutes       | Raw_Supermetrics_Data     | Table de faits unique importée        |
| Couche sémantique | Data_Standardization      | Dimensions métier canoniques     |
| Calcul    | Metric_Calculation_Engine | Agrégation dynamique des métriques        |
| Validation     | Validation_Module         | Rapprochement avec l'existant |
| Présentation   | Executive_Dashboard       | Reporting exécutif       |
| Présentation   | Client_Performance        | Reporting client                  |
| Exploitation     | Admin_Dashboard           | Supervision et diagnostic        |

---

### Trois pièges qui trompent même les analystes marketing expérimentés

---

#### Piège 1 — La fragmentation des plateformes crée de fausses différences de performance

Une décision de réallocation budgétaire a été prise.

La décision s'appuyait sur des calculs de ROAS séparés produits par un nommage de canaux incohérent.

| Plateforme brute | ROAS |
| ------------ | ---- |
| googleads    | 4.2  |
| AdWords      | 2.5  |
| Google PPC   | 3.4  |

La direction a conclu :

> Augmente le budget Google Ads et réduis les dépenses AdWords.

Le raisonnement est incorrect car les catégories représentent la même plateforme publicitaire.

Approche corrigée :

| Plateforme standard | ROAS |
| ----------------- | ---- |
| Google Ads        | 3.2  |

Résultat de la décision corrigée :

> Maintiens l'allocation budgétaire et optimise plutôt la structure des campagnes.

<details>
<summary>Implémentation de la formule</summary>

```excel
=XLOOKUP(
[@Source],
tbl_PlatformRules[Raw_Platform],
tbl_PlatformRules[Standard_Platform],
"Other"
)
```

</details>

---

#### Piège 2 — Les variantes de nommage des campagnes masquent l'économie client

Une décision de rentabilité client a été prise.

La décision supposait que les noms de campagnes identifiaient les clients de manière fiable.

Exemple :

```text
Nike_UK_Brand
NIKE_Generic
Nike Europe
耐克_Brand
```

Résultat rapporté :

```
Four separate clients.
```

Résultat réel :

```
One client.
```

L'échec analytique s'est produit parce que les conventions de nommage étaient supposées plutôt que validées.

Approche corrigée :

| Campagne      | Client standard |
| ------------- | --------------- |
| Nike_UK_Brand | Nike            |
| NIKE_Generic  | Nike            |
| Nike Europe   | Nike            |
| 耐克_Brand      | Nike            |

Résultat de la décision corrigée :

> Les décisions d'allocation budgétaire deviennent au niveau client plutôt qu'au niveau campagne.

<details>
<summary>Implémentation de la formule</summary>

```excel
=IFERROR(
XLOOKUP(
TRUE,
ISNUMBER(
SEARCH(
tbl_ClientRules[Client_Keyword],
[@Campaign_Name]
)),
tbl_ClientRules[Standard_Client],
"Unmapped"),
"Unmapped")
```

</details>

---

#### Piège 3 — La migration de tableau de bord sans validation détruit la confiance

Une reconstruction du reporting a été achevée.

Le tableau de bord reconstruit affichait :

```
Spend = $1,248,220
```

Le tableau de bord historique affichait :

```
Spend = $1,248,065
```

La direction a conclu :

> Le modèle reconstruit n'est pas fiable.

Le raisonnement est incorrect car aucune analyse de variance systématique n'a été effectuée.

Approche corrigée :

| Client | Historique | Nouveau    | Variance |
| ------ | ------ | ------ | -------- |
| Nike   | 125000 | 125000 | 0        |
| Adidas | 89000  | 89000  | 0        |
| Puma   | 65400  | 65400  | 0        |

Résultat de la décision corrigée :

> La validation devient objective plutôt que politique.

<details>
<summary>Implémentation de la formule</summary>

```excel
=IF(
ABS(B5#-C5#)<0.05,
"✅ Consistent",
"❌ Mismatch"
)
```

</details>

---

### Scénario d'exemple

Une agence de performance gère 18 clients.

Architecture de reporting actuelle :

* 126 requêtes Supermetrics
* 54 onglets de reporting
* 14 modèles de tableau de bord dupliqués
* 7 définitions différentes du ROAS

Après la migration :

| Métrique                | Avant    | Après       |
| --------------------- | --------- | ----------- |
| Requêtes Supermetrics  | 126       | 1           |
| Intégration client     | 2 heures   | 10 secondes  |
| Maintenance du tableau de bord | Hebdomadaire    | Zéro        |
| Duplication des formules   | Des milliers | Centralisée |
| Effort de validation     | Manuel    | Automatisé   |

Données brutes importées :

| Client | Dépenses   | Revenus |
| ------ | ------- | ------- |
| Nike   | 145 000 | 532 000 |
| Adidas | 89 000  | 278 000 |
| Puma   | 42 000  | 91 000  |

Résultats calculés :

| Client | ROAS | CPA  | CTR  |
| ------ | ---- | ---- | ---- |
| Nike   | 3,67 | 41,3 | 3,9 % |
| Adidas | 3,12 | 52,7 | 2,8 % |
| Puma   | 2,17 | 74,1 | 1,7 % |

Interprétation analytique :

* Nike dépasse l'efficacité cible.
* Adidas reste dans une variance acceptable.
* Puma présente une inefficacité d'acquisition.

Décision recommandée :

* Augmente l'allocation budgétaire de Nike.
* Maintiens les dépenses Adidas.
* Audite la structure des campagnes Puma avant tout investissement supplémentaire.

---

### Référence des formules

<details>
<summary>Formules de la couche sémantique</summary>

```excel
Customer Matching:
XLOOKUP(TRUE,ISNUMBER(SEARCH(...)))

Platform Mapping:
XLOOKUP(Source,...)

Campaign Classification:
IF(SEARCH("Brand"),"Brand","Generic")
```

</details>

<details>
<summary>Formules du moteur de métriques</summary>

```excel
=SORT(UNIQUE(Client))

=SUMIFS(
tbl_StandardFact[Spend],
tbl_StandardFact[Standard_Client],
A5#
)

=IFERROR(
Revenue/Spend,
0
)
```

</details>

<details>
<summary>Formules du tableau de bord</summary>

```excel
=LET(
total_spend,
...
)

=IF(
B2="All",
SUM(...),
SUMIFS(...)
)
```

</details>

---

### Règles de validation

| Champ                   | Règle                        | Comportement en cas d'erreur       |
| ----------------------- | --------------------------- | -------------------- |
| Mapping client          | Doit exister dans la table de mapping | Renvoie "Unmapped"   |
| Mapping plateforme        | Doit exister dans la table de mapping | Renvoie "Other"      |
| CTR                     | Impressions > 0             | Renvoie 0            |
| ROAS                    | Dépenses > 0                   | Renvoie 0            |
| CPA                     | Conversions > 0             | Renvoie 0            |
| Variance de validation     | Différence < $0.05          | Renvoie "Consistent" |
| Filtre du tableau de bord        | Doit exister dans la liste des clients   | Erreur de validation     |
| Classification des campagnes | Motif manquant             | Prend "Generic" par défaut  |

</details>

---

## Autres outils de cette série

* **Cross-Border VAT Compliance Console** — Rapprochement et support de déclaration TVA multi-juridictions.
* **DTC Inventory Governance Dashboard** — Cadre de planification des stocks et de décision de réapprovisionnement.
* **Project Cost Allocation Engine** — Analyse de l'utilisation de la main-d'œuvre et de la rentabilité.
* **CRM-to-Accounting Automation Framework** — Standardisation des workflows financiers opérationnels.
* **Multi-Currency Trade Analytics Model** — Support de décision financière transfrontalière.

D'autres outils sont disponibles via le profil GitHub et la bibliothèque de versions.

---

## Licence

Ce projet est sous licence **Apache License 2.0**.

Tu es libre d'utiliser, de modifier, de distribuer et d'adapter cette œuvre selon les termes de la licence Apache 2.0.
