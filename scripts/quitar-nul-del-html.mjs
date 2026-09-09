/**
 * **Quita los bytes NUL que el render de React mete en el HTML construido.**
 *
 * ## Que existe, medido dos veces el 9-sep-2026
 *
 * `astro build` produce, de forma DETERMINISTA, HTML con algun `\0` suelto. Se sirvio en
 * produccion dos veces el mismo dia:
 *
 *     Nosotros hacemos el tr\0ámite     (titulo del paso 04)
 *     Bogotá<!-- --> \0· <!-- -->       (el ticker de ciudades)
 *
 * ## Lo que NO es
 *
 * - **No es la fuente.** Los ficheros `.tsx`/`.astro` no tienen un solo NUL: barrido con Node
 *   sobre los 1.698 ficheros de los tres repos.
 * - **No es una frase concreta.** La primera vez parecio serlo -«el trámite» repetido dos veces en
 *   la misma pagina- y cambiar el titulo lo quito. Pero al tocar la meta description volvio a
 *   aparecer **en otro sitio que nadie habia editado**: se MUEVE con el tamaño del contenido.
 * - **No es el compresor de Astro.** Con `compressHTML: false` sigue saliendo.
 *
 * ## Lo que si se sabe
 *
 * El NUL cae **siempre justo antes de un caracter multibyte** y pegado a un separador de texto de
 * React (`<!-- -->`):
 *
 *     hex:  2d 20 2d 2d 3e 20 | 00 | c2 b7      («- --> » NUL «·»)
 *     hex:  74 72             | 00 | c3 a1      («tr»     NUL «á»)
 *
 * Es la firma de un buffer de salida que calcula longitudes en caracteres y escribe en bytes. Es
 * un defecto de la cadena Astro/React, no del contenido, asi que **la unica defensa que no caduca
 * es limpiar la salida**: esquivar la frase de turno solo lo reubica.
 *
 * ## Por que limpia en vez de fallar
 *
 * Un NUL en un HTML **nunca** es contenido legitimo, asi que quitarlo no puede romper una pagina.
 * Y fallar el build dejaria la landing sin desplegar por un fallo de una dependencia, que es peor
 * que servirla bien. Se registra cada uno con su contexto para que no pase inadvertido.
 *
 * ⚠️ **Y `grep` no sirve para comprobar esto.** Un solo NUL vuelve el fichero binario y `grep`
 * deja de imprimir coincidencias sin decir por que: asi es como tres auditorias seguidas dieron
 * «limpio» sobre una pagina rota. Se cuenta con Node, que es lo unico que los ve.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const RAIZ = 'dist';

function html(dir, salida = []) {
  for (const nombre of readdirSync(dir)) {
    const p = join(dir, nombre);
    if (statSync(p).isDirectory()) html(p, salida);
    else if (nombre.endsWith('.html')) salida.push(p);
  }
  return salida;
}

let ficheros = 0;
let limpiados = 0;
let nulTotal = 0;

for (const p of html(RAIZ)) {
  ficheros++;
  const b = readFileSync(p);
  const cuantos = b.reduce((n, x) => (x === 0 ? n + 1 : n), 0);
  if (!cuantos) continue;

  limpiados++;
  nulTotal += cuantos;
  // El contexto de cada uno, para que quede en el log del build y no en el olvido.
  let i = -1;
  while ((i = b.indexOf(0, i + 1)) !== -1) {
    const ctx = b.slice(Math.max(0, i - 28), i + 12).toString('utf8').replace(/\s+/g, ' ');
    console.log(`  [nul] ${relative(RAIZ, p)} @${i}  …${ctx}…`);
  }
  writeFileSync(p, Buffer.from(b.filter((x) => x !== 0)));
}

console.log(
  nulTotal === 0
    ? `[quitar-nul] ${ficheros} paginas revisadas, ningun byte NUL.`
    : `[quitar-nul] ${nulTotal} byte(s) NUL retirados de ${limpiados} de ${ficheros} paginas.`,
);
