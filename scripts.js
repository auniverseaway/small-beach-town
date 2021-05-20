/**
 * Helix Nav
 *
 * A low-touch client-side navigation function to inject
 * /nav.html content (if present) into a vanilla Helix Page.
 *
 * How to use
 *
 * 1. Add a "nav" doc to the root of your content folder
 * 2. Add this script to your page.
 *
 * Principles of this file
 *
 * 1. Support any domain schemes
 * 2. Functional separation of pure & impure functions.
 *
 */
const helixNav = async () => {
    const LOCAL_DOMAIN = 'https://local.page';
    const NAV_PATHNAME = '/nav.html';
    const {
        protocol,
        hostname,
        port,
        pathname,
    } = window.location;

    const getDomain = () => {
        const domain = `${protocol}//${hostname}`;
        return port ? `${domain}:${port}` : domain;
    };
    const CURRENT_DOMAIN = getDomain();

    const isNav = () => pathname !== NAV_PATHNAME;

    const fetchNavHtml = async () => {
        const resp = await fetch(`${CURRENT_DOMAIN}${NAV_PATHNAME}`);
        if (resp.ok) {
            return resp.text();
        }
        return null;
    };

    const getNavDoc = async (html) => {
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    };

    const getLocalNav = (doc) => {
        const navContent = doc.querySelector('main > div').innerHTML;
        const navEl = document.createElement('nav');
        navEl.innerHTML = navContent;
        return navEl;
    };

    const setDomainNav = (nav) => {
        const anchors = nav.getElementsByTagName('a');
        Array.from(anchors).forEach((anchor) => {
            const { href } = anchor;
            if (href.includes(LOCAL_DOMAIN)) {
                anchor.href = href.replace(LOCAL_DOMAIN, CURRENT_DOMAIN);
            }
        });
        return nav;
    };

    const insertNav = (nav) => {
        const header = document.querySelector('header');
        header.insertBefore(nav, header.firstChild);
    };

    const init = async () => {
        if (isNav()) {
            const html = await fetchNavHtml();
            if (html) {
                const doc = await getNavDoc(html);
                const nav = getLocalNav(doc);
                setDomainNav(nav);
                insertNav(nav);
            }
        }
    };
    init();
};

helixNav();
