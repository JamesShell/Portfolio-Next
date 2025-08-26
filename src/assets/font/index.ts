import localFont from 'next/font/local'

export const sfPro = localFont({
  src: [
    {
      path: './sf-pro-text-regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './SF-Pro-Display-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './SF-Pro-Display-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sf-pro',
  display: 'swap',
})

export const nyght = localFont({
  src: [
    {
      path: './nyght/NyghtSerif-Light.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './nyght/NyghtSerif-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './nyght/NyghtSerif-MediumItalic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './nyght/NyghtSerif-RegularItalic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './nyght/NyghtSerif-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './nyght/NyghtSerif-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './nyght/NyghtSerif-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './nyght/NyghtSerif-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './nyght/NyghtSerif-Dark.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './nyght/NyghtSerif-DarkItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-nyght',
  display: 'swap',
})
