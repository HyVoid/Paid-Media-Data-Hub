[ 🌐 عربي ](README.ar.md) | [ 🇩🇪 Deutsch ](README.de.md) | [ 🇫🇷 Français ](README.fr.md) | [ 🇳🇱 Nederlands ](README.nl.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Bouw een onderhoudsvrije semantische laag voor paid media-rapportage in Excel & Google Sheets

![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform: Browser + Excel](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool Type: Decision Support](https://img.shields.io/badge/Tool-Analytics%20Decision%20Support-orange.svg)

**Bouw een herbruikbare paid media-rapportage-engine die één ruwe Supermetrics-export omzet in onbeperkte klantdashboards, zonder extra queries, software-installatie of spreadsheetonderhoud.**

**Geen registratie. Geen installatie. Gratis in je browser.**

Probeer de browserversie gratis. Als je de Excel-versie nodig hebt, kun je die kopen met 30 dagen geld-terug-garantie, zonder vragen.

>
> 🌐 **Open in browser** → [*interactieve HTML-versie*](https://hyvoid.github.io/Paid-Media-Data-Hub/)
>
> 📥 **Download Excel** → Excel-werkmaprelease *(binnenkort beschikbaar)*
>
> Beschikbaar in zowel browser- als Excel-formaat.

---

## Wat het je helpt volgen

* Marketinguitgaven, omzet en ROAS over meerdere klanten vanuit één bron van waarheid.
* Prestatieverschillen tussen merkcampagnes en acquisitiecampagnes.
* Inconsistenties in campagnenamen die de rapportagenauheid stilzwijgend fragmenteren.
* Prestatievergelijkingen op platformniveau na het elimineren van naamvarianten van leveranciers.
* Impact van het aan boord nemen van nieuwe klanten zonder de rapportage-infrastructuur opnieuw op te bouwen.
* Rapportagediscrepanties tussen oude dashboards en gereconstrueerde analysemodellen.

---

## Waarom ik dit heb gebouwd

De meeste marketingrapportagesystemen falen om dezelfde reden: ze optimaliseren het produceren van rapporten in plaats van analytische consistentie.

In veel bureaus creëert elke nieuwe klant weer een dashboard, weer een Supermetrics-query, weer een verzameling aangepaste formules en weer een rapportageworkflow. Uiteindelijk weet niemand of prestatieverschillen de bedrijfsrealiteit weerspiegelen of de spreadsheetarchitectuur.

Een veelvoorkomend voorbeeld:

| Situatie                        | Traditionele rapportage                    |
| -------------------------------- | ---------------------------------------- |
| Klant A lanceert op Google Ads  | Nieuwe query aangemaakt                        |
| Klant B lanceert op Meta Ads    | Nog een query aangemaakt                        |
| Klant C wil kanaalsplitsingen | Extra tabbladen en formules             |
| Bureau voegt 20 klanten toe           | Honderden queries en gedupliceerde logica |

Het operationele probleem is niet het maken van dashboards.

Het operationele probleem is **queryexplosie en semantische drift**.

Zo observeerde ik bureaus waar:

* "Google Ads"
* "googleads"
* "AdWords"
* "Google PPC"

werden behandeld als vier afzonderlijke mediakanalen.

Het resultaat:

```
Reported ROAS:
Google Ads      = 4.1
AdWords         = 2.3
Google PPC      = 3.6

Decision:
Increase spend on Google Ads.
Reduce AdWords budget.
```

Na semantische normalisatie:

```
Unified Google Ads ROAS:
3.1
```

De aanbeveling veranderde volledig.

Deze werkmap productiseert een reproduceerbaar analytisch raamwerk:

> **Eens verzamelen → eens standaardiseren → eens berekenen → oneindig rapporteren.**

In plaats van nog een dashboard te bouwen, bouwt het een herbruikbaar beslismodel.

---

## Veelvoorkomende paid media-rapportageproblemen die dit oplost

| Probleem                      | Zonder dit hulpmiddel                               | Met dit hulpmiddel                                 |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Supermetrics-queryexplosie | Aantal queries groeit lineair met klanten         | Één ruwe export voedt alle rapportage            |
| Inconsistente kanaalnamen | ROAS-berekeningen raken gefragmenteerd             | Semantische mapping creëert één canonieke bron  |
| Onboarding-overhead klanten   | Nieuwe dashboards vragen uren van setup           | Nieuwe klanten vragen één configuratieregel      |
| Formuleonderhoud | Honderden gedupliceerde formules driften in de tijd | Centrale metricengine berekent één keer          |
| Migratierisico rapportage     | Oude en herbouwde rapporten kunnen niet worden verzoend           | Validatielaag voert geautomatiseerde QA uit        |
| Kennisoverdracht faalt   | Nieuwe analisten kunnen historische modellen niet onderhouden  | Architectuur blijft transparant en controleerbaar |

---

## Voor wie dit is

Dit raamwerk is ontworpen voor:

* Paid media-bureaus die meerdere merken beheren.
* Marketinganalisten die Supermetrics-exports gebruiken.
* Performance marketing-adviseurs die klantrapportage onderhouden.
* Fractionele CMO's die klantoverstijgende prestatiezichtbaarheid nodig hebben.
* Kleine marketingteams die warehouse-achtige analytische consistentie nodig hebben zonder een warehouse te implementeren.

Dit raamwerk is niet ontworpen voor:

* Enterprise BI-vervangingsprojecten.
* Realtime attributiesystemen.
* CDP-implementaties.
* Marketingautomatiseringsplatformen.

Er is geen spreadsheetexpertise nodig om de outputs te gebruiken. Open de browserversie of Excel-versie en begin direct met analyseren.

---

## Over

Ik bouw lichtgewicht analytische systemen voor situaties waarin er te veel bewegende delen zijn om ze betrouwbaar in je hoofd te houden.

De vraag waarmee ik meestal begin, is:

> **Welke informatie moet op één plek bestaan zodat de volgende beslissing met vertrouwen kan worden genomen?**

Deze semantische paid media-laag is één voorbeeld van die aanpak: het omzetten van gefragmenteerde operationele rapportage in een herbruikbaar raamwerk voor beslisondersteuning zonder datawarehouse of enterprise-softwarestack.

---

## Technische details

<details>
<summary><strong>Voor technische reviewers, Excel-beoefenaars en medewerkers</strong></summary>

---

### Architectuur van de werkmap

De werkmap volgt een lichtgewicht star-schema-architectuur die volledig is geïmplementeerd binnen Excel-tabellen en dynamische arrays. 

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

| Laag          | Werkblad                 | Doel                           |
| -------------- | ------------------------- | --------------------------------- |
| Configuratie  | Config_Setup              | Semantische mappings en KPI-doelen |
| Ruwe data       | Raw_Supermetrics_Data     | Één geïmporteerde feitentabel        |
| Semantische laag | Data_Standardization      | Canonieke bedrijfsdimensies     |
| Berekening    | Metric_Calculation_Engine | Dynamische metricaggregatie        |
| Validatie     | Validation_Module         | Verzoening met oude situatie |
| Presentatie   | Executive_Dashboard       | Managementrapportage       |
| Presentatie   | Client_Performance        | Klantrapportage                  |
| Beheer     | Admin_Dashboard           | Monitoring en diagnostiek        |

---

### Drie valkuilen die zelfs ervaren marketinganalisten vangen

---

#### Valkuil 1 — Platformfragmentatie creëert nepprestatieverschillen

Er werd een beslissing genomen over herverdeling van budget.

De beslissing steunde op afzonderlijke ROAS-berekeningen uit inconsistente kanaalnamen.

| Ruwe platform | ROAS |
| ------------ | ---- |
| googleads    | 4.2  |
| AdWords      | 2.5  |
| Google PPC   | 3.4  |

Het management concludeerde:

> Verhoog het Google Ads-budget en verlaag de AdWords-uitgaven.

De redenering is onjuist omdat de categorieën hetzelfde advertentieplatform vertegenwoordigen.

Gecorrigeerde aanpak:

| Standaardplatform | ROAS |
| ----------------- | ---- |
| Google Ads        | 3.2  |

Gecorrigeerd besluitresultaat:

> Handhaaf de budgetverdeling en optimaliseer in plaats daarvan de campagnestructuur.

<details>
<summary>Formule-implementatie</summary>

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

#### Valkuil 2 — Variaties in campagnenamen verbergen de klanteconomie

Er werd een beslissing genomen over klantrendabiliteit.

De beslissing ging ervan uit dat campagnenamen klanten betrouwbaar identificeerden.

Voorbeeld:

```text
Nike_UK_Brand
NIKE_Generic
Nike Europe
耐克_Brand
```

Gerapporteerd resultaat:

```
Four separate clients.
```

Werkelijk resultaat:

```
One client.
```

Het analytische falen trad op omdat naamconventies werden aangenomen in plaats van gevalideerd.

Gecorrigeerde aanpak:

| Campagne      | Standaardklant |
| ------------- | --------------- |
| Nike_UK_Brand | Nike            |
| NIKE_Generic  | Nike            |
| Nike Europe   | Nike            |
| 耐克_Brand      | Nike            |

Gecorrigeerd besluitresultaat:

> Budgettoewijzingsbeslissingen worden op klantniveau genomen in plaats van op campagneniveau.

<details>
<summary>Formule-implementatie</summary>

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

#### Valkuil 3 — Dashboardmigratie zonder validatie vernietigt vertrouwen

Een herbouw van de rapportage werd afgerond.

Het herbouwde dashboard toonde:

```
Spend = $1,248,220
```

Het oude dashboard toonde:

```
Spend = $1,248,065
```

Het management concludeerde:

> Het herbouwde model is onbetrouwbaar.

De redenering is onjuist omdat er geen systematische variantieanalyse werd uitgevoerd.

Gecorrigeerde aanpak:

| Klant | Oud | Nieuw    | Variantie |
| ------ | ------ | ------ | -------- |
| Nike   | 125000 | 125000 | 0        |
| Adidas | 89000  | 89000  | 0        |
| Puma   | 65400  | 65400  | 0        |

Gecorrigeerd besluitresultaat:

> Validatie wordt objectief in plaats van politiek.

<details>
<summary>Formule-implementatie</summary>

```excel
=IF(
ABS(B5#-C5#)<0.05,
"✅ Consistent",
"❌ Mismatch"
)
```

</details>

---

### Voorbeeldscenario

Een performancebureau beheert 18 klanten.

Huidige rapportage-architectuur:

* 126 Supermetrics-queries
* 54 rapportagetabbladen
* 14 gedupliceerde dashboardsjablonen
* 7 verschillende ROAS-definities

Na de migratie:

| Metric                | Voor    | Na       |
| --------------------- | --------- | ----------- |
| Supermetrics-queries  | 126       | 1           |
| Klantonboarding     | 2 uur   | 10 seconden  |
| Dashboardonderhoud | Wekelijks    | Nul        |
| Formuleduplicatie   | Duizenden | Gecentraliseerd |
| Validatie-inspanning     | Handmatig    | Geautomatiseerd   |

Geïmporteerde ruwe data:

| Klant | Uitgaven   | Omzet |
| ------ | ------- | ------- |
| Nike   | 145.000 | 532.000 |
| Adidas | 89.000  | 278.000 |
| Puma   | 42.000  | 91.000  |

Berekende outputs:

| Klant | ROAS | CPA  | CTR  |
| ------ | ---- | ---- | ---- |
| Nike   | 3,67 | 41,3 | 3,9 % |
| Adidas | 3,12 | 52,7 | 2,8 % |
| Puma   | 2,17 | 74,1 | 1,7 % |

Analytische interpretatie:

* Nike overtreft de doelrendabiliteit.
* Adidas blijft binnen acceptabele variantie.
* Puma vertoont acquisitie-inefficiëntie.

Aanbevolen beslissing:

* Verhoog de budgettoewijzing van Nike.
* Handhaaf de Adidas-uitgaven.
* Controleer de campagnestructuur van Puma voor verdere investeringen.

---

### Formulereferentie

<details>
<summary>Formules van de semantische laag</summary>

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
<summary>Formules van de metricengine</summary>

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
<summary>Dashboardformules</summary>

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

### Validatieregels

| Veld                   | Regel                        | Foutgedrag       |
| ----------------------- | --------------------------- | -------------------- |
| Klantmapping          | Moet bestaan in mappingtabel | Geeft "Unmapped" terug   |
| Platformmapping        | Moet bestaan in mappingtabel | Geeft "Other" terug      |
| CTR                     | Impressions > 0             | Geeft 0 terug            |
| ROAS                    | Uitgaven > 0                   | Geeft 0 terug            |
| CPA                     | Conversies > 0             | Geeft 0 terug            |
| Validatievariantie     | Verschil < $0.05          | Geeft "Consistent" terug |
| Dashboardfilter        | Moet bestaan in klantlijst   | Validatiefout     |
| Campagneclassificatie | Ontbrekend patroon             | Standaard Generic  |

</details>

---

## Andere hulpmiddelen in deze serie

* **Cross-Border VAT Compliance Console** — BTW-verzoening en aangiftesupport over meerdere jurisdicties.
* **DTC Inventory Governance Dashboard** — Raamwerk voor voorraadplanning en aanvullingsbeslissingen.
* **Project Cost Allocation Engine** — Analyse van arbeidsbenutting en rentabiliteit.
* **CRM-to-Accounting Automation Framework** — Standaardisatie van operationele financiële workflows.
* **Multi-Currency Trade Analytics Model** — Grensoverschrijdende ondersteuning van financiële beslissingen.

Meer hulpmiddelen beschikbaar via het GitHub-profiel en de releasebibliotheek.

---

## Licentie

Dit project is gelicentieerd onder de **Apache License 2.0**.

Je mag dit werk vrij gebruiken, wijzigen, distribueren en aanpassen onder de voorwaarden van de Apache License 2.0.
