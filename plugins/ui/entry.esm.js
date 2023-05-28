// Import vue components
import * as components from '@/lib-components/index';

// install function executed by Vue.use()
const install = function installFastUiElements(Vue, config) {
  Object.entries(components).forEach(([componentName, component]) => {
    if (componentName === 'ShIcon' && config?.iconsPath) {
      component.computed.iconsPath = () => {
        return config.iconsPath;
      };
      Vue.component(componentName, component);
    } else {
      Vue.component(componentName, component);
    }
  });
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from '@/lib-components/index';
