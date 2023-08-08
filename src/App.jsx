import { forwardRef, useEffect, useState } from 'react';
import { routePaths, routes } from './utils/routesHelper';
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate
} from 'react-router-dom';
import Statistics from './pages/Statistics';
import { rootPath } from './configs/routesConfig';
import Error from './pages/Error';
import {
  AppBar,
  Box,
  Card,
  Divider,
  Drawer,
  SvgIcon,
  Toolbar,
  Typography,
  alpha,
  styled
} from '@mui/material';
import { TreeItem, TreeView, treeItemClasses, useTreeItem } from '@mui/lab';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import clsx from 'clsx';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const drawerWidth = 300;

const CustomContent = forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    onClick
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    onClick();
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

const StyledTreeItem = styled((props) => <TreeItem {...props} />)(
  ({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      '& .close': {
        opacity: 0.3
      }
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 10,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`
    }
  })
);

const Tree = () => {
  const navigate = useNavigate();
  const getTreeItems = (obj, lastPath = '') => {
    const result = [];
    for (let item in obj) {
      const hasChildren = obj[item].children ? true : false;
      const newPath = lastPath + '/' + item;

      result.push(
        <StyledTreeItem
          ContentComponent={CustomContent}
          label={<Typography fontSize={18}>{obj[item].label}</Typography>}
          nodeId={Math.random().toString(16).slice(2)}
          onClick={() =>
            newPath.slice(1).split('/').length !== 2 &&
            navigate(rootPath + newPath)
          }
        >
          {hasChildren && getTreeItems(obj[item].children, newPath)}
        </StyledTreeItem>
      );
    }
    return result;
  };

  const [treeItems, setTreeItems] = useState(getTreeItems(routes));

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ArrowDropDownIcon fontSize="large" />}
      defaultExpandIcon={<ArrowRightIcon fontSize="large" />}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        marginTop: '10px'
      }}
    >
      {treeItems}
    </TreeView>
  );
};

const Test = () => {
  console.log('test');
  return <div>test</div>;
};

function App() {
  console.log('app reload');
  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        <div style={{ width: `${drawerWidth}px` }}>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box'
              }
            }}
            variant="permanent"
            anchor="left"
          >
            <Divider />
            <Tree />
          </Drawer>
        </div>
        <div
          style={{
            flexGrow: 1,
            width: '100%',
            height: '100vh'
          }}
        >
          <Routes>
              {routePaths.map((path, index) => (
                <Route
                  path={rootPath + path}
                  element={<Statistics key={index} />}
                />
              ))}
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
