const routes = {
  cambridge: {
    cms: {
      label: 'CMS',
      machine_name: 'CMS',
      dashboard: 'ae659ee8-d380-4db0-a341-0747f7e1e27a',
      children: {
        cluster1: {
          label: 'Cluster 1',
          children: {
            cops: {
              label: 'COPS',
              machine_name: 'CS004',
              dashboard: 'd2c31728-2ae1-48b7-b586-9236c3353757'
            },
            scanner1: {
              label: 'Scanner 1',
              machine_name: 'S1',
              dashboard: 'a94fd44b-6111-4881-b6a4-c3d014507a7b'
            }
          }
        }
      }
    }
  },
  SystemTesting: {
    cms: {
      label: 'CMS',
      machine_name: 'CMS',
      dashboard: 'ae659ee8-d380-4db0-a341-0747f7e1e27a',
      children: {
        cluster1: {
          label: 'Cluster 1',
          children: {
            cops: {
              label: 'COPS',
              machine_name: 'PC',
              dashboard: 'd2c31728-2ae1-48b7-b586-9236c3353757'
            },
            scanner1: {
              label: 'Scanner 1',
              machine_name: 'PCS1',
              dashboard: 'a94fd44b-6111-4881-b6a4-c3d014507a7b'
            },
            scanner3: {
              label: 'Scanner 3',
              machine_name: 'PCS3',
              dashboard: 'a94fd44b-6111-4881-b6a4-c3d014507a7b'
            },
            scanner4: {
              label: 'Scanner 4',
              machine_name: 'PCS4',
              dashboard: 'a94fd44b-6111-4881-b6a4-c3d014507a7b'
            }
          }
        }
      }
    }
  }
};

// Empty string or home path eg. "/monitor"
export const rootPath = '/monitor';

export const routesObject = routes[process.env.REACT_APP_SYSTEM];
