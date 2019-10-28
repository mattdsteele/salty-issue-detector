import * as core from '@actions/core';
import { GitHub, context } from '@actions/github';

async function run() {
  try {
    const token = core.getInput('github-token');
    const gh = new GitHub(token);
    const payload = JSON.stringify(context.payload);
    console.log(`Payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
