/**
 * Projects page hero drawing: a skyline elevation of the kinds of building in the intro
 * ("airports, hospitals, malls, stations, campuses and industrial facilities"), standing on
 * one ground line that overshoots both ends, with a dimension line under them. Left to right:
 *
 *   1. Station: a vaulted platform canopy on columns, a clock hanging from the vault.
 *   2. Hospital: a ward block with a lower wing, ambulance canopy, and a cross on the roof.
 *   3. Campus: a portico on steps, columns, entablature and pediment with an oculus.
 *   4. Airport: control tower (glazed cab, antenna) beside a terminal with a curved roof.
 *   5. Mall: an anchor block, a barrel-vaulted atrium, shopfront glazing and entrance canopy.
 *   6. Industrial: a sawtooth-roof factory with a roller door, and a chimney stack.
 *
 * Colour: the buildings in steel, floors and glazing as fainter hairlines; one copper
 * detail per type where it identifies the building (clock, cross, oculus, tower cab, stack
 * band, mall entrance canopy). No text on the drawing (DESIGN.md "Motif").
 *
 * Motion: above the fold, so it draws on with CSS on load (index.css `.draw`, `.draw-fill`,
 * `.draw-pop`): the ground line, then each building's outline left to right with its
 * hairlines fading in behind it, then the copper details pop in, left to right.
 * Every animation ends on the finished drawing, so no-JS and reduced motion show it complete.
 * Decorative: the page copy carries the content.
 */

// Elevation coordinates (viewBox 0 24 572 200): ground at y 200.
const ground = 'M4 200 H568';
const crosshair = 'M14 40 H34 M24 30 V50';
const dimension = 'M12 214 H558 M12 209 V219 M558 209 V219';

const range = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

// 1. Station, x 12–92: vault centred on x 52, springing at y 160, crown at y 130.
const station = 'M12 200 V160 M92 200 V160 M8 160 H96 M12 160 A40 30 0 0 1 92 160 M12 188 H92 M32 188 V160 M72 188 V160';
const stationRibs = 'M32 160 V134 M52 160 V130 M72 160 V134';
const CLOCK = { cx: 52, cy: 146, r: 6 };
const clockHands = 'M52 146 V142 M52 146 L55 148';

// 2. Hospital, block x 104–148 (roof y 72), wing x 148–178 (roof y 148).
const hospital = 'M104 200 V72 H148 V200 M148 148 H178 V200 M118 72 V56 H134 V72 M178 184 H192 M190 184 V200';
const hospitalFloors = [
  ...range(88, 184, 16).map((y) => `M104 ${y} H148`),
  ...[164, 180].map((y) => `M148 ${y} H178`),
  ...[115, 126, 137].map((x) => `M${x} 72 V200`),
].join(' ');
const cross = 'M126 59 V69 M121 64 H131';

// 3. Campus, x 194–266: steps, five columns, entablature, pediment (apex 230, 126).
const campus = [
  'M194 200 V196 H266 V200 M198 196 V192 H262 V196',
  ...[206, 218, 230, 242, 254].map((x) => `M${x - 2} 192 V152 M${x + 2} 192 V152`),
  'M200 152 H260 V146 H200 Z M196 146 L230 126 L264 146 Z',
].join(' ');
const OCULUS = { cx: 230, cy: 139, r: 3 };

// 4. Airport: tower on x 286 (shaft 282–290), terminal x 304–388 under a curved roof.
const tower = 'M282 200 V76 M290 200 V76 M278 76 H294 M270 58 H302 M278 58 V52 H294 V58 M286 52 V38';
const cab = 'M276 76 L272 58 H300 L296 76 Z M281 76 L279 58 M286 76 V58 M291 76 L293 58';
const terminal = 'M304 200 V170 M388 200 V170 M298 172 Q346 148 394 172 Q346 156 298 172 Z';
const terminalGlazing = ['M304 186 H388', ...range(316, 376, 12).map((x) => `M${x} 200 V178`)].join(' ');

