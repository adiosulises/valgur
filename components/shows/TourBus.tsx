// Endless "on tour" scene for the empty shows page: a bus bouncing along while the road and the sky slide by.
// Pure CSS (see tour-* in globals.css); stands still for people who prefer reduced motion.

const MONO = { fontFamily: 'ui-monospace, Menlo, Consolas, "Courier New", monospace' };

// Each strip is two identical halves; sliding by exactly one half loops seamlessly.
const strip = (unit: string, units: number) => unit.repeat(units);
const ROAD = strip("-   -   - ", 40);
const SKY = strip("  ♪        ˚     *        ♫     .      ", 12);

const BUS = String.raw` ____________________
| [__] [__] [__] [__] \
|____________________|_\
 '-(oo)-----------(oo)-'`;

function Strip({ text, seconds, className = "" }: { text: string; seconds: number; className?: string }) {
  return (
    <div className={`overflow-hidden whitespace-pre leading-none ${className}`}>
      <div className="tour-scroll w-max" style={{ animationDuration: `${seconds}s` }}>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

export function TourBus() {
  return (
    <div aria-hidden className="w-full max-w-xl select-none text-[11px] sm:text-sm" style={MONO}>
      <Strip text={SKY} seconds={60} className="opacity-50 mb-3" />
      <pre className="tour-bob w-fit mx-auto leading-tight" style={MONO}>{BUS}</pre>
      <Strip text={ROAD} seconds={9} className="mt-1" />
    </div>
  );
}
