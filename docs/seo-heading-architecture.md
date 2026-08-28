# Arquitectura SEO y contrato de encabezados — IsarKlima Alemania

Fecha de revisión: 28 de agosto de 2026  
Mercado objetivo: toda Alemania  
Idiomas: alemán canónico en raíz e inglés bajo `/en/`  
Estado: contrato aprobado para implementación en la vista previa; la indexación continúa bloqueada hasta la validación legal y operativa.

## Principios de la arquitectura

- Cada URL responde a una intención distinta y tiene exactamente un H1.
- Los H1 priorizan la búsqueda y la necesidad del usuario. `Deutschland`, `deutschlandweit` o `in ganz Deutschland` sólo aparecen donde aclaran cobertura; no se repiten como relleno SEO.
- La orientación nacional se apoya en la Home, la página de cobertura, el copy introductorio, los metadatos, el enlazado interno y los datos estructurados. No se crean páginas puerta por ciudad o estado federal.
- Los H2 organizan los grandes bloques de respuesta. Los H3 sólo desarrollan su H2. No se usan H4 en esta versión porque no existe una cuarta profundidad real.
- La web habla de planificación e instalación de sistemas de aire acondicionado sin restringir el mensaje a “instalaciones nuevas”. Las páginas contemplan edificios existentes, reformas y obra nueva cuando el contexto lo exige.
- `Blog` será el rótulo inequívoco en la navegación. Las rutas estables `/ratgeber/` y `/en/guides/` se mantienen por su valor semántico y técnico.
- Los artículos pueden explicar diferencias regionales cuando una norma depende del estado federado o del municipio, pero no presentarán una regla de Múnich o Baviera como válida para toda Alemania.
- Las páginas legales conservan sus H1 funcionales y no se fuerzan con términos comerciales.

## Mapa de URLs e intención

| Intención | Alemán | Inglés |
|---|---|---|
| Principal nacional | `/` | `/en/` |
| Instalación split | `/split-klimaanlage-installation/` | `/en/split-air-conditioning-installation/` |
| Apartamentos | `/klimaanlage-wohnung/` | `/en/air-conditioning-apartment/` |
| Casas | `/klimaanlage-haus/` | `/en/air-conditioning-house/` |
| Oficinas y comercio | `/klimaanlage-buero-gewerbe/` | `/en/air-conditioning-office-commercial/` |
| Edificios existentes | `/klimaanlage-nachruesten/` | `/en/retrofit-air-conditioning/` |
| Costes | `/klimaanlage-kosten/` | `/en/air-conditioning-installation-costs/` |
| Cobertura nacional | `/einsatzgebiet/` | `/en/service-area/` |
| Empresa | `/ueber-uns/` | `/en/about/` |
| Contacto | `/kontakt/` | `/en/contact/` |
| Blog | `/ratgeber/` | `/en/guides/` |
| Legal | `/impressum/`, `/datenschutz/` | `/en/imprint/`, `/en/privacy/` |

## Contrato H de páginas comerciales

### `/` ↔ `/en/`

- H1: `Klimaanlagen für Wohn- und Gewerbeimmobilien in Deutschland`
  - EN: `Air conditioning for homes and commercial properties across Germany`
- H2: `Die passende Klimaanlage für Gebäude und Nutzung`
  - EN: `The right air conditioning system for the property and its use`
  - H3: `Single-Split für einen Raum` → `Single-split systems for one room`
  - H3: `Multi-Split für mehrere Räume` → `Multi-split systems for multiple rooms`
  - H3: `Lösungen für Büros und Gewerbeflächen` → `Solutions for offices and commercial spaces`
- H2: `Von der Projektprüfung bis zur Inbetriebnahme`
  - EN: `From project assessment to commissioning`
  - H3: `Projektdaten und erste Einschätzung` → `Project details and initial assessment`
  - H3: `Technische Planung am Gebäude` → `Technical planning for the property`
  - H3: `Installation, Prüfung und Übergabe` → `Installation, testing and handover`
- H2: `Was vor der Montage geklärt wird`
  - EN: `What is clarified before installation`
  - H3: `Zustimmungen und Genehmigungen` → `Consents and permits`
  - H3: `Standort, Schall und Kondensat` → `Location, noise and condensate`
  - H3: `Stromversorgung und Zugänglichkeit` → `Power supply and access`
