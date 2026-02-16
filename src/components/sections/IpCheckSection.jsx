import { FiClock, FiEye, FiGlobe, FiMapPin, FiWifi } from 'react-icons/fi';
import Reveal from '../common/Reveal';
import SectionTitle from '../common/SectionTitle';

const isKnownValue = (value) => typeof value === 'string' && value.trim() && value.trim().toLowerCase() !== 'unknown';

const formatLocation = (visitor) => {
  const values = [visitor?.city, visitor?.region, visitor?.country].filter(isKnownValue).map((value) => value.trim());
  return values.length > 0 ? values.join(', ') : 'Location unavailable';
};

const formatSingleValue = (value, fallbackText) => {
  return isKnownValue(value) ? value.trim() : fallbackText;
};

const IpCheckSection = ({ visitorInsights }) => {
  const { viewCount, viewSource, currentVisitor, isLoading, errorMessage } = visitorInsights;

  return (
    <section id="ip-check" className="mx-auto max-w-6xl py-16 sm:py-20 lg:py-24">
      <SectionTitle
        kicker="IP Check"
        title="Visitor activity and connection info."
        subtitle="Shows total views and your current connection details only."
      />

      <div className="grid gap-5 sm:gap-6">
        <Reveal className="space-y-4">
          <article className="glass-panel rounded-2xl border border-slate-200/20 p-5">
            <p className="cyber-title text-xs uppercase tracking-[0.24em] text-rose-500 dark:text-rose-300">
              Views
            </p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              <FiEye className="text-rose-500 dark:text-rose-300" />
              {typeof viewCount === 'number' ? viewCount.toLocaleString() : '--'}
            </p>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300/80">
              {isLoading
                ? 'Loading visitor data...'
                : viewSource === 'global'
                  ? 'Total page views (global counter).'
                  : 'Local counter (this browser only).'}
            </p>
          </article>

          <article className="glass-panel rounded-2xl border border-slate-200/20 p-5">
            <p className="cyber-title text-xs uppercase tracking-[0.24em] text-rose-500 dark:text-rose-300">
              Current Visitor
            </p>
            {currentVisitor ? (
              <div className="mt-3 space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
                <p className="flex items-center gap-2">
                  <FiGlobe className="text-rose-500 dark:text-rose-300" />
                  IP: {currentVisitor.ip}
                </p>
                <p className="flex items-center gap-2">
                  <FiMapPin className="text-orange-500 dark:text-orange-300" />
                  {formatLocation(currentVisitor)}
                </p>
                <p className="flex items-center gap-2">
                  <FiWifi className="text-emerald-500 dark:text-emerald-300" />
                  {formatSingleValue(currentVisitor.provider, 'Provider unavailable')}
                </p>
                <p className="flex items-center gap-2">
                  <FiClock className="text-cyan-500 dark:text-cyan-300" />
                  {formatSingleValue(currentVisitor.timezone, 'Timezone unavailable')}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300/85">
                Visitor IP data is not available yet.
              </p>
            )}
          </article>
        </Reveal>

        {errorMessage ? <p className="text-sm text-orange-600 dark:text-orange-300">{errorMessage}</p> : null}
      </div>
    </section>
  );
};

export default IpCheckSection;
