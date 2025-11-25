type SectionHeroProps = {
  title: string;
  subtitle: string;
};

export default function SectionHero({ title, subtitle }: SectionHeroProps) {
  return (
    <div className="relative isolate h-[20vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/60" />
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')",
          }}
        />
      </div>

      {/* Content */}
      <div className="mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="text-left">
          <h1 className="font-db-screenhead text-6xl font-bold text-white sm:text-7xl lg:text-8xl">
            <span className="relative inline-block">
              {title}
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#e2001a]" />
            </span>
          </h1>
          <p className="font-db-screensans mt-6 text-xl text-white/90 sm:text-2xl">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