- H2: `Deutschlandweit koordiniert, passend vor Ort umgesetzt`
  - EN: `Coordinated across Germany and adapted to each property`
- H2: `Was den Aufwand einer Klimaanlagen-Installation beeinflusst`
  - EN: `What affects the scope of an air conditioning installation`
  - H3: `Anzahl der Innen- und Außengeräte` → `Number of indoor and outdoor units`
  - H3: `Leitungsweg und Wanddurchführung` → `Pipe route and wall penetration`
  - H3: `Gebäudezugang und technische Schnittstellen` → `Building access and technical interfaces`
- H2: `Häufige Fragen zur Klimaanlagen-Installation`
  - EN: `Air conditioning installation FAQs`
  - H3: `Welche Angaben werden für ein Angebot benötigt?` → `What information is needed for a quote?`
  - H3: `Muss die Einbausituation vor Ort geprüft werden?` → `Does the installation site need an on-site assessment?`
  - H3: `Brauche ich vor der Montage eine Zustimmung?` → `Do I need consent before installation?`
  - H3: `Wer darf eine Split-Klimaanlage installieren?` → `Who may install a split air conditioning system?`
  - H3: `Können Projekte in ganz Deutschland angefragt werden?` → `Can projects be requested from anywhere in Germany?`
- H2: `Klimaanlagen-Projekt anfragen` → `Discuss your air conditioning project`

### `/split-klimaanlage-installation/` ↔ `/en/split-air-conditioning-installation/`

- H1: `Split-Klimaanlage fachgerecht installieren lassen`
  - EN: `Professional split air conditioning installation`
- H2: `Single-Split oder Multi-Split: Welche Lösung passt?`
  - EN: `Single-split or multi-split: which system fits?`
  - H3: `Single-Split für einen Raum` → `Single-split for one room`
  - H3: `Multi-Split für mehrere Räume` → `Multi-split for multiple rooms`
- H2: `Welche Lösung passt zum Gebäude?`
  - EN: `Which system suits the property?`
  - H3: `Raumnutzung und Wärmeeintrag` → `Room use and heat gain`
  - H3: `Innen- und Außengerät sinnvoll platzieren` → `Positioning indoor and outdoor units`
  - H3: `Leitungsweg und Kondensat` → `Pipe route and condensate drainage`
- H2: `Leistungen bei der Klimaanlagen-Installation`
  - EN: `What the air conditioning installation includes`
  - H3: `Montage der Geräte` → `Mounting the units`
  - H3: `Kältemittelleitungen und Dichtheitsprüfung` → `Refrigerant lines and leak testing`
  - H3: `Inbetriebnahme und Einweisung` → `Commissioning and user handover`
- H2: `Projektablauf und Voraussetzungen in ganz Deutschland`
  - EN: `Project process and requirements across Germany`
  - H3: `Freigaben und Zugänglichkeit` → `Permissions and access`
  - H3: `Elektrische Schnittstelle` → `Electrical interface`
  - H3: `Abgestimmter Leistungsumfang` → `Agreed scope of work`
- H2: `Häufige Fragen zu Split-Klimaanlagen` → `Split air conditioning FAQs`
  - H3: `Was ist der Unterschied zwischen Single- und Multi-Split?` → `What is the difference between single-split and multi-split?`
  - H3: `Wie wird die passende Leistung bestimmt?` → `How is the right capacity determined?`
  - H3: `Wo kann das Außengerät montiert werden?` → `Where can the outdoor unit be installed?`
  - H3: `Wie wird Kondensat abgeführt?` → `How is condensate drained?`
  - H3: `Darf ich das Gerät selbst anschließen?` → `May I connect the system myself?`
- H2: `Installation besprechen` → `Discuss an installation`

### `/klimaanlage-wohnung/` ↔ `/en/air-conditioning-apartment/`

- H1: `Klimaanlage für die Wohnung planen und installieren`
  - EN: `Air conditioning for apartments: planning and installation`
- H2: `Mietwohnung oder Eigentumswohnung: Freigaben zuerst klären`
  - EN: `Rental or owner-occupied apartment: clarify permissions first`
  - H3: `Zustimmung des Vermieters` → `Landlord’s consent`
  - H3: `Beschluss der Wohnungseigentümergemeinschaft` → `Owners’ association resolution`
