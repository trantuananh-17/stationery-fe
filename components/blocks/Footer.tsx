import { IconType, LinkType } from '@/types/type';
import Link from 'next/link';

interface Props {
  logo?: IconType;
  description?: string;
  address: {
    label: string;
    desc: string;
    hotline: string;
    cskh: string;
    email: string;
  }[];
  navSections?: {
    title: string;
    links: {
      label: string;
      link: LinkType;
    }[];
  }[];
  copyright?: string;
}

export default function Footer({ logo, address, navSections, copyright }: Props) {
  return (
    <footer className='bg-background'>
      <div className='py-12 sm:py-16 lg:py-20'>
        <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8'>
          <div className='lg:col-span-4'>
            {logo && (
              <Link href='/' className='mb-4 inline-block' aria-label='Home'>
                {logo}
              </Link>
            )}
            <div className='space-y-6'>
              {address.map((item, index) => (
                <div key={index} className='space-y-3'>
                  <p className='font-semibold'>{item.label}</p>

                  <p className='text-muted-foreground'>{item.desc}</p>

                  <ul className='space-y-2'>
                    <li>
                      <span className='text-muted-foreground'> Hotline: </span>{' '}
                      <a href={`tel:${item.hotline}`} className='text-blue-800 hover:underline'>
                        {item.hotline}
                      </a>
                    </li>

                    <li>
                      <span className='text-muted-foreground'>CSKH:</span>{' '}
                      <a href={`tel:${item.cskh}`} className='text-blue-800 hover:underline'>
                        {item.cskh}
                      </a>
                    </li>

                    <li>
                      <span className='text-muted-foreground'>Email:</span>{' '}
                      <a href={`mailto:${item.email}`} className='text-blue-800 hover:underline'>
                        {item.email}
                      </a>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
          {navSections && navSections.length > 0 && (
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-8'>
              {navSections.map((section, index) => (
                <div key={index}>
                  <h3 className='mb-4 font-semibold'>{section.title}</h3>
                  <ul className='space-y-3'>
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.link?.href || '#'}
                          target={link.link?.target || '_self'}
                          className='text-muted-foreground hover:text-foreground transition-colors'
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-4 border-t py-6 sm:flex-row'>
        {copyright && <p className='text-muted-foreground text-sm'>{copyright}</p>}
      </div>
    </footer>
  );
}
