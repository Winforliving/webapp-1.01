// A rangeStore.ts fájl módosított része - selectAction függvény
// Ez a fájl a teljes rangeStore.ts-ből csak a módosított részt tartalmazza

  // Akció kiválasztása
  selectAction: (actionType: ActionType, amount: number, nodeId: number) => {
    const { importedData, navigationHistory, firstSignificantAction, currentNode } = get();
    if (!importedData || !importedData.nodes[nodeId]) return;
    
    const nextNode = importedData.nodes[nodeId];
    
    // Új navigációs lépés hozzáadása
    const newStep: NavigationStep = {
      position: nextNode.player,
      actionType,
      actionAmount: amount,
      nodeId,
      round: 1 // Alapértelmezetten 1. kör
    };
    
    // Ellenőrizzük, hogy ez a pozíció már szerepelt-e a navigációban
    // Ha igen, növeljük a round értéket
    const positionCount = navigationHistory.filter(step => step.position === nextNode.player).length;
    if (positionCount > 0) {
      newStep.round = positionCount + 1;
    }
    
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
    
    // Cellaértékek frissítése az új node alapján
    const newCellValues = createEmptyCellValues();
    
    // Minden kézre frissítjük az értékeket
    Object.entries(nextNode.hands).forEach(([handId, handData]) => {
      const maxFreqIndex = handData.played.indexOf(Math.max(...handData.played));
      const maxFreq = handData.played[maxFreqIndex];
      const maxEv = handData.evs[maxFreqIndex];
      
      if (handId in newCellValues) {
        newCellValues[handId as HandId] = {
          frequency: maxFreq,
          ev: maxEv,
          handData,
          actions: nextNode.actions
        };
      }
    });
    
    // Állapot frissítése
    set({
      currentNodeId: nodeId,
      currentNode: nextNode,
      cellValues: newCellValues,
      navigationHistory: [...navigationHistory, newStep]
    });
  },