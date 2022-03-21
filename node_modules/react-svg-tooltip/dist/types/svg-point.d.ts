/**
 * Returns the *x* and *y* coordinates of the mouse relative to the svg root container element.
 * The coordinates are returned as an array of two-elements \[*x*, *y*].
 * Inspired by https://raw.githubusercontent.com/d3/d3-selection/master/src/point.js
 * @param svg the root svg container element
 * @param event the mouse event
 */
declare const svgPoint: (svg: SVGSVGElement, event: MouseEvent) => number[];
export default svgPoint;
