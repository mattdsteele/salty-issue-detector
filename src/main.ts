import * as core from '@actions/core';
import { GitHub, context } from '@actions/github';

async function run() {
  try {
    const token = core.getInput('github-token');
    const gh = new GitHub(token);
    const comment = await gh.issues.createComment({
      ...context.payload.repo,
      issue_number: context.payload.issue,
      body: '### Hello this is an automated comment!\n'
    });
    console.log(`Payload: ${JSON.stringify(comment)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
