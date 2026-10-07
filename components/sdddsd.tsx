      {/* Background layers — pure CSS, server-rendered */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {STARS.map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full ${s.amber ? "bg-amber-300" : "bg-white"}`}
            style={{
              top: s.top,
              left: s.left,
              width: s.w,
              height: s.w,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 w-[50vw] h-[50vh] rounded-full bg-[radial-gradient(ellipse,rgba(8,60,100,0.05),transparent_65%)]" />
      <div className="pointer-events-none absolute -top-10 right-0 w-[35vw] h-[40vh] rounded-full bg-[radial-gradient(ellipse,rgba(217,119,6,0.05),transparent_65%)]" />

      {/* Aurora signature: slow-rotating conic gradient behind the grid.
          Deliberately absent from directly behind the thesis card —
          that card is the "dawn," this glow is the "aurora" around it. */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -right-40 h-160 w-160 rounded-full opacity-20 blur-3xl animate-[spin_34s_linear_infinite] bg-[conic-gradient(from_0deg,var(--color-cyan-500),var(--color-emerald-500),var(--color-violet-500),var(--color-cyan-500))]"
      /> */}

<div className="relative z-10 lg:max-w-6xl sm:max-w-3xl mx-auto px-5 lg:px-0 pt-24  pb-12 lg:py-40 lg:pb-20">
        {/* auto-rows (not a forced 1fr) — each row sizes to its own
            content, so Blog isn't inflated to match the thesis card's
            full height. Default align-items (stretch) is left alone,
            so Courses and Journey — which DO share a row — still
            match each other's height, same as any normal grid row. */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Thesis — solid contrasting card: who we are + what we offer.
              Single flex column with one consistent gap between blocks —
              no justify-between, so nothing gets stretched apart. */}
          <div className="lg:col-span-2 lg:row-span-2 lg:self-center p-7 lg:p-10 lg:py-5 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="inline-block text-[11px] tracking-[0.14em] uppercase text-orange-400 font-semibold">
                {THESIS_CONTENT.eyebrow}
              </span>
              <h1 className="font-roboto text-[2rem] sm:text-[2.1rem] lg:text-[2.3rem] font-bold leading-tight text-cyan-100">
                {THESIS_CONTENT.title}{" "}
                <span className="font-display italic text-amber-500">
                  {THESIS_CONTENT.titleAccent}
                </span>
              </h1>
              <p className="text-stone-300 font-roboto font-medium leading-relaxed text-[1rem] lg:text-[1rem] max-w-md">
                {THESIS_CONTENT.description}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <a
                href={THESIS_CONTENT.primaryCta.href}
                target="_blank"
                className="inline-flex justify-center lg:w-fit w-full items-center gap-2 font-semibold font-roboto px-6 py-3 text-cyan-50 bg-amber-600 text-sm rounded-xl transition-all duration-300 hover:bg-cyan-900 hover:scale-[1.03]"
              >
                {THESIS_CONTENT.primaryCta.label}
              </a>

              <Socials />
            </div>
          </div>

          {/* Courses — real top packages, auto-sliding, each slide
              links to its own real checkout page */}
          <PackagesTeaserCard className="lg:col-span-1" />

          {/* Journey */}
          <BentoCard
            variant="solid"
            href={JOURNEY_CONTENT.cta.href}
            className="p-4 flex flex-col gap-4 "
          >
            <div>
              <div className="w-full  bg-cyan-900 px-2">
                <span className="text-[10px] tracking-[0.14em] uppercase text-amber-700 font-bold ">
                  Previous Year Papers
                </span>
              </div>
              <PaperListCard />
            </div>
          </BentoCard>

          {/* Blog — a real, already-built page. Content-sized now, not
              stretched to match the thesis card's row-span-2 height. */}
          <BentoCard
            href={BLOG_CONTENT.cta.href}
            variant="solid"
            className="lg:col-span-2 p-5 flex flex-col gap-1 "
          >
            <div>
              <span className="text-[12px] tracking-[0.14em] uppercase text-amber-800 font-bold">
                {BLOG_CONTENT.eyebrow}{" "}
                <span className="text-cyan-900"> - BLOG</span>
              </span>
            </div>

            <LatestBlogCard />
          </BentoCard>
        </div>
      </div>