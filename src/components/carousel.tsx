'use client'

import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'


import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const banners = [
  {
    id: 1,
    title: 'Hot Deals on New Items',
    desc: 'Daily Essentials Eggs & Dairy',
    img: 'https://247wallst.com/wp-content/uploads/2016/02/eggs-e1455909974992.jpg',
    discount: '3% OFF',
  },
  {
    id: 2,
    title: 'Buy More & Save More',
    desc: 'Beverages',
    img: 'https://tse1.mm.bing.net/th/id/OIP.UWpbm1k7IO68sWYm4GPEMwHaH7?rs=1&pid=ImgDetMain&o=7&rm=3',
    discount: '2% OFF',
  },
  {
    id: 3,
    title: 'Buy More & Save More',
    desc: 'https://bakpac.co.uk/wp-content/uploads/2023/07/fruit-and-nut-small.png',
    img: '/nuts.jpg',
    discount: '3% OFF',
  },
]

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-5xl mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem
            key={banner.id}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1 h-64 md:h-80 lg:h-96 relative rounded-lg overflow-hidden">
              <Card className="h-full w-full relative">
                <img
                  src={banner.img}
                  alt={banner.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <CardContent className="absolute inset-0 bg-black/40 text-white flex flex-col justify-between p-6">
                  <div>
                    <span className="text-sm text-orange-400 font-bold">
                      {banner.discount}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold">
                      {banner.title}
                    </h2>
                    <p className="text-sm md:text-base">{banner.desc}</p>
                  </div>
                  <button className="self-end bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
                    Shop Now
                  </button>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    
    
  )
}
