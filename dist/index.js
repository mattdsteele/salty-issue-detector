"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var Analyzer = natural.SentimentAnalyzer;
            var stemmer = require('natural').PorterStemmer;
            var analyzer = new Analyzer('English', stemmer, 'afinn');
            const words = github_1.context.payload.issue.body.split(' ');
            console.log('going to parse: ', words);
            const result = analyzer.getSentiment(words);
            console.log('made it past analyzer', result);
            const token = core.getInput('github-token');
            const gh = new github_1.GitHub(token);
            const issue_number = github_1.context.payload.issue.number;
            const params = Object.assign({}, github_1.context.repo, { issue_number, body: `### Hello this is an automated comment!\n **Your sentiment was analyzed to: ${result}**` });
            console.log('params', params, token);
            const comment = yield gh.issues.createComment(params);
            console.log(`Payload: ${JSON.stringify(comment)}`);
        }
        catch (error) {
            console.error(error);
            console.error('Sorry!');
            core.setFailed(error.message);
        }
    });
}
run();
