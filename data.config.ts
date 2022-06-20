export const data = {
  pages: {
    root: {
      meta: {
        title: 'Remix.GUN | Boilerplate',
        description: `Developed by Bresnow for FLTNGMMTH + XDesk`,
        author: 'Bresnow',
        keywords:
          'floating, mammoth, FLTNGMMTH, Bresnow, development, server, Remix.run, GunDB, gun',
        'og:type': 'website',
        'og:image': `https://${process.env.DOMAIN}/github/rmix-gun.png`,
        'og:image:width': '512',
        'og:image:height': '512',
        'og:description':
          'P2P content management system using Remix.run and GunDB. Styles with Tailwind.css',
        'og:title': 'Remix.GUN | Boilerplate',
        'og:url': `https://${process.env.DOMAIN}/`,
        'og:site_name': 'Remix.GUN | Boilerplate',
        'og:locale': 'en_US',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@bresnow',
        'twitter:creator': '@bresnow',
        'twitter:title': 'Remix.GUN | Boilerplate',
        'twitter:description':
          'P2P content management system using Remix.run and GunDB. Styles with Tailwind.css',
        'twitter:image': `https://${process.env.DOMAIN}/github/rmix-gun.png`,
        'twitter:image:alt': 'Remix.GUN | Boilerplate',
        'twitter:image:width': '512',
        'twitter:image:height': '512',
      },
    },
    index: {
      page_title: 'Remix.GUN Boilerplate Demo',
      profile: '/github/rmix-gun.png',
      text: `Peer-to-peer full stack boilerplate using Remix.Run and GunDB. I sandbox almost all of my development here to test in a production environment.`,
    },
    cnxt: {
      page_title: 'CNXT Dynamic Namespaces',
      profile: '/images/illustrations/metal2.png',
      text: `Cryptographically hashed, dynamic namespaces for dynamic content. Peer to peer content management. Open source Paas.`,
    },
    builder: {
      page_title: 'Dynamic Namespace Builder Demo ',
      text: `Build the namespace meta data . This application is peered to https://${process.env.PEER_DOMAIN}. The same data object will be available there also.`,
    },
  },
};
