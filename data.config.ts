import pkg from './package.json';
let { version } = JSON.parse(JSON.stringify(pkg));
export const data = {
  pages: {
    root: {
      meta: {
        title: `CNXT | Dynamic Namespaces | v.${version}`,
        description: `Dynamic namespaces for dynamic content. Developed by Bresnow for FLTNGMMTH + XDesk`,
        author: 'Bresnow',
        keywords:
          'cnxt, xdesk, dynamic, namespaces, globalIcon, taglish, #://, hashtag, domains, crypto, floating, mammoth, FLTNGMMTH, Bresnow, development, server, Remix.run, GunDB, gun',
        'og:type': 'website',
        'og:image': `https://${process.env.DOMAIN}/images/AppIcon.svg`,
        'og:image:width': '512',
        'og:image:height': '512',
        'og:description':
          'P2P content management system using Remix.run and GunDB. Styles with Tailwind.css',
        'og:title': 'Remix.GUN | Boilerplate',
        'og:url': `https://${process.env.DOMAIN}/`,
        'og:site_name': `CNXT | Dynamic Namespaces | v.${version}`,
        'og:locale': 'en_US',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@bresnow',
        'twitter:creator': '@bresnow',
        'twitter:title': `CNXT.dev | Dynamic Namespaces | v.${version}`,
        'twitter:description':
          'P2P content management system using Remix.run and GunDB. Styles with Tailwind.css',
        'twitter:image': `https://${process.env.DOMAIN}/images/AppIcon.svg`,
        'twitter:image:alt': `CNXT | Dynamic Namespaces | v.${version}`,
        'twitter:image:width': '512',
        'twitter:image:height': '512',
      },
    },
    cnxt: {
      page_title: `CNXT  Dynamic Namespaces  v.${version}`,
      profile: '/images/AppIcon.svg',
      text: `Use the #HashTagProtocol to launch dynamic namespaces for dynamic content. #Tag your instances. Attach and provide $Services to encrypted namespaces and deploy #AaaS [Anything as a Service].`,
    },
    builder: {
      page_title: 'Dynamic Namespace Builder Demo ',
      text: `Build the namespace meta data . This application is peered to https://${process.env.PEER_DOMAIN}. The same data object will be available there also.`,
    },
  },
};
