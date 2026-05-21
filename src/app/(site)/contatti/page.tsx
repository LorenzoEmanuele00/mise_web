import { client } from '@/sanity/lib/client'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Settings } from '@/lib/types'

export default async function ContattiPage() {
  const settings = await client.fetch<Settings | null>(
    SETTINGS_QUERY,
    {},
    { next: { tags: ['settings'] } }
  )

  return (
    <main>
      <section className="shell py-24">
        <p className="kicker text-accent mb-6">Dove siamo</p>
        <h1 className="h-1 text-ink mb-16">Contatti</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="divide-y divide-hair">
              {settings?.address && (
                <div className="py-6">
                  <p className="body-sm text-muted mb-1 uppercase tracking-wide">Indirizzo</p>
                  <p className="body text-ink">{settings.address}</p>
                </div>
              )}
              {settings?.phone && (
                <div className="py-6">
                  <p className="body-sm text-muted mb-1 uppercase tracking-wide">Telefono</p>
                  <a href={`tel:${settings.phone}`} className="body text-ink hover:text-accent transition-colors">{settings.phone}</a>
                </div>
              )}
              {settings?.email && (
                <div className="py-6">
                  <p className="body-sm text-muted mb-1 uppercase tracking-wide">Email</p>
                  <a href={`mailto:${settings.email}`} className="body text-ink hover:text-accent transition-colors">{settings.email}</a>
                </div>
              )}
              {settings?.orariSede && (
                <div className="py-6">
                  <p className="body-sm text-muted mb-1 uppercase tracking-wide">Orari sede</p>
                  <p className="body text-ink whitespace-pre-line">{settings.orariSede}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="p-8 bg-bg-elev border border-hair body text-ink-soft">
              Il modulo di contatto sarà disponibile a breve.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
