// Customer Interface Configuration
// Change this single line to switch between interfaces globally

export type CustomerInterfaceType = 'original' | 'mui' | 'demo';

// CHANGE THIS LINE TO SWITCH INTERFACES:
export const ACTIVE_CUSTOMER_INTERFACE: CustomerInterfaceType = 'original';

// Interface configurations
export const CUSTOMER_INTERFACE_CONFIG = {
  original: {
    name: 'Original Interface',
    description: 'Tailwind CSS + 3D animations',
    basePath: '/',
    menuPath: '/menu',
    itemPath: '/item',
  },
  mui: {
    name: 'MUI Interface', 
    description: 'Material-UI components only',
    basePath: '/mui',
    menuPath: '/mui/menu',
    itemPath: '/mui/item',
  },
  demo: {
    name: 'MUI Demo Interface',
    description: 'MUI with mock data (no API)',
    basePath: '/mui/demo',
    menuPath: '/mui/demo/menu',
    itemPath: '/mui/demo/item',
  },
} as const;

// Helper function to get current interface config
export const getCurrentInterfaceConfig = () => {
  return CUSTOMER_INTERFACE_CONFIG[ACTIVE_CUSTOMER_INTERFACE];
};

// Helper function to build paths for current interface
export const buildPath = (type: 'home' | 'menu' | 'item', id?: string | number) => {
  const config = getCurrentInterfaceConfig();
  
  switch (type) {
    case 'home':
      return config.basePath;
    case 'menu':
      return `${config.menuPath}/${id}`;
    case 'item':
      return `${config.itemPath}/${id}`;
    default:
      return config.basePath;
  }
};
