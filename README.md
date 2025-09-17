<h2>Dette var en 24-timers programmeringseksamen. Opgaven lød som følgende:</h2>
<em>Du skal i dette eksamensprojekt bygge en full-stack REST web-applikation. Opgavens tema er Siren Alert LA og består af en front-end og en back-end. Back-end skal laves med brug af Spring Boot, H2 og/eller MySQL med tilhørende unittests af funktionaliteten.
Front-end skal laves med HTML/CSS og JavaScript.</em>

<h3>Case: Siren Alert LA</h3>
<em>Los Angeles brandvæsen ønsker et nyt digitalt varslingssystem, der kan reagere på brandmeldinger fra sensorer placeret i byen og i skovene omkring byen.
Fra brandchefen i LA (Fire Chief, Los Angeles Fire Department) har vi flg. beskrivelse af systemet:
<br><br>
<p>“Vi har brug for en løsning, der kan holde styr på vores varslingsinfrastruktur. Hver af
vores sirener har en fast placering i byen, og vi skal kunne se, om de virker som de skal,
og hvad deres seneste status har været – fx om de sidst blev brugt til at advare eller
berolige befolkningen. Nogle af sirenerne er midlertidigt ude af drift, og det skal systemet
naturligvis også kunne håndtere.”</p>
“Når der opstår en brand, vil vi gerne kunne registrere hændelsen digitalt – med tid og
sted. Systemet skal også kunne finde og tilknytte relevante sirener i området, så de
aktiveres automatisk. Når branden er slukket, skal den kunne lukkes i systemet, og
sirenerne skal derefter skifte status.”<p>Når en brand opstår, skal systemet kunne:
<ls>
  <ul>• Registrere brande (med position)</ul>
  <ul>• Automatisk identificere sirener inden for 10 km af branden</ul>
  <ul>• Aktivere sirener i nærheden</ul>
  <ul>• Angive status (fare/fred)</ul>
  <ul>• Afmelde en brand, så sirener går fra fare til fred</ul>
</p>
</ls>

Du skal udvikle systemets kernefunktionalitet – både backend og frontend – herunder CRUD for sirener og en alarmfunktion baseret på position.
<br><br>
</em>

## Acknowledgments 🤝
- Leaflet for the interactive map.


## Dette er frontend-delen af projektet *LA Fire*.

Repositories
- Frontend: [LA Fire Frontend](https://github.com/esralund01/Eksamen24hFrontend_EsraLund) (dette repo)
- Backend: [LA Fire Backend](https://github.com/esralund01/Eksamen24hBackend_EsraLund) 
