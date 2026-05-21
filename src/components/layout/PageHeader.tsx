import Kicker from '@/components/ui/Kicker'

interface PageHeaderProps {
  kicker: string
  title: string
}

export default function PageHeader({ kicker, title }: PageHeaderProps) {
  return (
    <>
      <p className="mb-6">
        <Kicker className="text-accent">{kicker}</Kicker>
      </p>
      <h1 className="h-1 text-ink mb-12">{title}</h1>
    </>
  )
}
