import type { Metadata } from 'next'
import Image from 'next/image'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photos from Wells Gray Golf & RV Resort — glamping domes, creekside RV sites, 9-hole golf, wood-fired sauna, private lake, and the stunning landscapes of Wells Gray Provincial Park.',
}

const photos = [
  {
    src: '/images/PXL_20240518_203127249-EDIT-scaled.jpg',
    alt: 'Glamping dome beside the creek',
    category: 'Stay',
    span: 'col-span-2',
  },
  {
    src: '/images/PXL_20240728_033755893-EDIT-scaled.jpg',
    alt: 'Private swimming lake',
    category: 'Activities',
    span: '',
  },
  {
    src: '/images/PXL_20240701_001257503-scaled.jpg',
    alt: 'Wood-fired sauna',
    category: 'Activities',
    span: '',
  },
  {
    src: '/images/wellsgraygolf12.png',
    alt: '9-hole golf course at Wells Gray Resort',
    category: 'Golf',
    span: 'col-span-2',
  },
  {
    src: '/images/wellsgraygolf8.png',
    alt: 'Golf course fairway',
    category: 'Golf',
    span: '',
  },
  {
    src: '/images/wellsgraygolf2.png',
    alt: 'Disc golf course through the forest',
    category: 'Golf',
    span: '',
  },
  {
    src: '/images/PXL_20230621_022025523.MP-EDIT-scaled.jpg',
    alt: 'Wells Gray Provincial Park landscape',
    category: 'Park',
    span: 'col-span-2',
  },
  {
    src: '/images/20210924_172621-scaled.jpg',
    alt: 'Creekside RV sites',
    category: 'Stay',
    span: '',
  },
  {
    src: '/images/20210731_180321-scaled.jpg',
    alt: 'Resort grounds and RV sites',
    category: 'Stay',
    span: '',
  },
  {
    src: '/images/PXL_20250504_163611703-EDIT-scaled.jpg',
    alt: 'Forest sleeping cabins',
    category: 'Stay',
    span: '',
  },
  {
    src: '/images/PXL_20250604_163055857-EDIT-scaled.jpg',
    alt: 'Tent camping sites',
    category: 'Stay',
    span: '',
  },
  {
    src: '/images/PXL_20250629_025242307-EDIT-scaled.jpg',
    alt: 'Seasonal village',
    category: 'Village',
    span: 'col-span-2',
  },
  {
    src: '/images/461692343_10162000088875148_5722285476960156898_n.jpg',
    alt: 'Wedding ceremony at the forest-edge gazebo',
    category: 'Venue',
    span: '',
  },
  {
    src: '/images/20210621_205223-scaled.jpg',
    alt: 'Gazebo and venue grounds',
    category: 'Venue',
    span: '',
  },
  {
    src: '/images/461719795_10162000089565148_4909250211936855684_n.jpg',
    alt: 'Wedding reception at Wells Gray Resort',
    category: 'Venue',
    span: '',
  },
  {
    src: '/images/457303431_10161883687870148_8848637454076928890_n.jpg',
    alt: 'Event venue gathering',
    category: 'Venue',
    span: '',
  },
  {
    src: '/images/PXL_20240824_0258159262-EDIT-scaled.jpg',
    alt: 'Resort accommodation',
    category: 'Stay',
    span: '',
  },
  {
    src: '/images/PXL_20230924_013649576-scaled.jpg',
    alt: 'Wells Gray Resort grounds in autumn',
    category: 'Park',
    span: '',
  },
  {
    src: '/images/20210713_1838270-scaled.jpg',
    alt: 'Full service RV sites',
    category: 'Stay',
    span: 'col-span-2',
  },
  {
    src: '/images/Gazebo.png',
    alt: 'The forest-edge event gazebo',
    category: 'Venue',
    span: '',
  },
]

const categories = ['All', 'Stay', 'Activities', 'Golf', 'Venue', 'Park', 'Village']

export default function GalleryPage() {
  return (
    <>
      <RevealInit />

      {/* Header */}
      <section className="section-dark pt-32 pb-14">
        <div className="container-content">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">Gallery</p>
          <h1 className="heading-display text-parchment mb-4">The Resort in Photos</h1>
          <p className="body-lead text-parchment/70 max-w-[520px]">
            From the creek at sunrise to the gazebo at golden hour — this is what waiting for you looks like.
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="section-dark pb-24">
        <div className="container-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {photos.map((photo, i) => (
              <div
                key={photo.src}
                className={`reveal relative overflow-hidden rounded-lg bg-bark/50 ${photo.span ?? ''}`}
                style={{
                  height: photo.span === 'col-span-2' ? '380px' : '260px',
                  transitionDelay: `${(i % 6) * 60}ms`,
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes={photo.span === 'col-span-2'
                    ? '(max-width: 640px) 100vw, (max-width: 768px) 100vw, 66vw'
                    : '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bark/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 hover:opacity-100 hover:translate-y-0 transition-all duration-300">
                  <span className="font-body text-xs text-ember font-semibold uppercase tracking-widest">{photo.category}</span>
                  <p className="font-body text-parchment text-sm mt-1">{photo.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-forest py-14">
        <div className="container-content flex flex-col sm:flex-row items-center justify-between gap-6 reveal">
          <p className="font-display text-parchment text-xl">Ready to see it in person?</p>
          <a href="/stay#book" className="btn-ember shrink-0">Reserve Your Site</a>
        </div>
      </section>
    </>
  )
}
