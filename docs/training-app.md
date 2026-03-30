# training-app
## overall description:
ich möchte geräte oder zumindest übungen spezifizieren können und welches gewicht ich mit wie vielen wiederholungen geschafft habe, viellicht auch
  wie schwer es mir gefallen ist. mit diesen daten kann ich dann beim nächsten training das gewicht präziser einstellen.
  ich will auhc sehen können was waren die letzten gewichte bei welcher übung in den letzten vergangenen trainings, also eine historie. Damit ich
  zum einen meinen fortschritt sehen kann und zum anderen für das nächste training die richtig übung aussuchen kann, vor allem um variationen zu
  ermöglichen, wie "ich habe 3 variationen für Trizeps- Muskel aufbau und will diese immer rotierend machen".
  also eine app die ich während des trainings nutze. Ich trage meine genutzen gewichte für die Übung/Gerät ein. Eine übung wäre hier "Kniebeugen
  Langhantel" oder "reverse fly Maschine". Hier weiß ich noch nciht ob ich das genaue gerät angeben will also "reverse fly cybex prestige". Und ich
  schaue in den Verlauf der gemachten trainings, was ich die letzten  paar male gemacht habe und sehe: "aha reverse fly maschine habe ich letzte
  woche gemacht mit 40kg mit 3x11 Wiederholungen, und davor reversefly Kabelzug 2x15kg(weil zwei gewichte jeweils links/rechts) mit 3x12
  wiederholungen, dann mache ich jetzt face-pulls mit 42kg." 
  zu gewicht: erstmal reicht einzel & bilateral angaben. was auch passiert sind extragewichte, diese gebe ich meist an mit: 15+1,25 (das wäre jetzt ein Geschitsstack 15kg + eine
angehängte scheibe mit 1,25kg, dann muss ich nciht überlegen, wie ich das gewicht aufgebaut bekomme). zukünftig wäre eine asymmetrische angabe auch interessant (zB kniebeugen mit cattlebell einseitig)
  ich möchte trainingspläne erstellen können, bzw übungen zu gruppen zusammenfassen. zB Oberkörpertraining mit 8 Übungen, oder gesamtkörper mit 6
  Übungen. Und variationen pro übung, zB die genannten drei übungen für reverse fly sind eine kategorie mit 3 Übungen für einen Muskelbereich(nur ein Beispiel).
  Ich möchte die option einen trainingsplan auszuwählen ohne weiter etwas konfigurieren zu müssen für das starten des planes an sich. Dann sollte dort die liste der übungen sein. zuerst wäre eine liste der letzten (vllt.4?) genutzen variationen für diese Übung gut, dann kann ich selbst entscheiden. Aber auch die app schlägt direkt  vor und wählt aus zusätzlich zur anzeige der letzten variationen wäre gut (vllt späteres improvement?) So oder so muss es die option geben eine andere variation  auszuwählen als vorgeschlagen, vllt ei dropdown hier? und die möglichkeit eine neue anzulegen (vllt wenn ich in einem anderen studio bin mit anderen geräten oder alle  variationen belegt sind). Auch sollte es möglich sein den trainingsplan in beliebiger reihenfolge abzuarbetien und ggf. auch nciht alle übungen zu absolvieren die  vorgeschlagen werden (ein kürzeres training heute). für planning stelle ich mir vor , dass es mehrere plans gibt (ich habe in meinem momentanen textdatei mit den plänen gerade 4: oberkörper-fokus A, oberkörper-fokus B, beine+core, nur core) von denen ich mir für das training einen aussuche. da sind dann die musclegroups hinterlegt mit ihren exercises und auch die vergangenen session informationen werden teilweise angezeigt.
  Zukünftig könnte ich mir auch AI vorschläge aus den daten vorstellen und sie auch für andere Sportarten zu nutzen, also erweiterbarkeit ist
  wichtig. weiter sollen die daten gut gespeichert und auch ein backup möglihc sein.


  allgemein möchte ich auch dass Domain driven entwickelt wird. 

  da ich auf windows bin , bin ich eingeschränkt in den möglichkeiten eine native app zu generieren.


zu dem DDD modell: Planning: für planning stelle ich mir vor , dass es mehrere plans gibt (ich habe in meinem momentanen textdatei mit den plänen gerade 4: oberkörper-fokus A, oberkörper-fokus B, beine+core, nur core) von denen ich mir für das training einen aussuche. da sind dann die musclegroups hinterlegt mit ihren exercises und auch die vergangenen session informationen werden teilweise angezeigt.
zu plan-slot: Variante A ist besser, plan enthält musclegroups. aber ein hinzufügen von muscle groups aus den vorhandenen (der gesamten muscle group liste) oder ein löschen (aus der bestehenden training-plan) für die heutige session ist möglich während des trainings und dies wäre möglich als neue übung einzubauen bzw damit den bestehenden plan zu bearbeiten.

Analytics domain: du hattest auch eine supporting domain vorhin, welche die vergangenen trainings graphisch aufbereitet darstellen kann, das ist eine gute idee. Von der Prio nicht das wichtigste. Gut wäre hier auch in einer Exercise direkt auf den graphischen verlauf wechslen zu können. vielleicht wäre auch ein graph für eine musclegroup möglich? oder ein graph mit "wann, wie viele übungen, welcher trainingsplan"

zur storage: lokal auf dem gerät, IndexedDB klingt mir sinnvoll


was mir noch einfällt: wir müssen noch über priorisierung bei der umsetzung sprechen. Wann wäre dafür der richtige moment?

