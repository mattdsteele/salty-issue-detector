"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const natural = __importStar(require("natural"));
const getBody = (payload, eventName) => {
    if (eventName === 'issue_comment') {
        return payload.comment.body;
    }
    return payload.issue.body;
};
const getSentiment = (body) => {
    const tokens = new natural.WordTokenizer().tokenize(body);
    var Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    var analyzer = new Analyzer('English', stemmer, 'afinn');
    console.debug('going to parse: ', tokens);
    const result = analyzer.getSentiment(tokens);
    return result;
};
const getCustomMessage = (sentimentValue) => {
    if (sentimentValue < 0) {
        return `You're feeling a little salty today, eh? Remember this repository adheres to the [DBAD](https://dbad-license.org/) license`;
    }
    return 'Thanks for keeping it clean.';
};
async function run() {
    try {
        const issue_number = github_1.context.payload.issue.number;
        const author = github_1.context.actor;
        const body = getBody(github_1.context.payload, github_1.context.eventName);
        const sentimentValue = getSentiment(body);
        const customMessage = getCustomMessage(sentimentValue);
        console.debug('made it past analyzer', sentimentValue);
        const token = core.getInput('github-token');
        const gh = new github_1.GitHub(token);
        const params = Object.assign({}, github_1.context.repo, { issue_number, body: `
### Hello @${author}! This is a bot! Beep boop. 🤖
**Your sentiment was analyzed to: ${sentimentValue}**
${customMessage}
` });
        console.debug('params', params, token);
        const comment = await gh.issues.createComment(params);
        console.debug(`Payload: ${JSON.stringify(comment)}`);
    }
    catch (error) {
        console.error(error);
        console.error('Sorry!');
        core.setFailed(error.message);
    }
}
const debug = async () => {
    const { action, actor, eventName, payload } = github_1.context;
    console.log(`${action} done by ${actor} with event name ${eventName}`);
    console.log(payload);
};
// debug();
run();
