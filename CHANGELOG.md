# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]
### Added
- Ronda 2: pistas de Emojinalo (bandera->país, bandera->capital, emoji->qué es, emoji->película/serie), 100 niveles por categoría
  - Países: los primeros 100 del ranking FIFA, en ese orden
  - Capitales: los mismos 100 países, pero en orden alfabético (no el de ranking), para que el país de la pista "país" no sea siempre el mismo que el de la pista "capital" ese día
  - Qué es / Película: primeros 100 niveles de Emojinalo tal cual, sin reordenar
  - La pista de Película/Serie usa el título "Película" o "Serie" según corresponda (el dato ya viene etiquetado en Emojinalo)
- Ronda 3: pistas de Famosos (93 niveles) y Personajes (106 niveles, Marvel + Los Simpson), con foto en vez de ilustración/emoji
  - Fotos identificadas a mano a partir de los nombres de archivo (curados originalmente para otro juego); 5 famosos no identificables se descartaron
- Ronda 4: pistas de preguntas y respuestas (871 niveles), copiadas de un archivo `preguntas.json` provisto por el usuario, sacando las que tenían respuesta numérica
  - A diferencia de las otras rondas, no muestra los guiones de la palabra a adivinar mientras no se encontró; solo la pregunta
- Pistas con emoji (banderas, "qué es", película/serie): fondo blanco igual que las imágenes, zoom al tocar (mismo modal), y cuando son más de 3 emojis se achican y pasan a 2 líneas en vez de amontonarse en una sola
### Fixed
- Ronda de preguntas: la respuesta va en su propia línea debajo de la pregunta (antes, al lado, rompía el diseño con preguntas largas)
- Ronda de preguntas: evitar que 2 preguntas con la misma respuesta caigan juntas en la misma ronda (se detectó con "Antartida" repetida; el fix es genérico, no depende de arreglar cada dato duplicado a mano)
### Removed
- Ronda de definiciones/emoji del rosco semanal ("legacy"): quedó reemplazada por la Ronda 4 de preguntas, ya no se usa en ninguna ronda
### Changed
- Home: agregar emoji de momento del día al saludo (☀️/🌤️/🌙), mismo tratamiento que ya tenía Enganchalo
- El contenedor de imagen (thumbnail y zoom) probó ser circular (border-radius 50%) y se volvió a "8px" (rounded square) tras ver cómo quedaba en la práctica

## [2026-07-27]
### Changed
- Ronda de imágenes: título de categoría reubicado al mismo contenedor que el número (arriba, centrado), en vez de encima de la imagen
- Ronda de imágenes: ancho fijo (40px) en la columna de número/título para que las 4 imágenes queden alineadas verticalmente
- Ronda de imágenes: alinear verticalmente al centro el número, la imagen y las palabras de cada pista
### Fixed
- Ronda de imágenes: columnGap (24px, entre palabras) separado del rowGap (4px, entre líneas al wrappear); antes un solo gap amontonaba o separaba de más ambos ejes
- Ronda de imágenes: letter-spacing -1 en guiones/palabra para que entren mejor en pantalla
- Ronda de imágenes: bajar 2pt el font size de los títulos de categoría (11px -> 9px)
### Added
- Ronda de imágenes: zoom al clickear la imagen de la pista (se abre grande en un modal, cierra con la X o clickeando afuera)

## [2026-07-26]
### Added
- AdSense: agregar script, meta tags OG/canonical y ads.txt
- SEO: agregar robots.txt y sitemap.xml (faltaban)
### Changed
- Ronda 1: pistas de imágenes de Imaginalo (Funkos/Escudos/Sombras/Logos)
- Rebranding: Sopalo -> Ensopalo (el dominio sopalo.com no estaba disponible)

## [2026-07-24]
### Added
- Home: normalizar spacing título/tagline, box cuadrado, y agregar "tiempo sin jugar"
### Changed
- Datos: corregir Arana->Araña, Montana->Montaña e Iman->Imán en set-emoji-002/003

## [2026-07-21]
### Added
- Agregar _redirects para el fallback de SPA en Netlify
### Changed
- Sopa: aumentar de 3 a 5 definiciones por nivel
- Datos: corregir 6 definiciones de X pegadas en palabras equivocadas
- Datos: corregir set-011 (Crick→Chaplin, Basilisco, y definiciones de X pegadas)

## [2026-07-20]
### Changed
- Datos: corregir Pina -> Piña en set-emoji-011 (falta la Ñ)
- Datos: corregir 4 definiciones de "tubo" pegadas en palabras equivocadas

## [2026-07-19]
### Changed
- Invertir el ciclo de sets semanales respecto a Enroscalo
- Datos: mantener Yugular (con Y) en vez de Jennifer en set-010

## [2026-07-14]
### Changed
- Datos: reemplazar Jugular por Jennifer en set-010 (mal escrita, es "yugular" con Y)

## [2026-07-13]
### Added
- Game: agregar una tercera pista por ronda (2 definiciones + 1 emoji)
### Changed
- Cambiar botón "Ver resultado" por "Completado" en días terminados
- Semanal: igualar la altura de todas las cards de día
- Semanal: reemplazar el x/7 grande por una mini sopa de letras
- DaySopaPreview: dejar 1 letra de separación entre palabras del estado
### Fixed
- Fix: la Ñ desaparecía de la grilla (se aplanaba a N)

## [2026-07-12]
### Added
- Home: agregar botón flotante de idioma (faltaba en Sopalo)
- UI: la palabra revelada del emoji también arranca en renglón nuevo
### Changed
- Home: reemplazar card de resultado por una mini sopa de letras
- Aumentar tiempo por ronda de 30s a 1 minuto
- Sopalo: primera versión — sopa de letras diaria con definición + emoji
### Fixed
- Fix: el botón de revelar muestra las palabras pero no completa la ronda
### Removed
- Sacar el timer y el botón Comenzar; agregar botón de revelar palabras
