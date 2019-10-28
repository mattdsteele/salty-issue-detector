import * as core from '@actions/core';
import { GitHub, context } from '@actions/github';
import * as natural from 'natural';

async function run() {
  try {
    const token = core.getInput('github-token');
    const gh = new GitHub(token);
    const issue_number = context.payload.issue!.number;
    var Analyzer = (natural as any).SentimentAnalyzer;
    var stemmer = require('natural').PorterStemmer;
    var analyzer = new Analyzer('English', stemmer, 'afinn');
    const words = context.payload.issue!.body!.split(' ');
    const result = analyzer.getSentiment(words);
    const params = {
      ...context.repo,
      issue_number,
      body: `### Hello this is an automated comment!\n **Your sentiment was analyzed to: ${result}**`
    };
    console.log('params', params, token);
    const comment = await gh.issues.createComment(params);
    console.log(`Payload: ${JSON.stringify(comment)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
