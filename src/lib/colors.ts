export const getColorName = (hex: string) => {
  const colors: { [key: string]: string } = {
    '#ffffff': 'Blanco', '#000000': 'Negro', '#ff0000': 'Rojo', '#00ff00': 'Verde',
    '#0000ff': 'Azul', '#ffff00': 'Amarillo', '#ff00ff': 'Fucsia', '#00ffff': 'Cian',
    '#808080': 'Gris', '#c0c0c0': 'Plata', '#800000': 'Granate', '#808000': 'Oliva',
    '#008000': 'Verde oscuro', '#800080': 'Púrpura', '#008080': 'Teal', '#000080': 'Azul marino',
    '#ffa500': 'Naranja', '#a52a2a': 'Marrón', '#ffc0cb': 'Rosa', '#e3d5ca': 'Beige/Nude',
    '#2d2d2d': 'Gris oscuro'
  };
  const h = hex.toLowerCase();
  return colors[h] || 'Personalizado';
};
