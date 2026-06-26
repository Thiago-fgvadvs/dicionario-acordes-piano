# Dicionário de Acordes para Piano

App local para estudar cifras no piano. Digite um acorde (`A9`, `C#m7(b5)`, `F7(#11)`) ou uma progressão (`Am7 D9 Gmaj7`) para ver:

- desenho do acorde no teclado;
- notas e graus da fórmula;
- inversões disponíveis;
- acordes de uma sequência;
- biblioteca por tônica e qualidade;
- som do acorde pelo botão `Tocar`.

## App publicado

https://thiago-fgvadvs.github.io/dicionario-acordes-piano/

## Rodar

```bash
npm run dev
```

Abra `http://localhost:4173/`.

## Testes

```bash
npm test
```

## Cifras suportadas

O motor cobre tríades, suspensos, sextas, sétimas, nonas, décimas primeiras, décimas terceiras, acordes alterados, meio diminutos, diminutos, aumentados, `add`, alterações como `b9`, `#9`, `#11`, `b13`, e baixos com barra como `C/E`.