// 5. Mall: anchor block x 400–424 (roof y 150), main x 424–470 (roof y 164) with an atrium
//    vault centred on x 447 (crown y 153) and an entrance canopy (copper) at y 182.
const mall = 'M400 200 V150 H424 V200 M424 164 H470 V200 M432 164 A15 11 0 0 1 462 164';
const mallCanopy = 'M434 182 H460';
const mallGlazing = 'M439.5 164 V154.5 M447 164 V153 M454.5 164 V154.5 M400 160 H424 M400 168 H424 M424 186 H470 M436 200 V186 M447 200 V186 M458 200 V186';

// 6. Industrial: sawtooth factory x 480–544, stack x 550–558.
const factory = 'M480 200 V160 L496 146 V160 L512 146 V160 L528 146 V160 L544 146 V200 M550 200 V92 M558 200 V92 M548 92 H560';
const factoryDetail = 'M480 172 H544 M488 200 V180 H506 V200 M488 186 H506 M488 192 H506';
const stackBand = 'M550 99 H558 V105 H550 Z';

export function ProjectSkyline({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 24 572 200" className={`h-auto fill-none ${className}`} strokeLinecap="round" strokeLinejoin="round">
      {/* Construction: ground line, crosshair, dimension line. */}
      <g className="stroke-steel-500" strokeWidth="1">
        <path pathLength={1} className="draw opacity-60 [--d:0s]" d={ground} />
        <path pathLength={1} className="draw opacity-60 [--d:0.2s] [--dur:0.5s]" d={crosshair} />
        <path pathLength={1} className="draw opacity-60 [--d:0.3s]" d={dimension} />
      </g>

      {/* Building outlines, left to right. */}
      <g className="stroke-steel-500" strokeWidth="1.25">
        <path pathLength={1} className="draw [--d:0.4s] [--dur:0.8s]" d={station} />
        <path pathLength={1} className="draw [--d:0.65s] [--dur:0.8s]" d={hospital} />
        <path pathLength={1} className="draw [--d:0.9s] [--dur:0.8s]" d={campus} />
        <path pathLength={1} className="draw [--d:1.15s] [--dur:0.8s]" d={tower + ' ' + terminal} />
        <path pathLength={1} className="draw [--d:1.4s] [--dur:0.8s]" d={mall} />
        <path pathLength={1} className="draw [--d:1.65s] [--dur:0.8s]" d={factory} />
      </g>

      {/* Floors, glazing and ribs: fainter, each fading in behind its outline.
          Opacity on the wrapper: draw-fill animates opacity. */}
      <g className="stroke-steel-500 opacity-40" strokeWidth="0.75">
        <path className="draw-fill [--d:0.9s]" d={stationRibs} />
        <path className="draw-fill [--d:1.15s]" d={hospitalFloors} />
        <path className="draw-fill [--d:1.65s]" d={terminalGlazing} />
        <path className="draw-fill [--d:1.9s]" d={mallGlazing} />
        <path className="draw-fill [--d:2.15s]" d={factoryDetail} />
      </g>

      {/* Copper details, left to right. */}
      <g className="stroke-copper-500" strokeWidth="1.25">
        {/* The clock hangs on the centre rib; its white face covers the rib behind it. */}
        <g className="draw-pop [--d:2.3s]">
          <circle {...CLOCK} className="fill-white" />
          <path strokeWidth="1" d={clockHands} />
        </g>
        <path className="draw-pop [--d:2.4s]" strokeWidth="2.5" strokeLinecap="butt" d={cross} />
        <circle {...OCULUS} className="draw-pop [--d:2.5s]" />
        <path className="draw-pop fill-white [--d:2.6s]" d={cab} />
        <path className="draw-pop [--d:2.7s]" strokeWidth="1.5" d={mallCanopy} />
        <path className="draw-pop fill-copper-500 [--d:2.8s]" strokeWidth="0" d={stackBand} />
      </g>
    </svg>
  );
}
