# Változások

## 1.01 verzió - 2025-03-26

### Hibajavítások
- **rangeStore.ts** - A `selectAction` függvény módosítása, hogy az első jelentős akciót a jelenlegi pozícióhoz kötve tárolja el, nem pedig a következő node-hoz.
- Ez a javítás megoldja azt a problémát, hogy az akciók helyesen kerüljenek tárolásra (pl. "EP_R_xxxx" formátumban "MP_R_xxxx" helyett), így a node térkép helyesen tudja keresni az akciókat.

### Változtatás részletei

A módosítás a következő fő részeket érinti:
1. A `currentNode` lekérése a state-ből
2. A `currentPosition` meghatározása:
   - Ha van navigációs történet, akkor az utolsó lépés pozícióját használjuk
   - Ha nincs, akkor a jelenlegi node pozícióját
3. Új `significantAction` objektum létrehozása, amely a jelenlegi pozíciót használja
4. A `round` érték frissítése, hogy megfelelően számoljon a jelenlegi pozícióval
5. A log üzenet frissítése, hogy a helyes pozíciót mutassa

Ezen módosítások eredményeként a rendszer helyesen fogja tárolni, hogy melyik pozíció hajtotta végre az akciót. Például, amikor az EP pozíció végrehajt egy raise akciót, és ezután más pozícióra (pl. LJ) kattintunk, a rendszer helyesen fogja keresni az "EP_R_xxx" kulcsot a node térképben.