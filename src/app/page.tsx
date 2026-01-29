export default function Home() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-[var(--background-secondary)] px-4"
    >
      <div className="w-full max-w-2xl text-center">
        {/* Logo / Brand */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold tracking-tight text-[var(--color-primary-500)] md:text-5xl"
            style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
          >
            LawMadeSimple
          </h1>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[var(--color-accent-500)]" />
        </div>

        {/* Coming Soon Message */}
        <div className="rounded-2xl bg-white p-8 shadow-sm md:p-12">
          <p className="mb-4 text-lg text-[var(--foreground-secondary)]">
            Nigerian law, explained simply.
          </p>

          <h2
            className="mb-6 text-2xl font-semibold text-[var(--foreground)] md:text-3xl"
            style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
          >
            Coming Soon
          </h2>

          <p className="mx-auto max-w-md text-[var(--foreground-muted)]">
            We&apos;re building a platform to help Nigerians understand their legal rights through
            plain language explanations and practical examples.
          </p>

          {/* Features Preview */}
          <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
            <div className="rounded-xl bg-[var(--color-primary-50)] p-4">
              <div className="mb-2 text-2xl" aria-hidden="true">
                📖
              </div>
              <h3 className="font-medium text-[var(--foreground)]">Plain Language</h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Legal jargon translated into everyday words
              </p>
            </div>
            <div className="rounded-xl bg-[var(--color-accent-50)] p-4">
              <div className="mb-2 text-2xl" aria-hidden="true">
                💡
              </div>
              <h3 className="font-medium text-[var(--foreground)]">Practical Examples</h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Real scenarios showing how laws apply to you
              </p>
            </div>
            <div className="rounded-xl bg-[var(--background-tertiary)] p-4">
              <div className="mb-2 text-2xl" aria-hidden="true">
                🔍
              </div>
              <h3 className="font-medium text-[var(--foreground)]">Easy Search</h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Find answers by describing your situation
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-[var(--foreground-muted)]">
          LawMadeSimple provides general legal information, not legal advice. Always consult a
          qualified lawyer for specific legal matters.
        </p>
      </div>
    </main>
  );
}
