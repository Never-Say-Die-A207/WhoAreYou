import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './MobileCarousel.css';
import RedFoxMaskImage from '../../assets/RedFox.png';
import SpiderManMaskImage from '../../assets/SpiderMan.png';
import SpiderManBlackMaskImage from '../../assets/SpiderManBlack.png';
import JokerMaskImage from '../../assets/Joker.png';
import SquidMaskImage from '../../assets/Squid.png';

import { Pagination, Navigation, Scrollbar } from 'swiper/modules';

const masks = [
  { id: 'RedFox', image: RedFoxMaskImage, alt: 'RedFox' },
  // { id: 'PinkFox', image: PinkFoxMaskImage, alt: 'PinkFox' },
  { id: 'SpiderMan', image: SpiderManMaskImage, alt: 'SpiderMan' },
  { id: 'SpiderManBlack', image: SpiderManBlackMaskImage, alt: 'SpiderManBlack' },
  { id: 'Joker', image: JokerMaskImage, alt: 'Joker' },
  { id: 'Squid', image: SquidMaskImage, alt: 'Squid' },
];

export default function VerticalCarousel({ setMask }) {
  return (
    <div className="carousel-container-mobile">
      <Swiper
        modules={[Pagination, Navigation, Scrollbar]}
        slidesPerView={3}
        spaceBetween={15}
        // centeredSlides={true}
        // direction={'vertical'}
        // pagination={{ clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next-mobile',
          prevEl: '.swiper-button-prev-mobile',
        }}
        scrollbar={{ draggable: true }}
        className="swiper-mobile"
      >
        {masks.map((mask) => (
          <SwiperSlide key={mask.id}>
            <img src={mask.image} alt={mask.alt} className="carousel-image" onClick={() => setMask(mask.id)} />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <div className="swiper-button-prev">▲</div>
      <div className="swiper-button-next">▼</div> */}
    </div>
  );
}
