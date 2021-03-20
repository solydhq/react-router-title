# React Router Title

This component add the possibility to have a dynamic document title based on the [react-router-config](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config/README.md). It combines all titles for the affected routes and sub-routes to one string. Additionally you can modify the title in a callback function which gives you the possibility to query data and replace some strings in the title for example.

- [Installation](#installation)
- [Usage](#usage)
- [Config](#config)
  - [Props](#props)
  - [Dynamic Title](#dynamic-title)
  - [Disable concatenation with parent route titles & page title](#disable-concatenation-with-parent-route-titles--page-title)

## Installation

```bash
npm install react-router-title
# or
yarn add react-router-title
```

## Usage

Add the `RouterTitle` component as a direct child of `Router`.
```react
import RouterTitle from 'react-router-title';
import { Router } from 'react-router-dom';

const App = () => (
  <Router>
    <RouterTitle pageTitle="lyno" routesConfig={routes} />
    {/* your routes */}
  </Router>
);

export default App;
```

## Config

This component is using the [react-router-config](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config/README.md) to generate the title.

For this you have to extend the configuration with a title for each route.
```javascript
const routes = [
  {
    title: "",
    component: Root,
    routes: [
      {
        title: "Child",
        path: "/child/:id",
        component: Child,
        routes: [
          {
            title: "Grand Child",
            path: "/child/:id/grand-child",
            component: GrandChild
          }
        ]
      }
    ]
  }
];
```

Alternatively you can also use the routes config as an object.
```javascript
const routes = {
  root: {
    title: "",
    component: Root,
    routes: {
      child: {
        title: "Child",
        path: "/child/:id",
        component: Child,
        routes: {
          grandChild: {
            title: "Grand Child",
            path: "/child/:id/grand-child",
            component: GrandChild
          }
        }
      }
    }
  }
};
```

### Props

| Prop         | Required | Type         | Default Value
|--------------|----------|--------------|---------------
| pageTitle    | true     | string       |
| routesConfig | true     | array/object |
| divider      | false    | string       | `·`
| callback     | false    | function     | `({ title }) => title`
| prefix       | false    | string       |

### Dynamic Title

If you want to have something like the project name in your title you can add placeholders like `:projectName` in your title string which you can replace in the callback function. The callback function can return a `Promise` which must return a `string` after it becomes resolved or directly a `string`.

```javascript
export const callback = async (
  {
    title, // Final title string which was generated
    titles, // All title strings from all routes and sub-routes as an array
    params, // Params from the last sub-route which has params
  },
  location // Location object from router/history
) => {
  let newTitle = title;

  if (params.projectSlug && title.search(":projectName") !== -1) {
    const { projectName } = await getProjectData(projectSlug);
    newTitle = newTitle.replace(":projectName", projectName);
  }

  return newTitle;
}
```

### Disable concatenation with parent route titles & page title

If you want to only show a title without combining them with the parent ones & page title you can use the `titleConcat` option on the route of your choice.

```javascript
const routes = {
  root: {
    title: "Family",
    component: Root,
    routes: {
      child: {
        title: "Child",
        titleConcat: false,
        path: "/child/:id",
        component: Child,
        routes: {
          grandChild: {
            title: "Grand Child",
            path: "/child/:id/grand-child",
            component: GrandChild
          }
        }
      }
    }
  }
};
```
