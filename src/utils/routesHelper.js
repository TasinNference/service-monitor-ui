import { routesObject } from '../configs/routesConfig';

export const routes = routesObject;

const getPaths = () => {
  const paths = [];
  const createPath = (obj, lastPath = '') => {
    for (let item in obj) {
      const newPath = lastPath + '/' + item;
      const isCluster = newPath.slice(1).split('/').length === 2;
      if (!isCluster) paths.push(newPath);
      if (obj[item].children) createPath(obj[item].children, newPath);
    }
  };
  createPath(routesObject);
  return paths;
};

export const routePaths = getPaths();
