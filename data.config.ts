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
        'og:image': `https://${process.env.DOMAIN}/images/Logo.svg`,
        'og:image:width': '512',
        'og:image:height': '512',
        'og:description':
          'Dynamic namespaces for dynamic content. #://HashtagProtocol',
        'og:title': `CNXT | Dynamic Namespaces | v.${version}`,
        'og:url': `https://${process.env.DOMAIN}/`,
        'og:site_name': `CNXT.app`,
        'og:locale': 'en_US',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@bresnow',
        'twitter:creator': '@bresnow',
        'twitter:title': `CNXT.app| Dynamic Namespaces | v.${version}`,
        'twitter:description':
          'Dynamic namespaces for dynamic content. #://HashtagProtocol',
        'twitter:image': `https://${process.env.DOMAIN}/images/Logo.svg`,
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
  },
};
