import { client } from '@/sanity/lib/client'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Settings } from '@/lib/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await client.fetch<Settings>(
    SETTINGS_QUERY,
    {},
    { next: { tags: ['settings'] } }
  )

  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer settings={settings} />
    </>
  )
}