- H2: `Die passende Split-Lösung für Ihre Wohnung`
  - EN: `The right split system for your apartment`
  - H3: `Ein Raum gezielt kühlen` → `Cooling one room`
  - H3: `Mehrere Räume separat temperieren` → `Controlling several rooms separately`
- H2: `Das Außengerät rücksichtsvoll platzieren`
  - EN: `Positioning the outdoor unit responsibly`
  - H3: `Fassade, Balkon oder geeignete Aufstellfläche` → `Facade, balcony or suitable installation area`
  - H3: `Schall und Schwingungen` → `Noise and vibration`
  - H3: `Kondensat sicher ableiten` → `Safe condensate drainage`
- H2: `So wird die Installation in Ihrer Wohnung vorbereitet`
  - EN: `How an apartment installation is prepared`
  - H3: `Unterlagen und Fotos prüfen` → `Reviewing documents and photos`
  - H3: `Montageweg abstimmen` → `Agreeing the installation route`
  - H3: `Installation und Übergabe` → `Installation and handover`
- H2: `Häufige Fragen zur Klimaanlage in der Wohnung` → `Apartment air conditioning FAQs`
  - H3: `Brauche ich die Erlaubnis meines Vermieters?` → `Do I need my landlord’s permission?`
  - H3: `Muss die WEG zustimmen?` → `Does the owners’ association need to approve?`
  - H3: `Kann das Außengerät auf dem Balkon stehen?` → `Can the outdoor unit be placed on the balcony?`
  - H3: `Wie lassen sich Schall und Vibrationen reduzieren?` → `How can noise and vibration be reduced?`
  - H3: `Welche Unterlagen sollte ich vor der Anfrage vorbereiten?` → `What documents should I prepare before enquiring?`
- H2: `Wohnungsprojekt besprechen` → `Discuss an apartment project`

### `/klimaanlage-haus/` ↔ `/en/air-conditioning-house/`

- H1: `Klimaanlage für das Haus passend planen und installieren`
  - EN: `Air conditioning for your home, planned around the property`
- H2: `Einen Raum oder mehrere Wohnbereiche kühlen` → `Cooling one room or several living areas`
  - H3: `Single-Split für einen gezielten Bereich` → `Single-split for one specific area`
  - H3: `Multi-Split für mehrere Zonen` → `Multi-split for multiple zones`
- H2: `Leistung und Geräteposition bedarfsgerecht abstimmen`
  - EN: `Matching capacity and unit positions to your needs`
  - H3: `Raumgröße, Nutzung und Sonneneintrag` → `Room size, use and solar gain`
  - H3: `Luftverteilung im Raum` → `Air distribution in the room`
  - H3: `Außenstandort und Nachbarschaft` → `Outdoor location and neighbours`
- H2: `Installation im Bestandsgebäude oder Neubau vorbereiten`
  - EN: `Preparing installation in an existing or new home`
  - H3: `Leitungswege früh festlegen` → `Planning pipe routes early`
  - H3: `Stromversorgung und Kondensat` → `Power supply and condensate`
- H2: `Von der technischen Prüfung bis zur Übergabe`
  - EN: `From technical assessment to handover`
  - H3: `Technische Vorprüfung` → `Technical pre-check`
  - H3: `Montage und Verbindung` → `Mounting and connection`
  - H3: `Prüfung und Einweisung` → `Testing and user handover`
- H2: `Häufige Fragen zur Klimaanlage im Haus` → `Home air conditioning FAQs`
  - H3: `Reicht ein Innengerät für das ganze Haus?` → `Is one indoor unit enough for the whole house?`
  - H3: `Wann ist Multi-Split sinnvoll?` → `When does multi-split make sense?`
  - H3: `Wo sollte das Außengerät stehen?` → `Where should the outdoor unit be placed?`
  - H3: `Kann die Installation im Altbau erfolgen?` → `Can air conditioning be installed in an older building?`
  - H3: `Was sollte im Neubau früh geplant werden?` → `What should be planned early in a new build?`
- H2: `Hausprojekt besprechen` → `Discuss a home project`

