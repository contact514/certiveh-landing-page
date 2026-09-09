# Cómo se verifica el trabajo en CertiVeh

<!-- FICHERO COMPARTIDO. Vive byte a byte idéntico en los repos de CertiVeh.
     Si lo cambias aquí, cópialo a los demás. Comprobación de deriva al final del fichero. -->

Este fichero no describe este repo: describe **cómo se comprueba que algo funciona** en todos.
Está escrito a partir de defectos que llegaron a producción, no de buenas intenciones. Cada regla
lleva lo que costó aprenderla, porque la regla sin el coste se ignora.

## La regla que resume el resto

**Un test puede pasar sin ejecutar nada de lo que dice comprobar.** Es el patrón que más veces ha
mordido en este proyecto. Cuando una auditoría sale «limpia», lo primero que hay que sospechar no
es el código: es el arnés.

De ahí sale la única comprobación que ha funcionado siempre: **rompe el código a propósito y mira
si la suite se pone roja.** Si sigue verde, el test no vale, por bien escrito que esté.

## Antes de escribir código

- **Lee el código antes de razonar sobre él.** De siete arreglos de una sesión, los seis
  construidos leyendo el código quedaron limpios en una o dos rondas; el séptimo, construido
  razonando sobre cómo *creía* que se comportaba una función que no abrí, necesitó cinco rondas y
  tuvo dos defectos reales de comportamiento. Si una frase afirma algo sobre código que no está en
  el diff («esto ya lo limpia X», «esto se consume en Y»), es una hipótesis hasta que se lee X e Y.

- **Las reglas de negocio se preguntan, no se deducen.** El código describe lo que hoy hace, no lo
  que el negocio quiere. En este dominio (UPME, IVA, aliados, cobros) una regla mal supuesta acaba
  en dinero cobrado o en un expediente radicado mal. Se prefiere la interrupción al supuesto.
  Lo técnico —nombres, estructura, si extraer un módulo, qué probar— no se pregunta: se decide.

  **Una regla inventada se disfraza de cautela.** Las que se cuelan no son las temerarias, son las
  que «protegen al cliente». Si la frase empieza por «mejor no le digamos…», es de negocio y no es
  tuya. Y se cuelan más auditando que implementando.

## Al probar

- **Si hay efecto observable, la prueba mira el efecto**, no el texto del fuente. Tres funciones
  puras con sus tests y un `toMatch` sobre el código dejaron **cinco mutaciones vivas con 874 tests
  en verde** y la feature muerta.

- **Un test que lee el fuente miente de ocho maneras.** Lo borrado se caza; lo **añadido** y lo
  **neutralizado**, no. Las ocho, con lo que cierra cada una:

  | # | dimensión | mutación que sobrevive | cierre |
  |---|---|---|---|
  | 1 | existencia | borrar la línea | literales |
  | 2 | forma exacta | `\|\| true` al final, sin terminador | literales **con `;`** |
  | 3 | cardinalidad | insertar `x = null;` antes del `if` | contar asignaciones |
  | 4 | cobertura | atar 2 de las 3 variables del tramo | contarlas **todas** |
  | 5 | posición | mover el bloque detrás de otra llamada | acotar y comparar índices |
  | 6 | relación | intercambiar los cuerpos de `if`/`else` | acotar la rama y buscar dentro |
  | 7 | alcanzabilidad | `.catch(()=>[])`, quitar un `await`, un `if (env)` dentro | **transcribir el bloque entero** |
  | 8 | acoplamiento | cambiar la función de la que depende, o abrir una puerta nueva | transcribir esa función; contar llamadores |

  Para una guarda que protege dinero o algo irreversible: **transcribir el cuerpo entero
  normalizado** (`replace(/\s+/g,' ')`) y compararlo con `toBe`. Cuesta actualizarlo en cada cambio
  legítimo, y ese es el precio correcto.

- **Si no lo puedes ejecutar, sácalo a `_shared/`.** La lógica dentro de una edge function no la
  puede importar `vitest`, y entonces solo queda barrer su texto. Un módulo aparte se ejecuta de
  verdad. Y un contrato entre dos módulos hay que pincharlo por **los dos** extremos.

- **Probar una guarda de admin con una cuenta de admin no prueba nada.** Las guardas que impiden
  que un *cliente* escriba lo que no le toca viven detrás de un `NOT is_admin(auth.uid())`: con una
  cuenta de admin ese bloque entero se salta y la prueba sale verde con el fallo vivo.

- **Un barrido deriva su conjunto del árbol, nunca lo escribe a mano**, y lleva control del
  instrumento: que encuentre más de N ficheros, que llegue a cada carpeta, que el sitio de
  declaración quede excluido y no simplemente ausente.

