[ 🌐 عربي ](README.ar.md) | [ 🇩🇪 Deutsch ](README.de.md) | [ 🇫🇷 Français ](README.fr.md) | [ 🇳🇱 Nederlands ](README.nl.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Construye una capa semántica de reporting de medios pagados sin mantenimiento en Excel & Google Sheets

![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform: Browser + Excel](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool Type: Decision Support](https://img.shields.io/badge/Tool-Analytics%20Decision%20Support-orange.svg)

**Construye un motor de reporting de medios pagados reutilizable que convierte una exportación bruta de Supermetrics en paneles de clientes ilimitados, sin consultas adicionales, sin instalación de software y sin mantenimiento de hojas de cálculo.**

**Sin registro. Sin instalación. Gratis en tu navegador.**

Prueba la versión de navegador gratis. Si necesitas la versión de Excel, puedes comprarla con garantía de devolución de 30 días sin preguntas.

>
> 🌐 **Abrir en el navegador** → [*versión interactiva HTML*](https://hyvoid.github.io/Paid-Media-Data-Hub/)
>
> 📥 **Descargar Excel** → Versión del libro de Excel *(próximamente)*
>
> Disponible en formato de navegador y de Excel.

---

## Lo que te ayuda a seguir

* El gasto en marketing, los ingresos y el ROAS de múltiples clientes desde una única fuente de verdad.
* Las diferencias de rendimiento entre campañas de marca y campañas de adquisición.
* Las inconsistencias en la nomenclatura de campañas que fragmentan silenciosamente la precisión del reporting.
* Las comparaciones de rendimiento por plataforma tras eliminar las variantes de nomenclatura de los proveedores.
* El impacto de incorporar nuevos clientes sin reconstruir la infraestructura de reporting.
* Las discrepancias de reporting entre los paneles antiguos y los modelos analíticos reconstruidos.

---

## Por qué construí esto

La mayoría de los sistemas de reporting de marketing fallan por la misma razón: optimizan la producción de informes en lugar de la consistencia analítica.

En muchas agencias, cada nuevo cliente crea otro panel, otra consulta de Supermetrics, otra colección de fórmulas personalizadas y otro flujo de trabajo de reporting. Al final, nadie sabe si las diferencias de rendimiento reflejan la realidad del negocio o la arquitectura de la hoja de cálculo.

Un ejemplo común:

| Situación                        | Reporting tradicional                    |
| -------------------------------- | ---------------------------------------- |
| El cliente A lanza en Google Ads  | Nueva consulta creada                        |
| El cliente B lanza en Meta Ads    | Otra consulta creada                        |
| El cliente C requiere divisiones por canal | Pestañas y fórmulas adicionales             |
| La agencia añade 20 clientes           | Cientos de consultas y lógica duplicada |

El problema operativo no es la creación de paneles.

El problema operativo es la **explosión de consultas y la deriva semántica**.

Por ejemplo, he observado agencias donde:

* "Google Ads"
* "googleads"
* "AdWords"
* "Google PPC"

eran tratados como cuatro canales de medios separados.

El resultado:

```
Reported ROAS:
Google Ads      = 4.1
AdWords         = 2.3
Google PPC      = 3.6

Decision:
Increase spend on Google Ads.
Reduce AdWords budget.
```

Tras la normalización semántica:

```
Unified Google Ads ROAS:
3.1
```

La recomendación cambió por completo.

Este libro convierte en producto un marco analítico repetible:

> **Recopilar una vez → estandarizar una vez → calcular una vez → reportar infinitamente.**

En lugar de construir otro panel, construye un modelo de decisión reutilizable.

---

## Problemas comunes de reporting de medios pagados que resuelve

| Problema                      | Sin esta herramienta                               | Con esta herramienta                                 |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Explosión de consultas de Supermetrics | El número de consultas crece linealmente con los clientes         | Una exportación bruta alimenta todos los reportes            |
| Inconsistencia en la nomenclatura de canales | Los cálculos de ROAS se fragmentan             | El mapeo semántico crea una fuente canónica única  |
| Sobrecarga de incorporación de clientes   | Los paneles nuevos requieren horas de configuración           | Los clientes nuevos requieren una fila de configuración      |
| Mantenimiento de fórmulas | Cientos de fórmulas duplicadas derivan con el tiempo | El motor central de métricas calcula una sola vez          |
| Riesgo de migración de reporting     | Los informes antiguos y reconstruidos no pueden conciliarse           | La capa de validación realiza QA automatizada        |
| Fallo de transferencia de conocimiento   | Los analistas nuevos no pueden mantener los modelos históricos  | La arquitectura permanece transparente y auditable |

---

## Para quién es esto

Este marco está diseñado para:

* Agencias de medios pagados que gestionan múltiples marcas.
* Analistas de marketing que usan exportaciones de Supermetrics.
* Consultores de marketing de rendimiento que mantienen el reporting de clientes.
* CMOs fraccionales que requieren visibilidad del rendimiento entre clientes.
* Equipos pequeños de marketing que necesitan consistencia analítica tipo almacén de datos sin implementar un almacén.

Este marco no está diseñado para:

* Proyectos de reemplazo de BI empresarial.
* Sistemas de atribución en tiempo real.
* Implementaciones de CDP.
* Plataformas de automatización de marketing.

No se requiere experiencia en hojas de cálculo para consumir los resultados. Abre la versión de navegador o la de Excel y empieza a analizar de inmediato.

---

## Acerca de

Construyo sistemas analíticos ligeros para situaciones en las que hay demasiadas piezas móviles para mantenerlas de forma fiable en la cabeza.

La pregunta con la que suelo empezar es:

> **Qué información debe existir en un solo lugar para que la siguiente decisión se tome con confianza?**

Esta capa semántica de medios pagados es un ejemplo de ese enfoque: transformar el reporting operativo fragmentado en un marco reutilizable de apoyo a la decisión sin requerir un almacén de datos ni una pila de software empresarial.

---

## Detalles técnicos

<details>
<summary><strong>Para revisores técnicos, practicantes de Excel y colaboradores</strong></summary>

---

### Arquitectura del libro

El libro sigue una arquitectura de esquema estrecho ligera implementada por completo dentro de tablas de Excel y matrices dinámicas. 

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

| Capa          | Hoja de trabajo                 | Propósito                           |
| -------------- | ------------------------- | --------------------------------- |
| Configuración  | Config_Setup              | Mapeos semánticos y objetivos KPI |
| Datos brutos       | Raw_Supermetrics_Data     | Tabla de hechos única importada        |
| Capa semántica | Data_Standardization      | Dimensiones de negocio canónicas     |
| Cálculo    | Metric_Calculation_Engine | Agregación dinámica de métricas        |
| Validación     | Validation_Module         | Conciliación con informes antiguos |
| Presentación   | Executive_Dashboard       | Reporting ejecutivo       |
| Presentación   | Client_Performance        | Reporting de clientes                  |
| Operaciones     | Admin_Dashboard           | Monitoreo y diagnóstico        |

---

### Tres trampas que atrapan incluso a analistas de marketing experimentados

---

#### Trampa 1 — La fragmentación de plataformas crea diferencias de rendimiento falsas

Se tomó una decisión de reasignación de presupuesto.

La decisión se basó en cálculos de ROAS separados producidos por una nomenclatura de canales inconsistente.

| Plataforma bruta | ROAS |
| ------------ | ---- |
| googleads    | 4.2  |
| AdWords      | 2.5  |
| Google PPC   | 3.4  |

La dirección concluyó:

> Aumenta el presupuesto de Google Ads y reduce el gasto en AdWords.

El razonamiento es incorrecto porque las categorías representan la misma plataforma publicitaria.

Enfoque corregido:

| Plataforma estándar | ROAS |
| ----------------- | ---- |
| Google Ads        | 3.2  |

Resultado de la decisión corregida:

> Mantén la asignación de presupuesto y optimiza en su lugar la estructura de campañas.

<details>
<summary>Implementación de la fórmula</summary>

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

#### Trampa 2 — Las variantes de nomenclatura de campañas ocultan la economía del cliente

Se tomó una decisión de rentabilidad de cliente.

La decisión supuso que los nombres de campaña identificaban a los clientes de forma fiable.

Ejemplo:

```text
Nike_UK_Brand
NIKE_Generic
Nike Europe
耐克_Brand
```

Resultado reportado:

```
Four separate clients.
```

Resultado real:

```
One client.
```

El fallo analítico ocurrió porque las convenciones de nomenclatura se supusieron en lugar de validarse.

Enfoque corregido:

| Campaña      | Cliente estándar |
| ------------- | --------------- |
| Nike_UK_Brand | Nike            |
| NIKE_Generic  | Nike            |
| Nike Europe   | Nike            |
| 耐克_Brand      | Nike            |

Resultado de la decisión corregida:

> Las decisiones de asignación de presupuesto pasan a ser a nivel de cliente en lugar de a nivel de campaña.

<details>
<summary>Implementación de la fórmula</summary>

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

#### Trampa 3 — La migración de paneles sin validación destruye la confianza

Se completó una reconstrucción del reporting.

El panel reconstruido mostraba:

```
Spend = $1,248,220
```

El panel antiguo mostraba:

```
Spend = $1,248,065
```

La dirección concluyó:

> El modelo reconstruido no es fiable.

El razonamiento es incorrecto porque no se realizó un análisis de varianza sistemático.

Enfoque corregido:

| Cliente | Antiguo | Nuevo    | Varianza |
| ------ | ------ | ------ | -------- |
| Nike   | 125000 | 125000 | 0        |
| Adidas | 89000  | 89000  | 0        |
| Puma   | 65400  | 65400  | 0        |

Resultado de la decisión corregida:

> La validación se vuelve objetiva en lugar de política.

<details>
<summary>Implementación de la fórmula</summary>

```excel
=IF(
ABS(B5#-C5#)<0.05,
"✅ Consistent",
"❌ Mismatch"
)
```

</details>

---

### Escenario de ejemplo

Una agencia de rendimiento gestiona 18 clientes.

Arquitectura de reporting actual:

* 126 consultas de Supermetrics
* 54 pestañas de reporting
* 14 plantillas de panel duplicadas
* 7 definiciones distintas de ROAS

Tras la migración:

| Métrica                | Antes    | Después       |
| --------------------- | --------- | ----------- |
| Consultas de Supermetrics  | 126       | 1           |
| Incorporación de clientes     | 2 horas   | 10 segundos  |
| Mantenimiento de paneles | Semanal    | Cero        |
| Duplicación de fórmulas   | Miles | Centralizado |
| Esfuerzo de validación     | Manual    | Automatizado   |

Datos brutos importados:

| Cliente | Gasto   | Ingresos |
| ------ | ------- | ------- |
| Nike   | 145.000 | 532.000 |
| Adidas | 89.000  | 278.000 |
| Puma   | 42.000  | 91.000  |

Resultados calculados:

| Cliente | ROAS | CPA  | CTR  |
| ------ | ---- | ---- | ---- |
| Nike   | 3,67 | 41,3 | 3,9 % |
| Adidas | 3,12 | 52,7 | 2,8 % |
| Puma   | 2,17 | 74,1 | 1,7 % |

Interpretación analítica:

* Nike supera la eficiencia objetivo.
* Adidas se mantiene dentro de una varianza aceptable.
* Puma muestra ineficiencia de adquisición.

Decisión recomendada:

* Aumenta la asignación de presupuesto de Nike.
* Mantén el gasto en Adidas.
* Audita la estructura de campañas de Puma antes de invertir más.

---

### Referencia de fórmulas

<details>
<summary>Fórmulas de la capa semántica</summary>

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
<summary>Fórmulas del motor de métricas</summary>

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
<summary>Fórmulas del panel</summary>

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

### Reglas de validación

| Campo                   | Regla                        | Comportamiento de error       |
| ----------------------- | --------------------------- | -------------------- |
| Mapeo de clientes          | Debe existir en la tabla de mapeo | Devuelve "Unmapped"   |
| Mapeo de plataformas        | Debe existir en la tabla de mapeo | Devuelve "Other"      |
| CTR                     | Impresiones > 0             | Devuelve 0            |
| ROAS                    | Gasto > 0                   | Devuelve 0            |
| CPA                     | Conversiones > 0             | Devuelve 0            |
| Varianza de validación     | Diferencia < $0.05          | Devuelve "Consistent" |
| Filtro del panel        | Debe existir en la lista de clientes   | Error de validación     |
| Clasificación de campañas | Patrón ausente             | Usa "Generic" por defecto  |

</details>

---

## Otras herramientas de esta serie

* **Cross-Border VAT Compliance Console** — Conciliación de IVA multijurisdiccional y soporte de declaración.
* **DTC Inventory Governance Dashboard** — Marco de planificación de inventario y decisión de reabastecimiento.
* **Project Cost Allocation Engine** — Análisis de utilización de mano de obra y rentabilidad.
* **CRM-to-Accounting Automation Framework** — Estandarización de flujos de trabajo financieros operativos.
* **Multi-Currency Trade Analytics Model** — Apoyo a la decisión financiera transfronteriza.

Más herramientas disponibles a través del perfil de GitHub y la biblioteca de versiones.

---

## Licencia

Este proyecto está licenciado bajo la **Apache License 2.0**.

Eres libre de usar, modificar, distribuir y adaptar esta obra bajo los términos de la Apache License 2.0.
