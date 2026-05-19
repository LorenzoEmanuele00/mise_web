export default async function ServizioPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug: _slug } = await params
  return <main />
}
