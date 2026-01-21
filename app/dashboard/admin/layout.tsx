import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Stallion',
  description: 'Stallion Admin Administration',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-6 w-full max-w-7xl mx-auto pb-20'>
      {children}
    </div>
  )
}
