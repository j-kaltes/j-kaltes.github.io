/*      This file is part of Juggluco, an Android app to receive and display         */
/*      glucose values from Freestyle Libre 2 and 3 sensors.                         */
/*                                                                                   */
/*      Copyright (C) 2021 Jaap Korthals Altes <jaapkorthalsaltes@gmail.com>         */
/*                                                                                   */
/*      Juggluco is free software: you can redistribute it and/or modify             */
/*      it under the terms of the GNU General Public License as published            */
/*      by the Free Software Foundation, either version 3 of the License, or         */
/*      (at your option) any later version.                                          */
/*                                                                                   */
/*      Juggluco is distributed in the hope that it will be useful, but              */
/*      WITHOUT ANY WARRANTY; without even the implied warranty of                   */
/*      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.                         */
/*      See the GNU General Public License for more details.                         */
/*                                                                                   */
/*      You should have received a copy of the GNU General Public License            */
/*      along with Juggluco. If not, see <https://www.gnu.org/licenses/>.            */
/*                                                                                   */
/*      Fri Jan 27 15:20:04 CET 2023                                                 */



#include "jugglucotext.h"
#ifndef WEAROS
constexpr static std::string_view delabels[]={ "Ins schnell", "Kohlenhydra", "Dextrose", "Langes Insu", "radeln", "Walk", "Blut"};
constexpr static Shortcut_t  deshortinit[]= { {"Bread",
        .48},
        {"Currantbun1",
        .56f},
        {"Currantbun2",
        .595f},
        {"Grapes",
        .165f},
        {"FruitYog",
        .058f},
        {"Rice",
        .75f},
        {"Macaroni",
        .65f},
        {"Tomato",
        .03f},
        {"Mexican mix",
        .078f},
        {"OrangeJuice",
        .109f},
        {"Mix(Carrot)",
        .07f},
        {"Mix mushro",
        .07300000f}};
