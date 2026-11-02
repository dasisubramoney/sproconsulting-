/**
 * GSAP with the plugins every page uses, registered once.
 *
 * Import this (and the hooks built on it) only from lazily loaded modules, never
 * from eagerly loaded code, so GSAP stays out of the main bundle. Page-specific
 * plugins (DrawSVG, MorphSVG, Flip) are registered in the page modules that use them.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/**
 * True if the element starts below the viewport. Scroll reveals only animate these,
 * so content that is already on screen never blinks out.
 */
export function belowFold(el: Element): boolean {
  return el.getBoundingClientRect().top > window.innerHeight;
}
