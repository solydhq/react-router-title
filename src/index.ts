import { useEffect } from "react";
import { match, matchPath, useLocation } from "react-router";
import { RouteConfig } from "react-router-config";
import { Location } from "history";

interface TitleObject {
  title: string;
  titles: string[];
  params: match["params"];
}

type Routes = RouteConfigExtended[] | {
  [name: string]: RouteConfigExtended,
};

export interface RouteConfigExtended extends Omit<RouteConfig, "routes"> {
  title: string;
  routes?: Routes;
}

const getRoute = (routesConfig: Routes, path: string): { route: RouteConfigExtended, currentMatch: match } => {
  let route: RouteConfigExtended;
  let currentMatch: match;

  if (Array.isArray(routesConfig)) {
    route = routesConfig.find((routeConfig) => {
      currentMatch = matchPath(path, routeConfig as RouteConfig);
      return currentMatch;
    });
  } else {
    const id: string = Object.keys(routesConfig).find((key) => {
      currentMatch = matchPath(path, routesConfig[key] as RouteConfig);
      return currentMatch;
    });
    route = routesConfig[id];
  }

  return {
    route,
    currentMatch,
  };
};

const getTitle = (
  routesConfig: Routes,
  path: string,
  divider: string,
  titles: string[] = [],
  matchCache?: match,
): TitleObject => {
  const { route, currentMatch } = getRoute(routesConfig, path);

  if (route) {
    if (route.title) { titles.push(route.title); }

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

interface RouterTitleProps {
  routesConfig: Routes;
  callback?: (titleObject: TitleObject, location: Location) => Promise<string> | string;
  pageTitle?: string;
  divider?: string;
  prefix?: string;
}

const RouterTitle = ({
  pageTitle,
  routesConfig,
  callback = ({ title }) => title,
  divider = "·",
  prefix,
}: RouterTitleProps) => {
  const location = useLocation();

  useEffect(() => {
    Promise.resolve(
      callback(
        getTitle(
          routesConfig,
          location.pathname,
          divider,
          pageTitle && [pageTitle],
        ),
        location,
      ),
    ).then((title) => {
      document.title = prefix ? `${prefix}${title}` : title;
    });
  });

  return null;
};

export default RouterTitle;
