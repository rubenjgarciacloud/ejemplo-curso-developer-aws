import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DistributionOnS3BucketWithDeployment } from './distributionOnS3BucketWithDeployment';

export class CursoAwsDeveloperStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DistributionOnS3BucketWithDeployment(
      this,
      'DistributionOnS3BucketWithDeployment',
      {
        sourcesPath: ['./src'],
        destinationKeyPrefix: 'web/static',
      }
    );
  }
}
