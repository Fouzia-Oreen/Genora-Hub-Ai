import { Star } from 'lucide-react'
import { dummyTestimonialData } from '../assets/assets'

const Testimonial = () => {
    return (
        <div className='px-4 sm:px-20 xl:px-32 py-20'>
            <div className='text-center'>
                <h2 className='text-color_4 text-[42px] font-semibold'>Loved by Creators</h2>
                <p className='text-color_2/60 max-w-lg mx-auto'>Don't just take our word for it. Here's what our users are saying.</p>
            </div>
            <div className='flex flex-wrap mt-10 justify-center'>
                {dummyTestimonialData?.map((testimonial, index) => (
                    <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-color_5/10 shadow-lg border border-color_5/15 hover:-translate-y-1 transition duration-300 cursor-pointer'>
                        <div className="flex items-center gap-1">
                        {Array(5)
                            .fill(0)
                            .map((_, i) =>
                            i < testimonial.rating ? (
                                <Star key={i} className='w-4 h-4 text-color_11 fill-color_11' />
                            ) : (
                                <Star key={i} className='w-4 h-4 text-color_11/50 fill-color_11/30' />
                            )
                            )}
                        </div>
                        <p className='text-color_1/60 text-sm my-5'>"{testimonial.content}"</p>
                        <hr className='mb-5 border-color_5/15' />
                        <div className='flex items-center gap-4'>
                            <img src={testimonial.image} className='w-12 object-contain rounded-full' alt='' />
                            <div className='text-sm text-color_4/90'>
                                <h3 className='font-medium'>{testimonial.name}</h3>
                                <p className='text-xs text-color_4/60'>{testimonial.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default Testimonial
