export interface IVidaCategoria {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  posX: number;
  posY: number;
  radio: number;
  tipoContenido: "items" | "portal";
  urlDestino: string | null;
  endpointPreview: string | null;
  publicada: boolean;
  itemsCount?: number;
}

export interface IVidaTag {
  id: number;
  slug: string;
  nombre: string;
}

export interface IVidaEnlace {
  id?: number;
  tipo: string;
  url: string;
  etiqueta: string | null;
}

export interface IVidaMedia {
  id?: number;
  tipo: string;
  src: string;
  alt: string | null;
  principal: boolean;
}

export interface IVidaItemListado {
  id: number;
  slug: string;
  titulo: string;
  categoria: IVidaCategoria;
  ambito: string | null;
  destacado: boolean;
  publicado: boolean;
  tags: string[];
}

export interface IVidaItemDetalle {
  id: number;
  slug: string;
  categoriaId: number;
  categoria: IVidaCategoria;
  ambito: string | null;
  titulo: string;
  subtitulo: string | null;
  resumen: string;
  descripcion: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  precisionFecha: "anio" | "mes" | "dia";
  enCurso: boolean;
  destacado: boolean;
  peso: number;
  ciudad: string | null;
  pais: string | null;
  lat: number | null;
  lng: number | null;
  meta: Record<string, unknown>;
  publicado: boolean;
  tags: IVidaTag[];
  enlaces: IVidaEnlace[];
  media: IVidaMedia[];
  relacionados: number[];
}

export interface IVidaLibro {
  id: number;
  titulo: string;
  autor: string;
  anioLectura: number;
  genero: string | null;
  nota: string | null;
  color: string | null;
  paginas: number | null;
  destacado: boolean;
  orden: number;
}
