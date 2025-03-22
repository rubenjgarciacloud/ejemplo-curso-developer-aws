import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';

interface DistributionOnS3BucketWithDeploymentProps {
  sourcesPath: string[];
  destinationKeyPrefix: string;
}

export class DistributionOnS3BucketWithDeployment extends Construct {
  bucket: cdk.aws_s3.Bucket;
  distribution: cdk.aws_cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: DistributionOnS3BucketWithDeploymentProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.distribution = new cloudfront.Distribution(this, 'CloudFrontWebDistribution', {
      defaultBehavior: {
        origin: cloudfrontOrigins.S3BucketOrigin.withOriginAccessIdentity(this.bucket, {
          originPath: props.destinationKeyPrefix,
        }),
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
      },
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    new s3Deployment.BucketDeployment(this, 'Deployment', {
      sources: props.sourcesPath.map((path) => s3Deployment.Source.asset(path)),
      destinationBucket: this.bucket,
      destinationKeyPrefix: props.destinationKeyPrefix,
      distribution: this.distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(scope, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
      exportName: 'DistributionDomainName',
    });
  }
}
