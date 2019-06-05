import * as React from "react";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import "@assets/scss/react_swiper.scss";
import _isEqual from "lodash/isEqual";
import { createRef } from "react";
import { Link } from "react-router-dom";

interface ISwiperProps {
  slide?: object[],
  options?: object,
}

export default class ReactSwiper extends React.Component<ISwiperProps> {

  currentSwiper: any;
  swipe: any;

  constructor(props: any) {
    super(props);
    this.currentSwiper = null;
    this.swipe = createRef();
  }

  shouldComponentUpdate(nextProps: Readonly<ISwiperProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    return !_isEqual(this.props, nextProps);
  }

  componentDidMount(): void {
    this.updateSwiper();
  }

  componentDidUpdate(prevProps: Readonly<ISwiperProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.updateSwiper();
  }

  private updateSwiper() {
    const swiperInstance = this.getSwiper();
    if (swiperInstance) {
      this.clearSwiper();
    }
    const { options } = this.props;
    this.currentSwiper = new Swiper(this.swipe.current, {
      pagination: ".swiper-pagination",
      paginationClickable: true,
      loop: true,
      autoplay: 5000,
      speed: 1000,
      effect: "fade",
      ...options,
    });
  }

  private getSwiper() {
    return this.currentSwiper;
  }

  private clearSwiper() {
    if (this.currentSwiper) {
      this.currentSwiper.destroy();
      this.currentSwiper = null;
    }
  }

  render() {
    const { slide = [] } = this.props;
    return (
      <div className="swiper-banner" ref={this.swipe}>
        <div className="swiper-wrapper">
          {slide && slide.map((item: { url: string, id: number, image: string }) =>
            <div key={item.id} className="swiper-slide swiper-slide-bg"
                 style={{ backgroundImage: `url(${item.image})` }}
                 onClick={() => {
                   const w = window.open("about:blank");
                   w.location.href = item.url;
                 }
                 }>
            </div>
          )}
        </div>
        <div className="swiper-pagination"/>
      </div>
    );
  }
}
