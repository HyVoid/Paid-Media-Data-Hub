[ 🌐 عربي ](README.ar.md) | [ 🇩🇪 Deutsch ](README.de.md) | [ 🇫🇷 Français ](README.fr.md) | [ 🇳🇱 Nederlands ](README.nl.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Aufbau einer wartungsfreien semantischen Schicht für Paid-Media-Reporting in Excel & Google Sheets

![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform: Browser + Excel](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool Type: Decision Support](https://img.shields.io/badge/Tool-Analytics%20Decision%20Support-orange.svg)

**Baue eine wiederverwendbare Paid-Media-Reporting-Engine, die einen rohen Supermetrics-Export in unbegrenzte Kunden-Dashboards verwandelt – ohne zusätzliche Abfragen, Softwareinstallation oder Tabellenkalkulations-Wartung.**

**Keine Registrierung. Keine Installation. Kostenlos im Browser.**

Teste die Browser-Version kostenlos. Wenn du die Excel-Version brauchst, kannst du sie mit 30-tägiger Geld-zurück-Garantie ohne Fragen kaufen.

>
> 🌐 **Im Browser öffnen** → [*interaktive HTML-Version*](https://hyvoid.github.io/Paid-Media-Data-Hub/)
>
> 📥 **Excel herunterladen** → Excel-Arbeitsmappen-Release *(demnächst)*
>
> Sowohl als Browser- als auch als Excel-Version verfügbar.

---

## Was es dir beim Tracking hilft

* Marketingausgaben, Umsatz und ROAS über mehrere Kunden hinweg aus einer einzigen Datenquelle.
* Leistungsunterschiede zwischen Markenkampagnen und Akquise-Kampagnen.
* Inkonsistenzen bei der Kampagnenbenennung, die die Berichtsgenauigkeit stillschweigend fragmentieren.
* Plattform-Leistungsvergleiche nach Beseitigung von Anbieter-Namensvarianten.
* Auswirkungen der Aufnahme neuer Kunden ohne Neuaufbau der Berichtsinfrastruktur.
* Berichtsdiskrepanzen zwischen Legacy-Dashboards und rekonstruierten Analysemodellen.

---

## Warum ich das gebaut habe

Die meisten Marketing-Reporting-Systeme scheitern aus demselben Grund: Sie optimieren die Berichtsproduktion statt die analytische Konsistenz.

In vielen Agenturen entsteht mit jedem neuen Kunden ein weiteres Dashboard, eine weitere Supermetrics-Abfrage, eine weitere Sammlung benutzerdefinierter Formeln und ein weiterer Reporting-Workflow. Am Ende weiß niemand, ob Leistungsunterschiede die geschäftliche Realität oder die Tabellenarchitektur abbilden.

Ein typisches Beispiel:

| Situation                        | Traditionelles Reporting                    |
| -------------------------------- | ---------------------------------------- |
| Kunde A startet auf Google Ads  | Neue Abfrage erstellt                        |
| Kunde B startet auf Meta Ads    | Weitere Abfrage erstellt                        |
| Kunde C benötigt Kanalaufteilung | Zusätzliche Registerkarten und Formeln             |
| Agentur fügt 20 Kunden hinzu           | Hunderte Abfragen und duplizierte Logik |

Das operative Problem ist nicht die Dashboard-Erstellung.

Das operative Problem ist die **Abfrage-Explosion und semantische Drift**.

Zum Beispiel habe ich Agenturen beobachtet, in denen:

* "Google Ads"
* "googleads"
* "AdWords"
* "Google PPC"

als vier getrennte Medienkanäle behandelt wurden.

Das Ergebnis:

```
Reported ROAS:
Google Ads      = 4.1
AdWords         = 2.3
Google PPC      = 3.6

Decision:
Increase spend on Google Ads.
Reduce AdWords budget.
```

Nach semantischer Normalisierung:

```
Unified Google Ads ROAS:
3.1
```

Die Empfehlung hat sich vollständig geändert.

Diese Arbeitsmappe produktisiert ein wiederholbares analytisches Framework:

> **Einmal sammeln → einmal standardisieren → einmal berechnen → unbegrenzt berichten.**

Statt ein weiteres Dashboard zu bauen, baut sie ein wiederverwendbares Entscheidungsmodell.

---

## Häufige Paid-Media-Reporting-Probleme, die dies löst

| Problem                      | Ohne dieses Tool                               | Mit diesem Tool                                 |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Supermetrics-Abfrage-Explosion | Abfrageanzahl wächst linear mit den Kunden         | Ein roher Export speist alle Berichte            |
| Inkonsistente Kanalbenennung | ROAS-Berechnungen werden fragmentiert             | Semantisches Mapping schafft eine kanonische Quelle  |
| Aufwand bei Kundenonboarding   | Neue Dashboards erfordern stundenlange Einrichtung           | Neukunden benötigen eine Konfigurationszeile      |
| Formelwartung | Hunderte duplizierte Formeln driften mit der Zeit | Zentrale Metrik-Engine berechnet einmal          |
| Migrationsrisiko beim Reporting     | Legacy- und neu aufgebaute Berichte lassen sich nicht abgleichen           | Validierungsschicht führt automatisierte QA durch        |
| Fehlgeschlagener Wissenstransfer   | Neue Analysten können historische Modelle nicht pflegen  | Architektur bleibt transparent und prüfbar |

---

## Für wen ist das

Dieses Framework ist konzipiert für:

* Paid-Media-Agenturen, die mehrere Marken betreuen.
* Marketinganalysten, die Supermetrics-Exporte nutzen.
* Performance-Marketing-Berater, die Kundenreporting pflegen.
* Fraktionale CMOs, die kundenübergreifende Leistungstransparenz benötigen.
* Kleine Marketingteams, die warehouse-ähnliche analytische Konsistenz ohne Implementierung eines Warehouses brauchen.

Dieses Framework ist nicht konzipiert für:

* Enterprise-BI-Ersatzprojekte.
* Echtzeit-Attributionssysteme.
* CDP-Implementierungen.
* Marketing-Automatisierungsplattformen.

Für die Nutzung der Ausgaben ist keine Tabellenkalkulations-Expertise erforderlich. Öffne die Browser- oder Excel-Version und beginne sofort mit der Analyse.

---

## Über mich

Ich baue leichtgewichtige analytische Systeme für Situationen, in denen zu viele bewegliche Teile im Spiel sind, um sie zuverlässig im Kopf zu behalten.

Die Frage, mit der ich typischerweise beginne, ist:

> **Welche Informationen müssen an einem Ort existieren, damit die nächste Entscheidung sicher getroffen werden kann?**

Diese semantische Paid-Media-Schicht ist ein Beispiel für diesen Ansatz: die Umwandlung fragmentierter operativer Berichte in ein wiederverwendbares Entscheidungsunterstützungs-Framework ohne Data Warehouse oder Enterprise-Software-Stack.

---

## Technische Details

<details>
<summary><strong>Für technische Reviewer, Excel-Praktiker und Mitarbeiter</strong></summary>

---

### Arbeitsmappen-Architektur

Die Arbeitsmappe folgt einer leichtgewichtigen Star-Schema-Architektur, die vollständig innerhalb von Excel-Tabellen und dynamischen Arrays implementiert ist. 

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

| Schicht          | Arbeitsblatt                 | Zweck                           |
| -------------- | ------------------------- | --------------------------------- |
| Konfiguration  | Config_Setup              | Semantische Mappings und KPI-Ziele |
| Rohdaten       | Raw_Supermetrics_Data     | Einzelne importierte Faktentabelle        |
| Semantische Schicht | Data_Standardization      | Kanonische Geschäftsdimensionen     |
| Berechnung    | Metric_Calculation_Engine | Dynamische Metrik-Aggregation        |
| Validierung     | Validation_Module         | Legacy-Abgleich |
| Präsentation   | Executive_Dashboard       | Executive-Reporting       |
| Präsentation   | Client_Performance        | Kunden-Reporting                  |
| Betrieb     | Admin_Dashboard           | Überwachung und Diagnose        |

---

### Drei Fallen, die selbst erfahrene Marketinganalysten fangen

---

#### Falle 1 — Plattformfragmentierung erzeugt scheinbare Leistungsunterschiede

Es wurde eine Entscheidung zur Budget-Neuzuteilung getroffen.

Die Entscheidung stützte sich auf getrennte ROAS-Berechnungen aus inkonsistenter Kanalbenennung.

| Rohplattform | ROAS |
| ------------ | ---- |
| googleads    | 4.2  |
| AdWords      | 2.5  |
| Google PPC   | 3.4  |

Das Management schlussfolgerte:

> Erhöhe das Google-Ads-Budget und reduziere die AdWords-Ausgaben.

Die Begründung ist falsch, weil die Kategorien dieselbe Werbeplattform darstellen.

Korrigierter Ansatz:

| Standardplattform | ROAS |
| ----------------- | ---- |
| Google Ads        | 3.2  |

Korrigiertes Entscheidungsergebnis:

> Behalte die Budgetzuteilung bei und optimiere stattdessen die Kampagnenstruktur.

<details>
<summary>Formelimplementierung</summary>

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

#### Falle 2 — Kampagnenbenennungs-Varianten verbergen die Kundenökonomie

Es wurde eine Entscheidung zur Kundenprofitabilität getroffen.

Die Entscheidung setzte voraus, dass Kampagnennamen Kunden zuverlässig identifizieren.

Beispiel:

```text
Nike_UK_Brand
NIKE_Generic
Nike Europe
耐克_Brand
```

Ausgewiesenes Ergebnis:

```
Four separate clients.
```

Tatsächliches Ergebnis:

```
One client.
```

Der analytische Fehler entstand, weil Namenskonventionen angenommen statt validiert wurden.

Korrigierter Ansatz:

| Kampagne      | Standardkunde |
| ------------- | --------------- |
| Nike_UK_Brand | Nike            |
| NIKE_Generic  | Nike            |
| Nike Europe   | Nike            |
| 耐克_Brand      | Nike            |

Korrigiertes Entscheidungsergebnis:

> Budgetzuteilungsentscheidungen werden auf Kundenebene statt auf Kampagnenebene getroffen.

<details>
<summary>Formelimplementierung</summary>

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

#### Falle 3 — Dashboard-Migration ohne Validierung zerstört Vertrauen

Ein Reporting-Neuaufbau wurde abgeschlossen.

Das neu aufgebaute Dashboard zeigte:

```
Spend = $1,248,220
```

Das Legacy-Dashboard zeigte:

```
Spend = $1,248,065
```

Das Management schlussfolgerte:

> Das neu aufgebaute Modell ist unzuverlässig.

Die Begründung ist falsch, weil keine systematische Varianzanalyse durchgeführt wurde.

Korrigierter Ansatz:

| Kunde | Legacy | Neu    | Varianz |
| ------ | ------ | ------ | -------- |
| Nike   | 125000 | 125000 | 0        |
| Adidas | 89000  | 89000  | 0        |
| Puma   | 65400  | 65400  | 0        |

Korrigiertes Entscheidungsergebnis:

> Validierung wird objektiv statt politisch.

<details>
<summary>Formelimplementierung</summary>

```excel
=IF(
ABS(B5#-C5#)<0.05,
"✅ Consistent",
"❌ Mismatch"
)
```

</details>

---

### Beispielszenario

Eine Performance-Agentur betreut 18 Kunden.

Aktuelle Berichtsarchitektur:

* 126 Supermetrics-Abfragen
* 54 Berichtsregisterkarten
* 14 duplizierte Dashboard-Vorlagen
* 7 unterschiedliche ROAS-Definitionen

Nach der Migration:

| Metrik                | Vorher    | Nachher       |
| --------------------- | --------- | ----------- |
| Supermetrics-Abfragen  | 126       | 1           |
| Kunden-Onboarding     | 2 Stunden   | 10 Sekunden  |
| Dashboard-Wartung | Wöchentlich    | Null        |
| Formelduplizierung   | Tausende | Zentralisiert |
| Validierungsaufwand     | Manuell    | Automatisiert   |

Importierte Rohdaten:

| Kunde | Ausgaben   | Umsatz |
| ------ | ------- | ------- |
| Nike   | 145.000 | 532.000 |
| Adidas | 89.000  | 278.000 |
| Puma   | 42.000  | 91.000  |

Berechnete Ausgaben:

| Kunde | ROAS | CPA  | CTR  |
| ------ | ---- | ---- | ---- |
| Nike   | 3,67 | 41,3 | 3,9 % |
| Adidas | 3,12 | 52,7 | 2,8 % |
| Puma   | 2,17 | 74,1 | 1,7 % |

Analytische Interpretation:

* Nike übertrifft die Zieleffizienz.
* Adidas bleibt innerhalb akzeptabler Varianz.
* Puma weist Akquise-Ineffizienz auf.

Empfohlene Entscheidung:

* Erhöhe die Nike-Budgetzuteilung.
* Behalte die Adidas-Ausgaben bei.
* Prüfe die Puma-Kampagnenstruktur vor weiteren Investitionen.

---

### Formelreferenz

<details>
<summary>Formeln der semantischen Schicht</summary>

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
<summary>Formeln der Metrik-Engine</summary>

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
<summary>Dashboard-Formeln</summary>

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

### Validierungsregeln

| Feld                   | Regel                        | Fehlerverhalten       |
| ----------------------- | --------------------------- | -------------------- |
| Kundenmapping          | Muss in Mapping-Tabelle existieren | Gibt "Unmapped" zurück   |
| Plattformmapping        | Muss in Mapping-Tabelle existieren | Gibt "Other" zurück      |
| CTR                     | Impressions > 0             | Gibt 0 zurück            |
| ROAS                    | Ausgaben > 0                   | Gibt 0 zurück            |
| CPA                     | Conversions > 0             | Gibt 0 zurück            |
| Validierungsvarianz     | Differenz < $0.05          | Gibt "Consistent" zurück |
| Dashboard-Filter        | Muss in Kundenliste existieren   | Validierungsfehler     |
| Kampagnenklassifizierung | Fehlendes Muster             | Standardmäßig Generic  |

</details>

---

## Weitere Tools in dieser Serie

* **Cross-Border VAT Compliance Console** — Multi-Jurisdiktions-VAT-Abstimmung und Abgabensupport.
* **DTC Inventory Governance Dashboard** — Framework für Bestandsplanung und Nachschubentscheidungen.
* **Project Cost Allocation Engine** — Analyse von Arbeitskräfteauslastung und Profitabilität.
* **CRM-to-Accounting Automation Framework** — Standardisierung operativer Finanz-Workflows.
* **Multi-Currency Trade Analytics Model** — Grenzüberschreitende Finanzentscheidungsunterstützung.

Weitere Tools sind über das GitHub-Profil und die Release-Bibliothek verfügbar.

---

## Lizenz

Dieses Projekt ist unter der **Apache License 2.0** lizenziert.

Du darfst dieses Werk unter den Bedingungen der Apache License 2.0 frei verwenden, modifizieren, verteilen und anpassen.
