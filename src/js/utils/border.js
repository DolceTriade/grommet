import { css } from 'styled-components';
import { normalizeColor } from './colors';
import { breakpointStyle } from './mixins';

export const responsiveBorderStyle = (data, theme) => {
  const color = normalizeColor(data.color || 'border', theme);
  const borderSize = data.size || 'xsmall';
  const style = data.style || 'solid';
  const side = typeof data === 'string' ? data : data.side || 'all';
  const breakpoint =
    theme.box.responsiveBreakpoint &&
    theme.global.breakpoints[theme.box.responsiveBreakpoint];
  if (!breakpoint.borderSize) breakpoint.borderSize = theme.global.borderSize;
  const value =
    breakpoint &&
    (breakpoint.borderSize[borderSize] || borderSize) &&
    `${style} ${breakpoint.borderSize[borderSize] || borderSize} ${color}`;
  if (!value) return undefined;
  if (
    side === 'top' ||
    side === 'bottom' ||
    side === 'left' ||
    side === 'right'
  )
    return `border-${side}: ${value};`;
  if (side === 'end' || side === 'start')
    return `border-inline-${side}: ${value};`;
  if (side === 'vertical')
    return `
      border-left: ${value};
      border-right: ${value};
    `;
  if (side === 'horizontal')
    return `
      border-top: ${value};
      border-bottom: ${value};
    `;
  if (side === 'between') return undefined; // no-op
  return `border: ${value};`;
};

export const borderStyle = (data, responsive, theme) => {
  const styles = [];
  if (Array.isArray(data)) {
    data.forEach((d) => {
      if (d) {
        styles.push(borderStyle(d, responsive, theme));
      }
    });
    return styles;
  }
  const color = normalizeColor(data.color || 'border', theme);
  const borderSize = data.size || 'xsmall';
  const style = data.style || 'solid';
  const side = typeof data === 'string' ? data : data.side || 'all';
  const value = `${style} ${
    theme.global.borderSize[borderSize] || borderSize
  } ${color}`;
  const responsiveStyle = responsive && responsiveBorderStyle(data, theme);
  const breakpoint =
    responsiveStyle &&
    theme.box.responsiveBreakpoint &&
    theme.global.breakpoints[theme.box.responsiveBreakpoint];
  if (
    side === 'top' ||
    side === 'bottom' ||
    side === 'left' ||
    side === 'right'
  ) {
    styles.push(`border-${side}: ${value};`);
    if (responsiveStyle) {
      styles.push(breakpointStyle(breakpoint, responsiveStyle));
    }
  } else if (side === 'end' || side === 'start') {
    styles.push(css`border-inline-${side}: ${value};`);
    if (responsiveStyle) {
      styles.push(breakpointStyle(breakpoint, responsiveStyle));
    }
  } else if (side === 'vertical') {
    styles.push(css`
      border-left: ${value};
      border-right: ${value};
    `);
    if (responsiveStyle) {
      styles.push(breakpointStyle(breakpoint, responsiveStyle));
    }
  } else if (side === 'horizontal') {
    styles.push(css`
      border-top: ${value};
      border-bottom: ${value};
    `);
    if (responsiveStyle) {
      styles.push(breakpointStyle(breakpoint, responsiveStyle));
    }
  } else if (side === 'between') {
    // no-op
  } else {
    styles.push(
      css`
        border: ${value};
      `,
    );
    if (responsiveStyle) {
      styles.push(breakpointStyle(breakpoint, responsiveStyle));
    }
  }
  return styles;
};