- **Auditar los arreglos propios es la ronda que más defectos encuentra.** De doce arreglos
  aplicados y comiteados, uno estaba escrito entero —función, docblock, tests— y **sin cablear**:
  cero llamantes. Por cada arreglo de la lista, un `grep -n "<identificador>("` que devuelva **dos
  o más** líneas: la declaración y al menos un uso. Si devuelve una, está muerto.

## Herramientas que mienten

Ninguna de estas se descubre leyendo código. Se descubren midiendo mal y creyéndoselo.

- **`npx tsc --noEmit` no compila nada** en los repos con `"files": []` en el `tsconfig.json` raíz:
  sin `-b` no sigue las `references`, compila cero ficheros y sale con código 0. Es una
  comprobación que siempre pasa. El comando bueno es `npm run typecheck`, y donde no exista,
  `npx tsc -p tsconfig.app.json --noEmit`.

- **`grep` se come el código de salida.** `vitest run | grep ... && git commit` commitea con la
  suite en rojo: el `&&` ve el código de `grep`, no el de `vitest`. Comprobado: un comando que sale
  con 1 e imprime la palabra buscada deja el pipeline en **0**. Separa las órdenes, o `set -o
  pipefail`.

- **Un byte NUL invisible pasa `tsc`, `vite` y toda la suite**, y de paso **vuelve el fichero
  invisible para `grep`**, que al ver un NUL lo trata como binario y deja de imprimir
  coincidencias sin decir por qué. Así es como tres auditorías seguidas dieron «limpio» sobre una
  página rota. Se cuentan con Node, que es lo único que los ve:
  `node -e "const b=require('fs').readFileSync(P); console.log(b.filter(x=>x===0).length)"`

- **`\b` no ve las vocales acentuadas como letra.** En JavaScript, si el patrón **empieza o termina**
  en vocal acentuada, el `\b` de ese extremo no casa nunca: `/\bárbol\b/` sobre «un árbol» da
  `false`. Con la tilde por dentro sí casa (`/\bnación\b/` da `true`), y por eso el fallo parece
  intermitente y se atribuye al texto en vez de al patrón.

- **`perl -0pi` con `\Q…\E` interpola el `${...}`.** Al mutar un *template literal*, perl expande la
  variable antes de aplicar el patrón: no casa con nada y **el comando sale con éxito y en
  silencio**. Muta con Node y **comprueba que el fichero cambió** antes de creerte el verde:
  `cmp -s fichero copia && echo "la mutacion NO se aplico"`.

- **En zsh, `npx vitest run $FICHEROS` con varias rutas no encuentra ningún test**, y todo mutante
  se lee como muerto. Usa un array o pasa las rutas una a una.

- **`deno check` cachea los diagnósticos**: la segunda llamada da 0 aunque los errores sigan ahí.
  `touch` al fichero antes de repetir.

- **`git stash -u` sobre un árbol limpio no guarda nada**, y el `pop` de después saca el stash de
  OTRO trabajo.

- **`git add -A` con un proceso en segundo plano escribiendo en el árbol se lleva su mutación
  dentro del commit.** Pasó: una mutación de auditoría llegó a la rama que despliega y estuvo viva
  1 minuto 59 segundos prometiéndole a un cliente un tercio de lo que le tocaba. Mientras haya algo
  corriendo, los ficheros se añaden **por nombre**. Y si la suite sale roja, no se commitea hasta
  saber por qué: aquella corrida dio 21 tests en rojo y se leyeron como ruido de concurrencia.

- **`vercel ls` escribe la tabla por stderr**: con `2>/dev/null` un sondeo no ve nada y gira en vacío.

## Al integrar

- **Con merges en squash, contar commits pinta ramas pendientes que no lo están.** `rev-list
  staging..rama` marcó 140 ramas sin mezclar y no lo estaba ninguna. Hay que comparar el contenido.

- **Una migración válida al abrir la rama colisiona si la base avanzó.** Supabase la da por aplicada
  y **no la ejecuta**. Y `git diff staging rama` no lo delata.

- **No midas una espera por su primer intento.** Un despliegue que a los 10 minutos «no ha
  publicado» puede publicar dentro de la hora. Una nota de este repo llegó a afirmar lo contrario
  por no volver a mirar.

- **No te fíes de un auditor sin contrastarlo.** Un hallazgo falso aceptado no es neutro:
  **introduce** la falsedad en el trabajo. Si un agente contradice tus propios datos, gana el dato.

---

<!-- Comprobación de deriva entre repos:
     shasum -a 256 /Users/julian/certiveh*/.claude/rules/metodo-de-verificacion.md -->
