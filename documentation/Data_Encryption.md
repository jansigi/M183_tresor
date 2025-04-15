## Encryption Konzept

![img.png](Konzept.png)


## Passwort Hashing

### Salt

- Ein Salt ist eine zufällige Zeichenkette, die zu einem Passwort hinzugefügt wird, bevor es gehasht wird und ist pro Benutzer einzigartig.
- Es wird verwendet, um sicherzustellen, dass identische Passwörter unterschiedliche Hashes erzeugen.

### Pepper

- Ein Pepper ist eine geheime Zeichenkette, die zu einem Passwort hinzugefügt wird, bevor es gehasht wird und ist für alle Benutzer gleich.
- Das Pepper is in der Anwendung gespeichert und wird nicht in der Datenbank gespeichert.
- Es wird verwendet, um sicherzustellen, dass selbst wenn ein Angreifer Zugriff auf die Datenbank hat, er die Passwörter nicht entschlüsseln kann, da er nicht über den Pepper verfügt.

### Implementierung

Ich lade das Pepper aus der Konfiguration, das Salt benutze ich vom gefundenen User und benutze sie, um das Passwort zu hashen.
Die reihenfolge ist: salt + password + pepper

## Encryption

- AES (Advanced Encryption Standard)
- AES ist ein symmetrischer Verschlüsselungsalgorithmus, der einen geheimen Schlüssel verwendet, um Daten zu verschlüsseln und zu entschlüsseln.
- Ich benutze für das Password den MasterKey mit dem Salt des Benutzers.
- Der MasterKey lade ich aus der Konfiguration.