'use client'

const highlights = [
  {
    id: 1,
    type: 'awarded',
    actor: 'Qdrant',
    target: 'Denizhan Dakilir',
    amount: '$200 bounty',
    time: '3 hours ago',
    avatars: ['https://placehold.co/40x40', 'assets/icons/sdollar.png'],
  },
  {
    id: 2,
    type: 'awarded',
    actor: 'Stallion',
    target: 'Olamide Olutekunbi',
    amount: '$250 bounty',
    time: '2 days ago',
    avatars: ['https://placehold.co/40x40', 'assets/icons/sdollar.png'],
  },
  {
    id: 3,
    type: 'awarded',
    actor: 'Stallion',
    target: 'Olamide Olutekunbi',
    amount: '$250 bounty',
    time: '4 days ago',
    avatars: ['https://placehold.co/40x40', 'assets/icons/sdollar.png'],
  },
  {
    id: 4,
    type: 'shared',
    actor: 'tscircuit',
    amount: '$200 bounty',
    time: '2 months ago',
    avatars: ['ts'],
  },
  {
    id: 5,
    type: 'shared',
    actor: 'tscircuit',
    amount: '$400 bounty',
    time: '2 months ago',
    avatars: ['ts'],
  },
  {
    id: 6,
    type: 'shared',
    actor: 'tscircuit',
    amount: '$200 bounty',
    time: '2 months ago',
    avatars: ['ts'],
  },
]

const CommunityHighlight = () => {
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
          {highlights.map((item) => (
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
                    <div className='w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm border-2 border-black'>
                      ts
                    </div>
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-[10px] md:text-[15px] font-inter leading-relaxed'>
                <div className='flex flex-wrap items-center gap-x-1.5'>
                  <span className='text-white font-medium'>{item.actor}</span>
                  <span className='text-[#94969D]'>
                    {item.type === 'awarded' ? 'awarded' : 'shared a'}
                  </span>
                  {item.target && (
                    <>
                      <span className='text-white font-medium'>
                        {item.target}
                      </span>
                      <span className='text-[#94969D]'>a</span>
                    </>
                  )}
                  <span className='text-primary font-medium'>
                    {item.amount}
                  </span>
                </div>
                <span className='text-[#94969D] text-xs md:text-sm whitespace-nowrap'>
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CommunityHighlight
