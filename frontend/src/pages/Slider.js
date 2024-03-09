import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SimpleSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,       // Enable autoplay
    autoplaySpeed: 200,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src = "https://static.vecteezy.com/system/resources/thumbnails/011/871/820/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg" alt = "1" style={{width:"100vw",height:"300px"}}/>
      </div>
      <div>
        <img src = "https://static.vecteezy.com/system/resources/thumbnails/004/707/493/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg" alt = "2" style={{width:"100vw",height:"300px"}}/>
      </div>
      <div>
        <img src = "https://previews.123rf.com/images/mikalaimanyshau/mikalaimanyshau1601/mikalaimanyshau160100083/50304057-colourful-shopping-vector-flat-banner-for-your-business-web-sites-etc-quality-design-illustrations.jpg"  alt = "2" style={{width:"100vw",height:"300px"}}/>
      </div>
    </Slider>
  );
};

export default SimpleSlider;