#endif
//DIT IS EEN NIEUWE FILE
jugglucotext detext {
.daylabel={"So","Mo","Di","Mi","Do","Fr","Sa"},

.speakdaylabel={"Sonntag",
"Montag",
"Dienstag",
"Mittwoch",
"Donnerstag",
"Freitag",
"Samstag"},
.monthlabel={ "Jan", "Feb", "Mär",  "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"},
.scanned="Gescannt",
	.readysecEnable="Sensor in %d Minuten bereit. Erneut scannen, um Streaming zu aktivieren.",
         .readysec="Sensor bereit in %d Minuten.",
.networkproblem="Keine Glukose vom Klon",
.enablebluetooth="Bluetooth aktivieren",
.useBluetoothOff="'Bluetooth nutzen' aus",
.noconnectionerror=": Keine Verbindung",
.stsensorerror=": Sensorfehler",
.streplacesensor=": Sensor ersetzen?",
.endedformat="Sensor %s funktioniert nicht mehr. state=%d",
.notreadyformat="Sensor %s nicht bereit. state=%d",
#ifndef WEAROS
.median="Median",
.middle="mittlere",
#endif
.history="History",

.historyinfo="Einmal alle 15 Minuten.\nAuf dem Sensor gespeichert für 8 Stunden.\nDurch das Scannen werden sie an dieses Programm übertragen.\nSensor: ",
.history3info="Einmal alle 5 Minuten.\nWird 14 Tage lang auf dem Sensor gespeichert.\nÜber Bluetooth an dieses Programm übertragen.\nSensor: ",
.sensorstarted= "Gestartet:",
.lastscanned="Zuletzt gescannt:",
.laststream="Letzter Stream:",
.sensorends="Endet offiziell:",
 .sensorexpectedend="Erwartetes Ende:",
#ifndef WEAROS
.newamount="Neue Menge",
.averageglucose="Durchschnittliche Glukose: ",
.duration="Dauer: %.1f Tage",
.timeactive="%.1f%% der Zeit aktiv",
.nrmeasurement="Anzahl Messungen: %d",
.EstimatedA1C="Geschätzter HbA1c: %.1f%% (%d mmol/mol)",
.GMI="Glucose Management Indicator: %.1f%% (%d mmol/mol)",
.SD="SD: %.2f",
.glucose_variability="Glukosevariabilität: %.1f%%",
      .menustr0={
"System UI       ",
"Menus",
"Uhren",
"Sensor",
"Einstellungen",

#if defined(SIBIONICS)
"Sibionics",
#else
"About",
#endif
"Schließen",
"Alarm stoppen"
},
.menustr1={
"Export",
"Klon",
detext.newamount,
"Liste",
"Statistiken",
"Sprechen",
"Schweben       "
},
.menustr2= {"Letzter Scan","Scans","Stream","History","Mengen","Mahlzeiten","Dunkelmodus       "},
.menustr3= {hourminstr,"Suche", "Datum", "Vortag", "Tag später", "Woche zurück", "Woche später"},

#else
  .amount="Menge",
  .menustr0= {
"Klon",
"Sensor",
	"    Darkmode      ",
         "Einstellen",
"Stop Alarm" },
.menustr2= {"Datum      ",hourminstr,
"Vortag                  ",detext.amount},
#endif

.scanerrors={
{"Scanfehler (%d)","Versuchen Sie es erneut"},
{"Installationsfehler","?"},
{"Datenverarbeitungsfehler","Versuchen Sie es erneut"},
{"Sensor wird aktiviert",""},
{"Sensor ist definitiv beendet",""},
{"Sensor bereit in","%d Minuten"},
{"Sensorfehler (373)","Versuchen Sie es später erneut"},
{"Neuer Sensor initialisiert","Zur Verwendung erneut scannen"},
{"","Blockiert Berührungen während des Scannens"},
{"",""},
{"Fehler bei Bibliotheksinitialisierung", "Neuinstallation durch Entfernen der Bibliothek erzwingen"},
{"Klasseninitialisierungsfehler","Mach etwas"},
{"Vorgang dauert zu lange","Ich beende das Programm"},
{"Sensor ersetzen (365)","Ihr Sensor funktioniert nicht. Bitte entfernen Sie Ihren Sensor und starten Sie einen neuen."},
{"Sensor ersetzen (368)","Ihr Sensor funktioniert nicht. Bitte entfernen Sie Ihren Sensor und starten Sie einen neuen."},
{"",""},
{"Scanfehler","Versuchen Sie es erneut"}},


.libre3scanerror={"FreeStyle Libre 3, Scanfehler", "Versuchen Sie es erneut"},
.libre3wrongID={"Falsche Konto-ID?","Verwenden Sie dasselbe Libreview-Konto, mit dem Sie den Sensor aktiviert haben"},
.libre3scansuccess= {"FreeStyle Libre 3-Sensor", "Glukosewerte werden jetzt von Juggluco empfangen"},
.unknownNFC={"Unerkannter NFC-Scanfehler", "Versuchen Sie es erneut"},

.nolibre3={"FreeStyle Libre 3 Sensor","Holen Sie sich die richtige Version von https://www.juggluco.nl/download.html"},
#ifndef WEAROS
.advancedstart= R"(<h1>Geändertes Gerät</h1>
<p>Eine der von dieser Anwendung verwendeten Bibliotheken hat einen BUG, der sie zum Absturz bringt, wenn sie bestimmte Dateien erkennt. Ihr Gerät enthält einige dieser Dateien. Dieses Programm enthält einen Hack, um diesen BUG zu umgehen, aber es ist wahrscheinlich besser, diese Dateien auf andere Weise unauffindbar zu machen. Magisk hat beispielsweise die Möglichkeit, Root für bestimmte Anwendungen zu verbergen (Magiskhide oder Denylist) und den eigenen Namen zu ändern, beides wird benötigt. In Ihrem Fall hat es Probleme mit der folgenden Datei)",
	.add_s=false,
.shortinit=deshortinit,
.labels=delabels,
.checked="aktiviert",
.unchecked="deaktiviert",
.Undetermined="",
.FallingQuickly="Fällt rasch",
.Falling="Fällt",
.Stable="Ändert sich langsam",
.Rising="Steigt",
.RisingQuickly="Steigt rasch",

#endif
.receivingpastvalues="Alte Glukosewerte kommen rein"
		}


		;


extern void setusede() ;
void setusede() {
	usedtext= &detext;
	}