### `/klimaanlage-buero-gewerbe/` ↔ `/en/air-conditioning-office-commercial/`

- H1: `Klimaanlagen für Büros und Gewerbeflächen`
  - EN: `Air conditioning for offices and commercial spaces`
- H2: `Kühlung passend zu Fläche und Nutzung` → `Cooling matched to the space and its use`
  - H3: `Einzelne Räume klimatisieren` → `Cooling individual rooms`
  - H3: `Mehrere Nutzungszonen versorgen` → `Serving multiple usage zones`
- H2: `Leistung, Geräusch und Betriebszeiten abstimmen`
  - EN: `Matching capacity, noise and operating hours`
  - H3: `Personen, Geräte und interne Wärmelasten` → `People, equipment and internal heat loads`
  - H3: `Geräuscharme Positionierung` → `Noise-conscious positioning`
  - H3: `Montagezeiten und Zugänglichkeit` → `Installation times and access`
- H2: `Deutschlandweite Projektkoordination bis zur Inbetriebnahme`
  - EN: `Nationwide project coordination through to commissioning`
  - H3: `Räume und Anforderungen erfassen` → `Capturing rooms and requirements`
  - H3: `Montageumfang koordinieren` → `Coordinating the installation scope`
  - H3: `Installation und dokumentierte Übergabe` → `Installation and documented handover`
- H2: `Häufige Fragen für Gewerbekunden` → `Commercial customer FAQs`
  - H3: `Welche Gewerbeflächen werden geprüft?` → `Which commercial spaces can be assessed?`
  - H3: `Kann außerhalb der Betriebszeiten montiert werden?` → `Can installation take place outside operating hours?`
  - H3: `Wie werden interne Wärmelasten berücksichtigt?` → `How are internal heat loads considered?`
  - H3: `Wer koordiniert notwendige Elektroarbeiten?` → `Who coordinates any electrical work required?`
  - H3: `Welche Informationen werden für ein Angebot benötigt?` → `What information is needed for a quote?`
- H2: `Gewerbeprojekt besprechen` → `Discuss a commercial project`

### `/klimaanlage-nachruesten/` ↔ `/en/retrofit-air-conditioning/`

- H1: `Klimaanlage im Bestandsgebäude nachrüsten`
  - EN: `Retrofit air conditioning in an existing property`
- H2: `Ist eine Nachrüstung im Gebäude möglich?` → `Can air conditioning be retrofitted in your building?`
  - H3: `Platz für Innen- und Außengerät` → `Space for indoor and outdoor units`
  - H3: `Leitungsweg und Wanddurchführung` → `Pipe route and wall penetration`
  - H3: `Eigentum, Zustimmung und Gebäudeschutz` → `Ownership, consent and building protection`
- H2: `Nachrüstung für Wohnung, Haus und Büro` → `Retrofitting apartments, houses and offices`
  - H3: `Wohnung im Bestand` → `Existing apartment`
  - H3: `Einfamilienhaus und Dachgeschoss` → `House and attic floor`
  - H3: `Büro und Gewerberaum` → `Office and commercial space`
- H2: `So wird die Montage vorbereitet` → `How installation is prepared`
  - H3: `Fotos und Projektdaten prüfen` → `Reviewing photos and project details`
  - H3: `Leistungsumfang klar festlegen` → `Defining the scope clearly`
- H2: `Welche Faktoren beeinflussen den Aufwand?` → `What affects installation complexity?`
  - H3: `Zugang und Arbeitshöhe` → `Access and working height`
  - H3: `Leitungsweg und Oberflächen` → `Pipe route and finishes`
  - H3: `Zusätzliche technische Arbeiten` → `Additional technical work`
- H2: `Häufige Fragen zur Nachrüstung` → `Retrofit FAQs`
  - H3: `Kann fast jedes Gebäude nachgerüstet werden?` → `Can almost any building be retrofitted?`
  - H3: `Ist eine Wanddurchführung notwendig?` → `Is a wall penetration required?`
  - H3: `Was gilt bei Miet- und Eigentumswohnungen?` → `What applies to rental and owner-occupied apartments?`
  - H3: `Wie wird ein unauffälliger Leitungsweg geplant?` → `How is a discreet pipe route planned?`
  - H3: `Welche Fotos helfen bei der ersten Prüfung?` → `Which photos help with the initial assessment?`
