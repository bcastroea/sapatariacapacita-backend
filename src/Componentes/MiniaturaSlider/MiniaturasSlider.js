import React from 'react'
import { PrevButton, NextButton, usePrevNextButtons } from './ArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import './MiniaturasSlider.css'

const MiniaturasSlider = ({ images, selectedIndex, onThumbnailClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true
  })

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  React.useEffect(() => {
    if (!emblaApi) return
    emblaApi.scrollTo(selectedIndex)
  }, [emblaApi, selectedIndex])

  // Função para obter a URL da imagem (suporte para objetos e strings)
  const getImageUrl = (img) => {
    if (typeof img === 'string') return img;
    if (img && img.url) return img.url;
    if (img && img.id) return `/produtos/imagem/${img.id}`;
    return '/fallback-image.jpg';
  };

  return (
    <div className="product-thumbnails">
      <div className="product-thumbnails__viewport" ref={emblaRef}>
        <div className="product-thumbnails__container">
          {images.map((img, index) => (
            <div className="product-thumbnails__slide" key={index}>
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                className={`product-thumbnails__img ${selectedIndex === index ? 'is-active' : ''}`}
                onClick={() => onThumbnailClick(index)}
                onError={(e) => {
                  e.target.src = '/fallback-image.jpg';
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {(!prevBtnDisabled || !nextBtnDisabled) && (
        <div className="product-thumbnails__controls">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      )}
    </div>
  )
}

export default MiniaturasSlider