'use client'

import { useGetActivities } from '@/lib/api/activities/queries'
import { formatDistanceToNow } from 'date-fns'

const CommunityHighlight = () => {
  const { data: activitiesData, isLoading } = useGetActivities({
    page: '1',
    limit: '6',
  })

  const activities = (activitiesData?.data || []).map((activity: any) => {
    // Map API data to component format
    // Activity structure: { type, message, user: { firstName, lastName, profilePicture }, metadata: { amount, currency, targetUserName, targetUserProfilePicture } }

    const isAward = activity.type.includes('AWARD') || activity.type.includes('PAYMENT');
    const isShare = !isAward;

    let actorName = activity.user?.firstName || "Stallion User";
    if (activity.user?.companyName) actorName = activity.user.companyName;

    return {
      id: activity.id,
      type: isAward ? 'awarded' : 'shared',
      actor: actorName,
      target: activity.metadata?.targetUserName || "a contributor",
      amount: activity.metadata?.amount ? `${activity.metadata.amount} ${activity.metadata.currency || 'USDC'}` : '',
      time: formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true }),
      avatars: [
        activity.user?.profilePicture || "https://placehold.co/40x40/007aff/ffffff?text=" + actorName.charAt(0),
        activity.metadata?.targetUserProfilePicture || "assets/icons/sdollar.png"
      ]
    };
  });

  // Fallback if no data yet (optional, or just show empty)
  const displayItems = activities.length > 0 ? activities : [];

  return (
    <section className='container mx-auto py-20'>
      <div className='text-center mb-16'>
        <h2 className='text-[45px] md:text-[64px] font-bold font-syne text-white mb-2'>
          Community Highlights
        </h2>
      </div>

      <div className='max-w-2xl mx-auto relative px-4 md:px-0'>
        {/* Vertical Line */}
        <div className='absolute left-[34px] md:left-[34px] top-4 bottom-4 w-px bg-[#27272A] -z-10' />

        <div className='flex flex-col gap-8 h-[500px] overflow-y-auto pr-4 scrollbar-hide'>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {displayItems.map((item: any) => (
                <div key={item.id} className='flex items-center gap-4 md:gap-6 border border-transparent hover:border-primary rounded-xl p-3 transition-all duration-300'>
                  {/* Avatars */}
                  <div className='relative shrink-0 w-[70px] h-[40px] flex items-center'>
                    {item.type === 'awarded' ? (
                      <>
                        <div className='absolute left-0 z-10 rounded-full border-2 border-black bg-black'>
                          <img
                            src={item.avatars[0]}
                            alt='User'
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        </div>
                        <div className='absolute left-6 z-20 rounded-full border-2 border-black bg-black'>
                          <img
                            src={item.avatars[1]}
                            alt='Logo'
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        </div>
                      </>
                    ) : (
                      <div className='absolute left-3 z-10'>
                        <div className='w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm border-2 border-black uppercase'>
                          {item.actor.substring(0, 2)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-[10px] md:text-[15px] font-inter leading-relaxed'>
                    <div className='flex flex-wrap items-center gap-x-1.5'>
                      <span className='text-white font-medium'>{item.actor}</span>
                      <span className='text-[#94969D]'>
                        {item.type === 'awarded' ? 'awarded' : 'shared'}
                      </span>
                      {item.target && item.type === 'awarded' && (
                        <>
                          <span className='text-white font-medium'>
                            {item.target}
                          </span>
                          <span className='text-[#94969D]'>a</span>
                        </>
                      )}
                      {item.amount && (
                        <span className='text-primary font-medium'>
                          {item.amount}
                        </span>
                      )}
                      {item.type === 'shared' && (
                        <span className="text-white font-medium">an update</span>
                      )}
                    </div>
                    <span className='text-[#94969D] text-xs md:text-sm whitespace-nowrap'>
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
              {displayItems.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No recent highlights to show.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default CommunityHighlight
