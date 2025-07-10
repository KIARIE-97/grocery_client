'use client'

import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import shopping from '../../public/shop.jpg'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Link } from '@tanstack/react-router'

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
    img: 'https://i.pinimg.com/736x/6d/d4/99/6dd4992294ac166efdd45a102261b807.jpg',
    discount: '2% OFF',
  },
  {
    id: 3,
    title: 'Buy More & Save More',
    desc: 'nuts & Dry Fruits',
    img: 'https://tse1.explicit.bing.net/th/id/OIP.1SqDGNGXN_jWDK7tz_MshwE_DD?rs=1&pid=ImgDetMain&o=7&rm=3',
    discount: '3% OFF',
  },
]

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  )

  return (
    <>
      {/* create account today and get 10% off on your first order */}
      {/* <div
        className=" bg-black/30 py-12 px-6 md:px-16 flex flex-col md:flex-row items-center justify-center gap-10"
        // style={{
        //   backgroundImage: `url(${fruits})`,
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        // }}
      >
        <img
          src={shopping}
          alt="Dino with cart"
          className="w-80 md:w-100 rounded-2xl shadow-lg hidden md:block"
        />

        {/* Text & Form */}
        {/* <div className="text-center md:text-left max-w-md ">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Get 20% Discount On Your First Purchase
          </h2>
          <p className="text-gray-600 mb-6">
            Just Sign Up & Register it now to become member.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center w-full sm:w-auto border border-gray-300 rounded overflow-hidden bg-white"></div>
            <Link to="/auth/register">
              <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 text-sm font-semibold w-full sm:w-auto">
                SUBSCRIBE NOW
              </button>
            </Link>
          </div>
        </div> */}
      
      {/* Carousel */}
      <Carousel
        plugins={[plugin.current]}
        className="w-full  mx-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="md:basis-1/2 lg:basis-1/3">
              <div className=" h-64 md:h-80 lg:h-94 relative rounded-lg overflow-hidden">
                <Card className="h-full w-full relative">
                  <img
                    src={banner.img}
                    alt={banner.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <CardContent className="absolute inset-0  text-gray-700 flex flex-col justify-between p-6">
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
    </>
  )
}