- H2: `Nachrüstung besprechen` → `Discuss a retrofit project`

### `/klimaanlage-kosten/` ↔ `/en/air-conditioning-installation-costs/`

- H1: `Was kostet eine Klimaanlage mit Installation?`
  - EN: `How much does air conditioning installation cost?`
- H2: `Warum der Preis vom Projekt abhängt` → `Why the price depends on the project`
  - H3: `Systemtyp und Anzahl der Räume` → `System type and number of rooms`
  - H3: `Leitungslänge, Zugang und Wanddurchführung` → `Pipe length, access and wall penetration`
  - H3: `Elektroarbeiten und weitere Schnittstellen` → `Electrical work and other interfaces`
- H2: `Was ein transparentes Angebot enthalten sollte` → `What a transparent quote should include`
  - H3: `Gerät und technische Ausführung` → `Equipment and technical specification`
  - H3: `Enthaltene Montageschritte` → `Included installation work`
  - H3: `Nicht enthaltene Zusatzarbeiten` → `Excluded additional work`
- H2: `So erhalten Sie ein belastbares Angebot` → `How to obtain a reliable quote`
  - H3: `Adresse, Räume und Nutzung` → `Address, rooms and use`
  - H3: `Fotos und mögliche Gerätepositionen` → `Photos and possible unit positions`
  - H3: `Freigaben und gewünschter Zeitraum` → `Permissions and preferred timing`
- H2: `Häufige Fragen zu den Kosten` → `Installation cost FAQs`
  - H3: `Warum nennen wir keinen Pauschalpreis?` → `Why do we not quote a flat price?`
  - H3: `Ist Multi-Split immer teurer als Single-Split?` → `Is multi-split always more expensive than single-split?`
  - H3: `Welche Zusatzarbeiten können entstehen?` → `What additional work may be required?`
  - H3: `Ist ein Ortstermin für das Angebot nötig?` → `Is a site visit needed for the quote?`
  - H3: `Welche Positionen sollten im Angebot getrennt stehen?` → `Which items should be listed separately in a quote?`
- H2: `Projekt für ein Angebot einreichen` → `Submit your project for a quote`

### `/einsatzgebiet/` ↔ `/en/service-area/`

- H1: `Klimaanlagen-Installation in ganz Deutschland`
  - EN: `Air conditioning installation across Germany`
- H2: `Projektanfragen aus allen Regionen Deutschlands`
  - EN: `Project enquiries from every region of Germany`
  - H3: `Projektadresse und Gebäudedaten` → `Project address and property details`
  - H3: `Planung nach den Bedingungen vor Ort` → `Planning around local site conditions`
- H2: `So koordinieren wir deutschlandweite Installationsprojekte`
  - EN: `How nationwide installation projects are coordinated`
  - H3: `Digitale Vorprüfung` → `Digital initial assessment`
  - H3: `Technische Planung vor Ort` → `On-site technical planning`
  - H3: `Termin, Anfahrt und Montage` → `Scheduling, travel and installation`
- H2: `Was sich je nach Standort unterscheiden kann`
  - EN: `What can vary by location`
  - H3: `Genehmigungen und Gebäuderegeln` → `Permissions and building rules`
  - H3: `Schall- und Nachbarschaftsschutz` → `Noise and neighbourhood protection`
  - H3: `Zugang und technische Schnittstellen` → `Access and technical interfaces`
- H2: `Was wir vor einer Projektzusage prüfen`
  - EN: `What we check before confirming a project`
  - H3: `Verfügbarkeit und Logistik` → `Availability and logistics`
  - H3: `Gebäude und Leistungsumfang` → `Property and scope of work`
- H2: `Häufige Fragen zur deutschlandweiten Abdeckung`
  - EN: `Nationwide service FAQs`
  - H3: `Können Projekte aus allen Bundesländern angefragt werden?` → `Can projects be requested from every German state?`
  - H3: `Wie beginnt die Prüfung eines weiter entfernten Projekts?` → `How does the assessment of a more distant project begin?`
  - H3: `Gelten überall dieselben Genehmigungen?` → `Do the same permissions apply everywhere?`
  - H3: `Wie werden Anfahrt und Montagezeit berücksichtigt?` → `How are travel and installation time considered?`
  - H3: `Wann kann ein Projekt verbindlich bestätigt werden?` → `When can a project be confirmed?`
