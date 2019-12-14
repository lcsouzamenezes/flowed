import { expect } from 'chai';
import { debug as rawDebug } from 'debug';
import { FlowManager, ValueMap } from '../src';
const debug = rawDebug('flowed:test');

class AlwaysErrorThrown {
  public async exec(): Promise<ValueMap> {
    throw new Error('This is an error in a task (using throw)');
  }
}

class AlwaysRejectPromise {
  public async exec(): Promise<ValueMap> {
    return Promise.reject(new Error('This is an error in a task (using Promise.reject)'));
  }
}

describe('error thrown in tasks', () => {
  it('are handled properly throwing error', async () => {
    let errorMsg;

    await FlowManager.run(
      {
        tasks: {
          T: {
            resolver: {
              name: 'throwError',
            },
          },
        },
      },
      {},
      [],
      {
        throwError: AlwaysErrorThrown,
      },
    ).catch(error => {
      errorMsg = error.message;
      debug(errorMsg);
    });

    expect(errorMsg).to.be.eql('This is an error in a task (using throw)');
  });

  it('are handled properly throwing error', async () => {
    let errorMsg;

    await FlowManager.run(
      {
        tasks: {
          T: {
            resolver: {
              name: 'throwError',
            },
          },
        },
      },
      {},
      [],
      {
        throwError: AlwaysRejectPromise,
      },
    ).catch(error => {
      errorMsg = error.message;
      debug(errorMsg);
    });

    expect(errorMsg).to.be.eql('This is an error in a task (using Promise.reject)');
  });
});
