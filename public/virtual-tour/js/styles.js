// The three directions shown as option clips. Pick with ?style=ink|blueprint|survey
// reveal: how the drawing turns into the real land  ·  pano: how the 360° photo takes over
export const STYLES = {
  ink: {
    label: 'Architect\'s sheet',
    paper: [0.953, 0.937, 0.902], ink: [0.114, 0.114, 0.122], planned: '#b5523b',
    contour: 0.16, contourIndex: 0.34, hillshade: 0.0,
    reveal: 'wipe', stepped: false, pano: 'fade',
    edge: [0.114, 0.114, 0.122], planGlow: '#f6e7c8',
  },
  // Portal.Place blueprint: brand indigo sheet, cream linework, amber for what's planned.
  // The real land fills in contour by contour (an amber tide line), then a straight dolly crossfades into the photo.
  blueprint: {
    label: 'Portal blueprint',
    paper: [0.169, 0.169, 0.384], ink: [0.949, 0.929, 0.91], planned: '#EA824E',
    contour: 0.17, contourIndex: 0.36, hillshade: 0.0,
    reveal: 'contour', stepped: false, pano: 'dolly',
    edge: [0.918, 0.51, 0.306], planGlow: '#EA824E', plan3d: true,
   
  },
  // ---- brand palettes for the contour-fill + dolly direction (Mike: "the purple is a bit overpowering") ----
  cream: {
    label: 'Cream & ink', paper: [0.98, 0.973, 0.957], ink: [0.102, 0.09, 0.125], planned: '#AF695E',
    contour: 0.2, contourIndex: 0.42, contourCol: '#AF695E', hillshade: 0, reveal: 'contour', stepped: false, pano: 'dolly',
    edge: [0.918, 0.51, 0.306], tideGlow: '#EA824E', planGlow: '#EA824E', plan3d: true,
    sky: ['#E3DAD5', '#FAF8F4'], pill: { bg: 'rgba(26,23,32,0.88)', text: '#FAF8F4' }
  },
  indigoline: {
    label: 'Off-white & indigo', paper: [0.949, 0.929, 0.91], ink: [0.22, 0.22, 0.498], planned: '#AF695E',
    contour: 0.22, contourIndex: 0.45, contourCol: '#38387F', hillshade: 0, reveal: 'contour', stepped: false, pano: 'dolly',
    edge: [0.918, 0.51, 0.306], tideGlow: '#AF695E', planGlow: '#EA824E', plan3d: true,
    sky: ['#C9C9DE', '#F2EDE8'], pill: { bg: 'rgba(56,56,127,0.9)', text: '#FAF8F4' }
  },
  // Warm night (Mike's pick): brand warm-dark sheet, cream linework, amber for what's planned. With purple no longer
  // the background, indigo + mauve carry map meaning: water is indigo, trails and the fine contours are mauve,
  // index contours terracotta, and the plan's label pills are indigo.
  night: {
    label: 'Warm night', paper: [0.102, 0.09, 0.125], ink: [0.949, 0.929, 0.91], planned: '#EA824E',
    contour: 0.22, contourIndex: 0.42, contourCol: '#73516F', contourIdxCol: '#AF695E', hillshade: 0,
    reveal: 'contour', stepped: false, pano: 'dolly',
    edge: [0.918, 0.51, 0.306], tideGlow: '#73516F', planGlow: '#EA824E', plan3d: true,
    water: '#38387F', trail: '#73516F',
    sky: ['#1A1720', '#73516F'], pill: { bg: 'rgba(56,56,127,0.92)', text: '#FAF8F4' },
  },
  survey: {
    label: 'Survey model',
    paper: [0.937, 0.894, 0.8], ink: [0.231, 0.184, 0.133], planned: '#c4622d',
    contour: 0.22, contourIndex: 0.45, hillshade: 0.35,
    reveal: 'height', stepped: true, pano: 'iris',
    edge: [0.231, 0.184, 0.133], planGlow: '#ffcf8a',
  },
};

export function pickStyle() {
  const q = new URLSearchParams(location.search).get('style');
  const key = STYLES[q] ? q : 'night';
  document.documentElement.dataset.style = key;
  return { key, ...STYLES[key] };
}
