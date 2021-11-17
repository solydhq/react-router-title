import { useEffect } from 'react';
import { PathMatch, matchPath, useLocation, RouteObject } from 'react-router';
import { Location } from 'history';

export interface TitleObject {
  title: string;
  titles: string[];
  params: PathMatch['params'];
}

type Routes = RouteConfigExtended[] | {
  [name: string]: RouteConfigExtended,
};

export interface RouteConfigExtended extends Omit<RouteObject, 'children'> {
  title: string;
  titleConcat?: boolean;
  children?: Routes;
  path: string;
}

const getRoute = (routesConfig: Routes, path: string): { route: RouteConfigExtended, currentMatch: PathMatch } => {
  let route: RouteConfigExtended;
  let currentMatch: PathMatch;

  if (Array.isArray(routesConfig)) {
    route = routesConfig.find((routeConfig) => {
      currentMatch = matchPath(routeConfig, path);
      return currentMatch;
    });
  } else {
    const id: string = Object.keys(routesConfig).find((key) => {
      currentMatch = matchPath(routesConfig[key], path);
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
  matchCache?: PathMatch,
): TitleObject => {
  const { route, currentMatch } = getRoute(routesConfig, path);

  const concatenateTitles = route?.titleConcat !== false;

  if (route && concatenateTitles) {
    if (route.title) { titles.push(route.title); }

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

export interface RouterTitleProps {
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
  divider = '·',
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
