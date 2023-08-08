const routes = {
  cambridge: {
    cms: {
      label: 'CMS',
      children: {
        cluster1: {
          label: 'Cluster 1',
          children: {
            cops: {
              label: 'COPS'
            },
            scanner1: {
              label: 'Scanner 1'
            },
            scanner2: {
              label: 'Scanner 2'
            }
          }
        },
        cluster2: {
          label: 'Cluster 2',
          children: {
            cops: {
              label: 'COPS'
            },
            scanner1: {
              label: 'Scanner 1'
            }
          }
        }
      }
    },
    cms1: {
      label: 'CMS',
      children: {
        cluster1: {
          label: 'Cluster 1',
          children: {
            cops: {
              label: 'COPS'
            },
            scanner1: {
              label: 'Scanner 1'
            },
            scanner2: {
              label: 'Scanner 2'
            }
          }
        },
        cluster2: {
          label: 'Cluster 2',
          children: {
            cops: {
              label: 'COPS'
            },
            scanner1: {
              label: 'Scanner 1'
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
