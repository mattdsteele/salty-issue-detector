import * as core from '@actions/core';
import { GitHub, context } from '@actions/github';
import * as natural from 'natural';
import { WebhookPayload } from '@actions/github/lib/interfaces';

const getBody = (payload: WebhookPayload, eventName: string): string => {
  if (eventName === 'issue_comment') {
    return payload.comment.body;
  }
  return payload.issue!.body!;
};
const getSentiment = (body: string) => {
  const tokens = new natural.WordTokenizer().tokenize(body);

  var Analyzer = (natural as any).SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  var analyzer = new Analyzer('English', stemmer, 'afinn');
  console.debug('going to parse: ', tokens);
  const result: number = analyzer.getSentiment(tokens);
  return result;
};

const getCustomMessage = (sentimentValue: number) => {
  if (sentimentValue < 0) {
    return `You're feeling a little salty today, eh? Remember this repository adheres to the [DBAD](https://dbad-license.org/) license`;
  }
  return 'Thanks for keeping it clean.';
};

async function run() {
  try {
    const issue_number = context.payload.issue!.number;
    const author = context.actor;
    const body = getBody(context.payload, context.eventName);
    const sentimentValue = getSentiment(body);
    const customMessage = getCustomMessage(sentimentValue);
    console.debug('made it past analyzer', sentimentValue);
    const token = core.getInput('github-token');
    const gh = new GitHub(token);
    const params = {
      ...context.repo,
      issue_number,
      body: `
### Hello @${author}! This is a bot! Beep boop. 🤖
**Your sentiment was analyzed to: ${sentimentValue}**
${customMessage}
`
    };
    console.debug('params', params, token);
    const comment = await gh.issues.createComment(params);
    console.debug(`Payload: ${JSON.stringify(comment)}`);
  } catch (error) {
    console.error(error);
    console.error('Sorry!');
    core.setFailed(error.message);
  }
}

const debug = async () => {
  const { action, actor, eventName, payload } = context;
  console.log(`${action} done by ${actor} with event name ${eventName}`);
  console.log(payload);
};

// debug();
run();
