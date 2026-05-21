export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug: _slug } = await params
  return <main />
}
