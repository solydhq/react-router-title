import { PathMatch, RouteObject } from 'react-router';
import { Location } from 'history';
export interface TitleObject {
    title: string;
    titles: string[];
    params: PathMatch['params'];
}
declare type Routes = RouteConfigExtended[] | {
    [name: string]: RouteConfigExtended;
};
export interface RouteConfigExtended extends Omit<RouteObject, 'children'> {
    title: string;
    titleConcat?: boolean;
    children?: Routes;
    path: string;
}
export interface RouterTitleProps {
    routesConfig: Routes;
    callback?: (titleObject: TitleObject, location: Location) => Promise<string> | string;
    pageTitle?: string;
    divider?: string;
    prefix?: string;
}
declare const RouterTitle: ({ pageTitle, routesConfig, callback, divider, prefix, }: RouterTitleProps) => any;
export default RouterTitle;
