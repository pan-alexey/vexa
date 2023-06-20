import NodeEnvironment from 'jest-environment-node';
import { TextEncoder } from 'util';

// A custom environment to set the TextEncoder that is required by mongodb.
module.exports = class CustomTestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    console.log('-------');
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
    }
  }
};
