const jupiterHooksPlugin = option => ({
    name: 'jupiterHooksPlugin',
    setup(api) {
      return {
        beforeExit: () => {
          option.beforeExit && option.beforeExit();
        },
        afterDev: () => {
          option.afterDev && option.afterDev();
        },
        beforeDev: () => {
          option.beforeDev && option.beforeDev();
        }
      };
    },
  });
  
  module.exports = jupiterHooksPlugin;
  