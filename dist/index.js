"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_1 = require("react-router");
const getRoute = (routesConfig, path) => {
    let route;
    let currentMatch;
    if (Array.isArray(routesConfig)) {
        route = routesConfig.find((routeConfig) => {
            currentMatch = (0, react_router_1.matchPath)(routeConfig, path);
            return currentMatch;
        });
    }
    else {
        const id = Object.keys(routesConfig).find((key) => {
            currentMatch = (0, react_router_1.matchPath)(routesConfig[key], path);
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
    const concatenateTitles = (route === null || route === void 0 ? void 0 : route.titleConcat) !== false;
    if (route && concatenateTitles) {
        if (route.title) {
            titles.push(route.title);
        }
        if (route.children) {
            return getTitle(route.children, path, divider, titles, currentMatch || matchCache);
        }
    }
    return {
        title: concatenateTitles ? titles.reverse().join(` ${divider} `) : route.title,
        titles,
        params: currentMatch ? currentMatch.params : matchCache.params,
    };
};
const RouterTitle = ({ pageTitle, routesConfig, callback = ({ title }) => title, divider = '·', prefix, }) => {
    const location = (0, react_router_1.useLocation)();
    (0, react_1.useEffect)(() => {
        Promise.resolve(callback(getTitle(routesConfig, location.pathname, divider, pageTitle && [pageTitle]), location)).then((title) => {
            document.title = prefix ? `${prefix}${title}` : title;
        });
    });
    return null;
};
exports.default = RouterTitle;
//# sourceMappingURL=index.js.map