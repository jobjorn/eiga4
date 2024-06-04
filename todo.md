Här kan vi ha en att göra-lista för projektet

- Varning för att lägga till namn när man tryckt på påbörja omröstningsknappen.

  - kolla om man är redo att rösta.

- Om man försöker lägga till blank space - disabled knapp.
- titleCase överallt där man sparar ett namn eller jämför ett namn.
- useOptimistic fungerar inte i names
- om jag trycker att jag är readyToVote så ändras det till TRUE i databasen... och för min partner ändras det till FALSE, så vi kommer inte vidare
- det går att radera namn utan att varningen triggas
- det går att radera namn som ens partner lagt till
- om man försöker lägga till ett namn som redan finns står det "Namnet har lagts till" (istället för "Namnet NAMN har lagts till") och det dyker (efter reload) upp en tom namnruta
- det går inte att lägga till ett namn som redan står med/det syns inte att båda partners har lagt till samma namn
- varningspopupen har en helt annan design än resten av sidan, särskilt knapparna sticker ut
- varningspopupen kommer upp även om ingen sagt att hen är redo
- det finns ingen information som indikerar att ens partner är redo och väntar på en
- borde lägga till-rutan vara utgråad eller så om båda startat röstning?
- det står "Cancel" på engelska i popupen, och "OK" är lite kort formulerat - borde stå vad som händer egentligen
- knapparna är lite märkligt placerade i förhållande till varandra
- PartnerBox-komponenten är struken från overview-sidan (som borde byta namn till /partner/), ska den användas här?
- StatusMessage-rutan för ta bort namn är i gridet
- StatusMessage-rutan under "Lägg till namn" borde försvinna när det kommer ett StatusMessage om att man tagit bort namn
- addNames, removeName och getNameList borde flyttas från /actions.ts till /names/actions.ts
- om min partner tryckt på "Start voting!"-knappen ser jag ändå bara "Start voting!"-knappen, men i koden ser det ut som att det är meningen att jag ska se "PARTNER är redo att rösta, är du?"
- i VotingInvitation.tsx finns det en beskrivning av en if-sats som inte verkar matcha if-satsen
- förslag: kolla redan i /names/page.tsx om man har en partner och skicka ner "hasPartner=true/false" i VotingInvitation, så kan man förenkla mycket logik med bara if(hasPartner){ alla fyra varianter }else{ sätt igång att rösta whenever }. jmfr /results/page.tsx för mycket datahämtning (som då dessutom kan ske i en server component)
- popupen i /overview/ måste göras om så att den matchar den här popupen (eller tvärtom)
- man får "Error: Cannot read properties of undefined (reading 'partneredAccepted')" om man försöker besöka /names utan en partner
- när jag bjudit in en partner kan jag gå till sidan, men inte lägga till några namn - får inget error men det är en massa prisma-errors i konsollen
