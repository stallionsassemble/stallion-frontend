import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contract Management | Stallion Admin',
  description: 'Manage the Stallion smart contract — change admin and fee account addresses',
}

export default function ContractManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-20">
      {children}
    </div>
  )
}
