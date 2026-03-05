import theme from '../theme.json';

export const colors = theme.colors;
export const neutrals = theme.neutrals;
export const semantic = theme.semantic;
export const fonts = theme.fonts;
export const fontWeights = theme.fontWeights;
export const typeScale = theme.typeScale;
export const spacing = theme.spacing;
export const containers = theme.containers;
export const borderRadius = theme.borderRadius;
export const glass = theme.glass;
export const animation = theme.animation;

export const cssVars = {
  '--bright-teal-blue': theme.colors.brightTealBlue,
  '--sky-reflection': theme.colors.skyReflection,
  '--bright-amber': theme.colors.brightAmber,
  '--coral-glow': theme.colors.coralGlow,
  '--jet-black': theme.colors.jetBlack,
  '--font-serif': `'${theme.fonts.serif}', Georgia, serif`,
  '--font-sans-header': `'${theme.fonts.sansHeader}', sans-serif`,
  '--font-sans-body': `'${theme.fonts.sansBody}', sans-serif`,
} as const;

export default theme;
