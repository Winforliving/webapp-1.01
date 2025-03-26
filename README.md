# Póker Range Megjelenítő Webapp 1.01

Interaktív póker chart megjelenítő webapp, amely képes Holdem Resources Calculatorból (HRC) exportált range-eket kezelni, megjeleníteni és egy dinamikus, Floptimal-stílusú navigációval interaktívan böngészhetővé tenni.

## Főbb funkciók

- Chart Grid a póker kezek megjelenítésére
- Action Bar a különböző játékhelyzetek gyors navigációjához
- HRC .json fájlok importálása és feldolgozása
- Dinamikus navigáció a póker stratégiákban

## Technológiák

- **Frontend keretrendszer:** Next.js
- **UI library:** React.js
- **CSS Framework:** Tailwind CSS
- **Animációk:** Framer-motion
- **State management:** Zustand
- **Adatok kezelése:** HRC .json fájlokból importált adatok

## Verzió 1.01 frissítés

Ebben a verzióban a következő hiba javítása történt meg:

### Bug javítása: Első jelentős akció helytelen tárolása

A `selectAction` függvényt módosítottuk, hogy az első jelentős akciót a jelenlegi pozícióhoz kötve tárolja el, nem pedig a következő node-hoz. Ez a javítás biztosítja, hogy a rendszer helyesen építse fel az akciók láncolatát:

```typescript
// Ha ez egy jelentős akció (Raise vagy Call) és még nincs eltárolva első jelentős akció
if ((actionType === ActionType.R || actionType === ActionType.C) && amount > 0 
    && firstSignificantAction === null && currentNode) {
  // A jelenlegi pozíciót használjuk, nem a következő node pozícióját
  const currentPosition = navigationHistory.length > 0 
    ? navigationHistory[navigationHistory.length - 1].position
    : currentNode.player;
    
  // Létrehozzuk a jelentős akciót a jelenlegi pozícióval
  const significantAction: NavigationStep = {
    position: currentPosition,
    actionType,
    actionAmount: amount,
    nodeId,
    round: navigationHistory.filter(step => step.position === currentPosition).length
  };
  
  console.log(`Első jelentős akció eltárolása: ${PositionNames[currentPosition]} ${actionType} ${amount}`);
  set({ firstSignificantAction: significantAction });
}
```

Ez a módosítás megoldja azt a problémát, hogy az akciók helyesen kerüljenek tárolásra (pl. "EP_R_xxxx" formátumban "MP_R_xxxx" helyett), így a node térkép helyesen tudja keresni az akciókat, és amikor egy másik pozícióra kattintasz, a megfelelő stratégiát fogja mutatni.