- H2: `Projektstandort mitteilen` → `Tell us where your project is`

### `/ueber-uns/` ↔ `/en/about/`

- H1: `Über IsarKlima` → `About IsarKlima`
- H2: `Klimaanlagen passend zum Gebäude geplant` → `Air conditioning planned around the property`
  - H3: `Single- und Multi-Split-Systeme` → `Single- and multi-split systems`
  - H3: `Wohnungen, Häuser und Gewerbeflächen` → `Apartments, homes and commercial spaces`
- H2: `Projektkoordination in ganz Deutschland` → `Project coordination across Germany`
  - H3: `Klare Projektangaben` → `Clear project information`
  - H3: `Abgestimmter Leistungsumfang` → `Agreed scope of work`
  - H3: `Dokumentierte Übergabe` → `Documented handover`
- H2: `Klare Zuständigkeiten von der Planung bis zur Übergabe`
  - EN: `Clear responsibilities from planning to handover`
  - H3: `Qualifizierte kältetechnische Arbeiten` → `Qualified refrigeration work`
  - H3: `Klare Projektdokumentation` → `Clear project documentation`
  - H3: `Elektrische Arbeiten und Partnerleistungen` → `Electrical work and partner services`
- H2: `Häufige Fragen über unsere Arbeitsweise` → `FAQs about how we work`
  - H3: `Für welche Gebäude planen wir Klimaanlagen?` → `Which types of property do you plan for?`
  - H3: `Was umfasst die Klimaanlagen-Installation?` → `What does the installation service cover?`
  - H3: `Wie wird der Leistungsumfang festgelegt?` → `How is the scope of work agreed?`
  - H3: `Wer führt Facharbeiten aus?` → `Who carries out specialist work?`
  - H3: `In welchen Sprachen kann ein Projekt abgestimmt werden?` → `Which languages are available for project coordination?`
- H2: `Projekt besprechen` → `Discuss your project`

### `/kontakt/` ↔ `/en/contact/`

- H1: `Klimaanlagen-Projekt anfragen`
  - EN: `Discuss your air conditioning project`
- H2: `Diese Angaben helfen bei der ersten Prüfung` → `Information needed for the initial assessment`
  - H3: `Einsatzort und Gebäudeart` → `Location and building type`
  - H3: `Räume und gewünschtes System` → `Rooms and preferred system`
  - H3: `Eigentums- und Freigabestatus` → `Ownership and permission status`
- H2: `Wie es nach der Anfrage weitergeht` → `What happens after your enquiry`
  - H3: `Rückfragen und technische Vorprüfung` → `Follow-up questions and technical pre-check`
  - H3: `Ortstermin und Angebot, falls erforderlich` → `Site visit and quote where required`
- H2: `Häufige Fragen zur Anfrage` → `Enquiry FAQs`
  - H3: `Wann kann ich Fotos bereitstellen?` → `When can I share photos?`
  - H3: `Wie werden Fotos und Pläne übermittelt?` → `How are photos and plans shared?`
  - H3: `Muss ich bereits ein Gerät ausgewählt haben?` → `Do I need to have selected a system already?`
  - H3: `Wann wird ein Ortstermin nötig?` → `When is a site visit needed?`
  - H3: `Ist die Anfrage bereits ein Auftrag?` → `Does an enquiry constitute an order?`
- H2: `Projektformular` → `Project form`

## Contrato H del blog

### `/ratgeber/` ↔ `/en/guides/`

- H1: `Klimaanlagen-Blog: Ratgeber für Planung und Installation`
  - EN: `Air conditioning blog: planning and installation guides`
- H2: `Aktuelle Artikel` → `Latest articles`
  - Cada tarjeta de artículo publicada usa su título como H3 bajo este bloque.
- H2: `Themen im Blog` → `Explore the blog by topic`
  - H3: `Planung und Systemwahl` → `Planning and system choice`
  - H3: `Gebäude, Zustimmung und Schallschutz` → `Properties, permissions and noise`
  - H3: `Installation, Betrieb und Kosten` → `Installation, operation and costs`
