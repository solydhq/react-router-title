"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_1 = require("react-router");
const getRoute = (routesConfig, path) => {
    let route;
    let currentMatch;
    if (Array.isArray(routesConfig)) {
        route = routesConfig.find((routeConfig) => {
            currentMatch = react_router_1.matchPath(path, routeConfig);
            return currentMatch;
        });
    }
    else {
        const id = Object.keys(routesConfig).find((key) => {
            currentMatch = react_router_1.matchPath(path, routesConfig[key]);
            return currentMatch;
        });
        route = routesConfig[id];
    }
    return {
        route,
        currentMatch,
    };
};
const getTitle = (routesConfig, path, divider, titles = [], matchCache) => {
    const { route, currentMatch } = getRoute(routesConfig, path);
    if (route) {
        if (route.title) {
            titles.push(route.title);
        }
        if (route.routes) {
            return getTitle(route.routes, path, divider, titles, currentMatch || matchCache);
        }
    }
    return {
        title: titles.reverse().join(` ${divider} `),
        titles,
        params: currentMatch ? currentMatch.params : matchCache.params,
    };
};
const RouterTitle = ({ pageTitle, routesConfig, callback = ({ title }) => title, divider = "·", prefix, }) => {
    const location = react_router_1.useLocation();
    react_1.useEffect(() => {
        Promise.resolve(callback(getTitle(routesConfig, location.pathname, divider, pageTitle && [pageTitle]), location)).then((title) => {
            document.title = prefix ? `${prefix}${title}` : title;
        });
    });
    return null;
};
exports.default = RouterTitle;
//# sourceMappingURL=index.js.map