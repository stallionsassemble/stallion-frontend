import { PostAuthRedirect } from '@/components/auth/post-auth-redirect'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Header } from '@/components/dashboard/header'
import { Sidebar } from '@/components/dashboard/sidebar'
import { SocketProvider } from '@/components/providers/socket-provider'
import { FloatingAdminChat } from '@/components/messages/floating-admin-chat'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SocketProvider>
        <PostAuthRedirect />
        <div className='flex min-h-screen bg-background text-foreground'>
          {/* Sidebar - Fixed width */}
          <Sidebar />

          {/* Main Content Area - Flex 1 */}
          <div className='flex flex-1 flex-col overflow-hidden'>
            <Header />

            {/* Page Content */}
            <main className='flex-1 overflow-y-auto p-4 md:p-8 bg-grid-pattern'>
              {children}
            </main>
          </div>
        </div>
        <FloatingAdminChat />
      </SocketProvider>
    </AuthGuard>
  )
}
