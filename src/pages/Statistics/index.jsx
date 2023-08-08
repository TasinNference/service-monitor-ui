import React, { useEffect, useRef, useState } from 'react';
import ServicesTable from '../ServicesTable';
import ResizeHandle from '../../components/ResizeHandle';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { Card, IconButton, Tooltip, Typography } from '@mui/material';
import TableRowsIcon from '@mui/icons-material/TableRows';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation } from 'react-router-dom';
import { rootPath } from '../../configs/routesConfig';
import _ from 'lodash';
import { routes } from '../../utils/routesHelper';
import moment from 'moment';

const Iframe = (props) => {
  return (
    <div>
      <iframe {...props} style={{ border: 0, display: 'block', width: '100%' }} title="graph" />
    </div>
  );
};

const Statistics = () => {
  const location = useLocation();
  const panelRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState(null);
  const [directories, setDirectories] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [showGraphs, setShowGraphs] = useState(true);
  const [layout, setLayout] = useState('horizontal');
  const [machine, setMachine] = useState({})

  useEffect(() => {
    if (!showTable) setShowGraphs(true);
  }, [showTable]);

  useEffect(() => {
    if (!showGraphs) setShowTable(true);
  }, [showGraphs]);

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  const toggleGraphs = () => {
    setShowGraphs(!showGraphs);
  };

  const toggleLayout = () => {
    setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal');
  };

  useEffect(() => {
    const allPaths = location.pathname.replace(rootPath + '/', '').split('/');
    let sumPath = '';
    let count = 0;
    let tempDir = '';

    while (count < allPaths.length) {
      if (count !== 0) {
        sumPath = [sumPath, allPaths[count]].join('.children.');
      } else {
        sumPath = allPaths[0];
      }

      const label = _.get(routes, sumPath).label;

      tempDir = tempDir
        ? [tempDir, label].join(`\u00A0\u00A0\u00A0>\u00A0\u00A0\u00A0`)
        : label;
      count += 1;
    }

    setDirectories(tempDir);
    setMachine(_.get(routes, allPaths.join('.children.')))
  }, [location.pathname]);

  return (
    <div
      style={{ height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr' }}
    >
      <Card
        elevation="2"
        sx={{
          margin: '15px 15px',
          padding: '10px 25px',
          borderRadius: '100px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>{directories}</div>
          <div>
            <Tooltip title={`${showTable ? 'Hide' : 'Show'} Table`}>
              <IconButton onClick={toggleTable}>
                <TableRowsIcon color={showTable ? 'info' : 'inherit'} />
              </IconButton>
            </Tooltip>
            <Tooltip title={`${showGraphs ? 'Hide' : 'Show'} Graphs`}>
              <IconButton onClick={toggleGraphs}>
                <TimelineIcon color={showGraphs ? 'info' : 'inherit'} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Layout">
              <IconButton onClick={toggleLayout}>
                <DashboardIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Card>
      <div style={{ margin: '0 15px 15px 15px' }}>
        {false ? (
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Typography>No Data Found</Typography>
          </Card>
        ) : (
          <PanelGroup
            disablePointerEventsDuringResize
            autoSaveId="example"
            direction={layout}
          >
            {showTable && (
              <>
                <Panel
                  order={1}
                  minSize={30}
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      flexGrow: 1,
                      overflow: 'auto',
                      border: '1px solid rgb(50,50,50)',
                    }}
                  >
                    <ServicesTable machine={machine.machine_name} />
                  </Card>
                </Panel>
              </>
            )}
            {showTable && showGraphs && <ResizeHandle />}
            {showGraphs && (
              <>
                <Panel
                  order={2}
                  minSize={30}
                  onResize={() => setPanelHeight(panelRef.current.clientHeight)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Card
                    ref={panelRef}
                    sx={{
                      height: '100%',
                      flexGrow: 1,
                      display: 'grid',
                      overflow: 'auto',
                      [panelHeight > 300
                        ? 'gridTemplateRows'
                        : 'gridTemplateColumns']: '1fr 1fr 1fr'
                    }}
                  >
                    {[...Array(3).keys()].map((item, index) => {
                      const now = moment();
                      const past = now.clone().subtract(30, 'm')

                      return (
                      <Iframe
                        id="cr-embed-16000US5367000-demographics-age-distribution_by_decade-total"
                        class="census-reporter-embed"
                        src={`http://localhost:3000/d-solo/${machine.dashboard}/${machine.machine_name?.toLowerCase()}-resources?orgId=1&refresh=5s&from=${past.valueOf()}&to=${now.valueOf()}&panelId=${index+1}`}
                        frameBorder="0"
                        width="100%"
                        height="100%"
                      ></Iframe>
                    )})}
                  </Card>
                </Panel>
              </>
            )}
          </PanelGroup>
        )}
      </div>
    </div>
  );
};

export default Statistics;
