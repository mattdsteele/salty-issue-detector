import * as core from '@actions/core';
import { GitHub, context } from '@actions/github';

async function run() {
  try {
    const token = core.getInput('github-token');
    const gh = new GitHub(token);
    const issue_number = context.payload.issue!.number;
    const owner = context.payload.repository!.owner.name!;
    const repo = context.payload.repository!.name;
    console.log(`issue number: ${issue_number}, ${owner}, ${repo}`);
    const comment = await gh.issues.createComment({
      issue_number,
      repo,
      owner,
      body: '### Hello this is an automated comment!\n'
    });
    console.log(`Payload: ${JSON.stringify(comment)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
