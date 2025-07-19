import React from 'react'
import { PricingTable} from '@clerk/clerk-react'

const PricePlan = () => {
  return (
    <div className='max-w-5xl mx-auto z-20 my-32'>
      <div className="text-center">
        <h2 className='text-[42px] font-semibold text-color_4'>Choose Your Plan</h2>
        <p className='mx-auto max-w-lg text-color_2/60 font-medium'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs</p>
      </div>
      <div className='mt-12 '>
        <PricingTable
        appearance={{
            variables: {
            colorPrimary: '#1D4ED8',
            colorText: '#172554',
            colorTitle:'#1D357B',
            fontWeight: '600',
            },
            elements: {
            card: 'bg-color_6 rounded-2xl shadow-lg border border-gray-200 p-6 hover:scale-105 transition-transform',
            title: 'text-xl font-semibold text-colorTitle',
            description: 'text-sm text-gray-500 mb-2',
            price: 'text-3xl font-bold text-color_5',
            button: 'btn2-grad',
            },
        }}
        />
        </div>
    </div>
  )
}

export default PricePlan
