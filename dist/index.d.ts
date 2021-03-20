import { match } from "react-router";
import { RouteConfig } from "react-router-config";
import { Location } from "history";
export interface TitleObject {
    title: string;
    titles: string[];
    params: match["params"];
}
declare type Routes = RouteConfigExtended[] | {
    [name: string]: RouteConfigExtended;
};
export interface RouteConfigExtended extends Omit<RouteConfig, "routes"> {
    title: string;
    titleAsStandalone?: string;
    routes?: Routes;
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
