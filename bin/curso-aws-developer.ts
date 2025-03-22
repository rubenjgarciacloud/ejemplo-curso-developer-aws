#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CursoAwsDeveloperStack } from '../lib/curso-aws-developer-stack';

const app = new cdk.App();
new CursoAwsDeveloperStack(app, 'CursoAwsDeveloperStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
