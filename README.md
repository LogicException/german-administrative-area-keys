# german administrative area keys

This package contains types and classes for german area keys 
AGS (Amtlicher Gemeindeschlüssel) and ARS (Amtlicher Regionalschlüssel).

You can download the latest record of all german administrative areas from: 

https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html


## How to use

### AGS

Provides a class which represents an _Amtlichen Gemeindeschlüssel_ data object. You can create a new object by passing
each part of an AGS via constructor or parse an AGS String via static fromString method.

````javascript
// pass each part of AGS as constructor parameter
const ags = new AGS("14", "7", "30", "070");

// pass full AGS string via parseString method
const ags = AGS.fromString("14730070");
````

### ARS

Provides a class which represents an _Amtlichen Regionalschlüssel_ data object. Similar to the AGS class you can pass 
each part of an ARS via constructor parameter or parse an ARS String via static fromString method.

````javascript
// pass each part of ARS as constructor parameter
const ars = new ARS("14", "7", "30", "0070", "070");

// pass full ARS string via parseString method
const ars = ARS.fromString("147300070070");
````

Technically an ARS is an AGS with a little more information (Verbandsschlüssel). So it is possible to extract an AGS 
from an ARS. Conversely, you cannot create an ARS from an AGS because the lack of information (Verbandsschlüssel).

````javascript
const ars = new ARS("14", "7", "30", "0070", "070");
const ags = ars.toAGS();
    
console.log(ags.toString());
// prints: "14730070"
````