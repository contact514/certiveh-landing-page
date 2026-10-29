import { createContext, useContext, useEffect, useState } from 'react';
import { tarifaPorId, tarifaVigente, type Tarifa } from '@/lib/tipos-de-activo.ts';

/**
 * **La tarifa de una isla React** (ajuste de precios, lote 4; ESPEC §5.1).
 *
 * El HTML pre-renderizado lleva la tarifa del BUILD (la que pasa el frontmatter de Astro por su id). Al hidratar,
 * la isla pinta con esa misma (sin desajuste de hidratación) y DESPUÉS cambia a la vigente con el reloj del
 * cliente: tras T la home muestra la tarifa nueva aunque el build sea de antes.
 */
export function useTarifaDeLaIsla(idDelBuild?: string): Tarifa {
  const [tarifa, setTarifa] = useState<Tarifa>(() => (idDelBuild ? tarifaPorId(idDelBuild) : null) ?? tarifaVigente(new Date()));
  useEffect(() => { setTarifa(tarifaVigente(new Date())); }, []);
  return tarifa;
}

/** La tarifa que leen los componentes de dentro de la isla. */
export const TarifaDeLaIsla = createContext<Tarifa | null>(null);
export function useTarifa(): Tarifa {
  return useContext(TarifaDeLaIsla) ?? tarifaVigente(new Date());
}
