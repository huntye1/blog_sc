module.exports = {
  title: '小明的杂货铺',
  tagline: '记录学习生活',
  url: 'https://huntye1.github.io',
  baseUrl: '/blog/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'huntye1', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'vue3源码解析',
          position: 'left',
        },
        {
          href: 'https://github.com/huntye1',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    // footer: {
    //   style: 'dark',
    //   links: [
    //     {
    //       title: 'More',
    //       items: [
    //         {
    //           label: 'MyGitHub',
    //           href: 'https://github.com/huntye1',
    //         },
    //       ],
    //     },
    //   ],
    //   // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    // },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
