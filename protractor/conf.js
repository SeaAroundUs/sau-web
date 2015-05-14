exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:9000/',
  specs: ['*-spec.js'],
  capabilities: {
    'browserName': 'chrome'
  },
  framework: 'jasmine'
};