- H2: `Häufige Fragen zum Klimaanlagen-Blog` → `Air conditioning blog FAQs`
  - H3: `Sind die Artikel eine technische Planung?` → `Do the articles replace technical planning?`
  - H3: `Werden rechtliche Fragen abschließend beantwortet?` → `Do the guides provide definitive legal advice?`
  - H3: `Wie aktuell sind die Inhalte?` → `How current are the guides?`
  - H3: `Kann ich ein Thema vorschlagen?` → `Can I suggest a topic?`
  - H3: `Wie gelange ich von einem Artikel zur Projektprüfung?` → `How do I move from an article to a project assessment?`
- H2: `Eigenes Projekt besprechen` → `Discuss your own project`

### Artículos publicados

Los H1 de los seis pares editoriales se mantienen porque ya responden a búsquedas nacionales y no contienen un topónimo artificial:

1. `Klimaanlage in der Mietwohnung: Was ist vor der Installation zu klären?`
   - EN: `Air conditioning in a rental apartment: what must be clarified before installation?`
2. `Klimaanlage in der Eigentumswohnung: WEG und Außengerät`
   - EN: `Air conditioning in a condominium: owners’ association and outdoor unit`
3. `Single- oder Multi-Split-Klimaanlage: Welche Lösung passt?`
   - EN: `Single-split or multi-split air conditioning: which system fits?`
4. `Klimaanlagen-Außengerät: Standort, Schall und Nachbarschaft`
   - EN: `Air conditioning outdoor units: location, noise and neighbours`
5. `Welche Leistung braucht eine Klimaanlage?`
   - EN: `What air conditioning capacity does a room need?`
6. `Klimaanlage installieren: Ablauf von der Anfrage bis zur Übergabe`
   - EN: `Air conditioning installation: from enquiry to handover`

Cada artículo conserva esta secuencia semántica: H1 del tema → H2 de los grandes pasos o decisiones → H3 explicativos → H2 de preguntas frecuentes con preguntas H3 → H2 de contacto. El cuerpo y las fuentes se revisarán para separar normativa federal, estatal y municipal.

## Páginas legales

### `/impressum/` ↔ `/en/imprint/`

- H1: `Impressum` → `Imprint`
- H2: `Angaben zum Diensteanbieter` → `Service provider details`
- H2: `Register, Aufsicht und berufliche Angaben` → `Registers, supervision and professional information`
- H2: `Verantwortung für Inhalte` → `Responsibility for content`

### `/datenschutz/` ↔ `/en/privacy/`

- H1: `Datenschutzhinweise` → `Privacy information`
- H2: `Verantwortlicher und Kontakt` → `Controller and contact`
- H2: `Technische Bereitstellung dieser Website` → `Technical delivery of this website`
- H2: `Projektanfragen über Formspree` → `Project enquiries through Formspree`
- H2: `Cookies und externe Inhalte` → `Cookies and external content`
- H2: `Rechte betroffener Personen` → `Data-subject rights`

## Contrato técnico verificable

- Un H1 por URL, sin saltos H1 → H3 y sin headings vacíos.
- Matriz exacta H1-H3 comparada contra el HTML final en el build.
- `lang="de-DE"` en alemán y `lang="en-DE"` en inglés.
- Title, description, canonical y Open Graph únicos por URL.
- Canonical autorreferente y `hreflang` recíproco `de-DE`, `en-DE`, `x-default`.
- `Organization`, `WebSite`, `WebPage` o `CollectionPage`, `Service`, `BreadcrumbList`, `ItemList`, `BlogPosting` y `FAQPage` sólo cuando el HTML visible y los datos verificados los respaldan. No se publica `LocalBusiness` sin NAP y sede real.
- La cobertura se expresa como Alemania en los datos estructurados del servicio, sin inventar sedes, oficinas ni perfiles locales.
- Borradores, artículos futuros y traducciones incompletas quedan fuera de listados, RSS, sitemap, `llms.txt` y schema.
- El archivo del blog aparece inmediatamente después del hero, ordenado por `publishDate`, y deja de depender de una introducción larga antes de mostrar artículos.
- La vista previa conserva `noindex, nofollow` hasta aprobación expresa de identidad, legal, capacidad nacional, Formspree y lanzamiento.
