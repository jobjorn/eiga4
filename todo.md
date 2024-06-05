Här kan vi ha en att göra-lista för projektet

- useOptimistic fungerar inte i names
- det går att radera namn utan att varningen triggas
- om man försöker lägga till ett namn som redan finns står det "Namnet har lagts till" (istället för "Namnet NAMN har lagts till") och det dyker (efter reload) upp en tom namnruta
- varningspopupen har en helt annan design än resten av sidan, särskilt knapparna sticker ut
- borde lägga till-rutan vara utgråad eller så om båda startat röstning?
- det står "Cancel" på engelska i popupen, och "OK" är lite kort formulerat - borde stå vad som händer egentligen
- knapparna är lite märkligt placerade i förhållande till varandra
- PartnerBox-komponenten är struken från overview-sidan (som borde byta namn till /partner/), ska den användas här?
- StatusMessage-rutan under "Lägg till namn" borde försvinna när det kommer ett StatusMessage om att man tagit bort namn
- addNames, removeName och getNameList borde flyttas från /actions.ts till /names/actions.ts
- popupen i /overview/ måste göras om så att den matchar den här popupen (eller tvärtom)
