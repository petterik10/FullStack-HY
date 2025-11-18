# 0.4: Uusi muistiinpano

```mermaid
sequenceDiagram
    participant browser
    participant server
    
    Note right of browser: Käyttäjä kirjoittaa tekstikenttään muistiinpanon ja painaa "tallenna"-nappia
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note left of server: Lomakkeen post-data lähetetään HTTP POST -pyynnössä
    Note left of server: Palvelin suorittaa app.post-pyynnön ja Lisää uuden muistiinpanon notes-taulukkoon
    server-->>browser: HTTP 302 Found (Location: /notes)
    deactivate server
    
    Note right of browser: Selain tekee automaattisesti uuden GET-pyynnön Location-headerin osoitteeseen. 302 on redirect-statuskoodi
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server
    
    Note right of browser: Linkit CSS- ja Javascript-tiedostoihin löytyy HTML-koodissa. Selain lataa ne automaattisesti
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    
    Note right of browser: Selain alkaa suorittaa main.js-tiedoston koodia.JavaScript tekee GET-pyynnön JSON-muodossa muistiinpanojen datan hakemiseen.
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    Note left of server: Palvelin palauttaa notes-taulukon sisällön JSON-muodossa, joka sisältää myös juuri lisätyn muistiinpanon
    server-->>browser: [{ "content": "narla", "date": "2025-11-05T01:23:32.578Z" }, ... , { "content": "uusi muistiinpano", "date": "2025-11-05T12:57:26.591Z" }]
    deactivate server
    
    Note right of browser: DOM-manipulaation avulla Javascript-koodi käsittelee JSON-datan ja renderöi kaikki muistiinpanot
```

# 0.5: Single Page App
```mermaid
sequenceDiagram
    participant browser
    participant server
    
    Note right of browser: Käyttäjä menee osoitteeseen https://studies.cs.helsinki.fi/exampleapp/spa
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server
    
    Note right of browser: Palvelin palauttaa HTML-dokumentin, jossa on linkit CSS- ja JS-tiedostoihin. Selain lataa ne myös automaattisesti.
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    
    Note right of browser: Selaimessa aletaan suorittaa js-tiedoston koodia. Tiedoston koodi tekee GET-pyynnön  JSON-muodossa muistiinpanojen hakemiseen.
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    Note left of server: Palvelimella palautetaan notes-taulukkon sisältö JSON-muodossa
    server-->>browser: [{ "content": "ok", "date": "2025-11-05T04:33:31.099Z" }, ... ]
    deactivate server
    
    Note right of browser: JavaScriptilla käsitellään JSON-data ja kaikki muistiinpanot renderöidään sivulle dynaamisesti. Siihen käytetään DOM-manipulaatiota.
```

# 0.6: Uusi muistiinpano
```mermaid
sequenceDiagram
    participant browser
    participant server
    
    Note right of browser: Käyttäjä kirjoittaa tekstikenttään muistiinpanon ja  painaa "tallenna"-nappia
    
    Note right of browser: JavaScript estää selaimen lomakkeen lähettämisen palvelimelle (preventDefault), mikä olisi selaimen normaali toimintatapa. Sivu ei siksi lataudu uudelleen. 
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note left of server: POST-pyynnössä on JSON-muotoista dataa:{content: "käyttäjän teksti"}
    Note left of server: Palvelimella lisätään muistiinpano notes-taulukkoon ja palautetaan seuraava JSON-vastaus takaisin
    server-->>browser: HTTP 201 Created: {"message": "note created"}
    deactivate server
    
    Note right of browser: Tässä ei siis tapahdu 302-redirectiä. Sivua ei ladata uudelleen
    
    Note right of browser: JavaScriptilla luodaan muistiinpanosta uusi HTML-elementti ja se lisätään DOM:iin ilman sivun latausta. Käyttäjä näkee uuden muistiinpanon välittömästi.
```
