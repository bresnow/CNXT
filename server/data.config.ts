import { version } from '../package.json';
import type { ISEAPair } from 'gun';

const Config = {
  ENV: {
    DOMAIN: process.env.DOMAIN,
    PEER_DOMAIN: process.env.PEER_DOMAIN?.split(
      ',' || ', ' || ' ' || '/' || ''
    ),
    CLIENT: process.env.PORT,
    APP_KEY_PAIR: {
      pub: process.env.PUB,
      priv: process.env.PRIV,
      epub: process.env.EPUB,
      epriv: process.env.EPRIV,
    } as ISEAPair,
  },
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
  },
  tags: {
    hashtag: {
      title: '#HashTagProtocol',
      description:
        'Use the #HashTagProtocol to launch dynamic namespaces for dynamic content. #Tag your instances. Attach and provide $Services to encrypted namespaces and deploy #AaaS [Anything as a Service].',
      profilePic: '/images/AppIcon.svg',
    },
    tag: {
      title: '#Tag',
      description:
        'Use the #HashTagProtocol to launch dynamic namespaces for dynamic content. #Tag your instances. Attach and provide $Services to encrypted namespaces and deploy #AaaS [Anything as a Service].',
      profilePic: '/images/AppIcon.svg',
    },
    cnxt: {
      page_title: `CNXT  Dynamic Namespaces`,
      version: `v.${version}`,
      profile: '/images/AppIcon.svg',
      subtitle: `This is the alpha implementation of the #HashedTagNamespaceProtocol. An open source #PaaS built by developer and #interfaceDesigner @Bresnow.`,
      text: `#CNXT [ pronounced kuh-next ] is a peer-to-peer, offline-first content management network. A *ProofOfWork hashing algorithm create unique content addresses or #nameSpaces. These !dynamicDomains can host an unlimited array of content and services. !inDEVELOPMENT`,
      meta_cards: {
        service_delimiters: {
          hash: {
            prefix: '#:\\',
            service: 'Information Delimiter',
            description: 'Point to any information. The default delimiter.',
          },
          at_rate: {
            prefix: '@:\\',
            service: 'Identity Delimiter',
            description:
              'User profiles, resumes, #eBusinessCards, and namespaces identifying individual personalities.',
          },
          dollar: {
            prefix: '$:\\',
            service: 'Finance & Barter Delimiter',
            description:
              'Price tickers, ecommerce, cryptocurrency, coupons, etc. The default delimiter for namespaces about money.',
          },
          x_clam: {
            prefix: '!:\\',
            service: 'Alert Delimiter',
            description:
              'Messages, notifications, chat, etc... The default delimiter for building namespaces around communication awareness.',
          },
          wildcard: {
            prefix: '*:\\',
            service: 'WildCard Delimiter',
            description: 'Namespaces dealing with more than one hash service.',
          },
        },
        links: {
          github: {
            id: 'github-remix.gun',
            link: 'https://github.com/bresnow/remix.gun/tree/cnxt',
            label: 'Github',
          },
          twitter: {
            id: 'github-remix.gun',
            link: 'https://github.com/bresnow/remix.gun/tree/cnxt',
            label: 'Github',
          },
        },
      },
      bresnow: {
        title: '#Bresnow',
        description:
          'Use the #HashTagProtocol to launch dynamic namespaces for dynamic content. #Tag your instances. Attach and provide $Services to encrypted namespaces and deploy #AaaS [Anything as a Service].',
        profilePic: '/images/AppIcon.svg',
      },
    },
  },
};

export default Config;
