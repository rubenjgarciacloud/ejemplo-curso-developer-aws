import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';

interface S3BucketWithDeploymentProps {
  sourcesPath: string[];
  destinationKeyPrefix: string;
}

export class S3BucketWithDeployment extends Construct {
  bucket: cdk.aws_s3.Bucket;

  constructor(scope: Construct, id: string, props: S3BucketWithDeploymentProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new s3Deployment.BucketDeployment(this, 'Deployment', {
      sources: props.sourcesPath.map((path) => s3Deployment.Source.asset(path)),
      destinationBucket: this.bucket,
      destinationKeyPrefix: props.destinationKeyPrefix,
    });
  }
}
