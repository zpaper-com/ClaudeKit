#!/bin/bash

# Deploy ClaudeKit website to CloudFront/S3
# Domain: kit.fperx.com

set -e

echo "🚀 Deploying ClaudeKit to kit.fperx.com..."

# Configuration
DOMAIN="kit.fperx.com"
ROOT_DOMAIN="fperx.com"
S3_BUCKET="s3://${DOMAIN}"
AWS_REGION="us-east-1"
CERTIFICATE_ARN=""  # Optional: Set if you already have a certificate

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first:${NC}"
    echo "   brew install awscli"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run:${NC}"
    echo "   aws configure"
    exit 1
fi

echo -e "${BLUE}📦 Building website...${NC}"

# Create a temporary build directory
BUILD_DIR="build"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy web files to build directory
cp -r web/* $BUILD_DIR/

# Update marketplace.json path in app.js to load from GitHub
sed -i.bak "s|const response = await fetch('../.claude-plugin/marketplace.json');|const response = await fetch('https://raw.githubusercontent.com/zpaper-com/ClaudeKit/main/.claude-plugin/marketplace.json');|g" $BUILD_DIR/js/app.js
rm $BUILD_DIR/js/app.js.bak

echo -e "${GREEN}✅ Build complete${NC}"

# Check if S3 bucket exists
echo -e "${BLUE}📦 Checking S3 bucket...${NC}"
if aws s3 ls $S3_BUCKET --region $AWS_REGION 2>&1 | grep -q 'NoSuchBucket'; then
    echo -e "${YELLOW}⚠️  Creating S3 bucket...${NC}"
    aws s3 mb $S3_BUCKET --region $AWS_REGION

    # Configure bucket for static website hosting
    aws s3 website $S3_BUCKET \
        --index-document index.html \
        --error-document index.html

    echo -e "${GREEN}✅ S3 bucket configured${NC}"
else
    echo -e "${GREEN}✅ S3 bucket exists${NC}"
fi

# Sync files to S3
echo -e "${BLUE}📤 Uploading to S3...${NC}"
aws s3 sync $BUILD_DIR $S3_BUCKET \
    --delete \
    --cache-control "public, max-age=3600" \
    --region $AWS_REGION

# Set cache control for HTML files (shorter cache)
aws s3 cp $BUILD_DIR/index.html $S3_BUCKET/index.html \
    --cache-control "public, max-age=300" \
    --content-type "text/html" \
    --region $AWS_REGION

# Set cache control for CSS/JS (longer cache)
aws s3 sync $BUILD_DIR/css $S3_BUCKET/css \
    --cache-control "public, max-age=31536000" \
    --content-type "text/css" \
    --region $AWS_REGION

aws s3 sync $BUILD_DIR/js $S3_BUCKET/js \
    --cache-control "public, max-age=31536000" \
    --content-type "application/javascript" \
    --region $AWS_REGION

echo -e "${GREEN}✅ Files uploaded to S3${NC}"

# Get or create SSL certificate
echo -e "${BLUE}🔒 Checking SSL certificate...${NC}"
if [ -z "$CERTIFICATE_ARN" ]; then
    # Check if certificate already exists
    CERTIFICATE_ARN=$(aws acm list-certificates --region us-east-1 --query "CertificateSummaryList[?DomainName=='${DOMAIN}'].CertificateArn" --output text)

    if [ -z "$CERTIFICATE_ARN" ]; then
        echo -e "${YELLOW}⚠️  No certificate found. Requesting new certificate...${NC}"
        CERTIFICATE_ARN=$(aws acm request-certificate \
            --domain-name $DOMAIN \
            --validation-method DNS \
            --region us-east-1 \
            --query 'CertificateArn' \
            --output text)

        echo -e "${YELLOW}⚠️  Certificate requested: ${CERTIFICATE_ARN}${NC}"
        echo -e "${YELLOW}⚠️  Waiting for DNS validation records...${NC}"
        sleep 10

        # Get validation records
        VALIDATION_RECORDS=$(aws acm describe-certificate \
            --certificate-arn $CERTIFICATE_ARN \
            --region us-east-1 \
            --query 'Certificate.DomainValidationOptions[0].ResourceRecord' \
            --output json)

        VALIDATION_NAME=$(echo $VALIDATION_RECORDS | jq -r '.Name')
        VALIDATION_VALUE=$(echo $VALIDATION_RECORDS | jq -r '.Value')

        echo -e "${YELLOW}⚠️  Adding DNS validation record to Route53...${NC}"

        # Get hosted zone ID
        HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='${ROOT_DOMAIN}.'].Id" --output text | cut -d'/' -f3)

        if [ -n "$HOSTED_ZONE_ID" ]; then
            # Add validation record
            cat > validation-record.json <<EOF
{
    "Changes": [{
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "${VALIDATION_NAME}",
            "Type": "CNAME",
            "TTL": 300,
            "ResourceRecords": [{"Value": "${VALIDATION_VALUE}"}]
        }
    }]
}
EOF

            aws route53 change-resource-record-sets \
                --hosted-zone-id $HOSTED_ZONE_ID \
                --change-batch file://validation-record.json

            rm validation-record.json

            echo -e "${YELLOW}⚠️  Waiting for certificate validation (this may take a few minutes)...${NC}"
            aws acm wait certificate-validated --certificate-arn $CERTIFICATE_ARN --region us-east-1
            echo -e "${GREEN}✅ Certificate validated${NC}"
        else
            echo -e "${RED}❌ Could not find hosted zone for ${ROOT_DOMAIN}${NC}"
            echo -e "${YELLOW}⚠️  Please manually validate certificate: ${CERTIFICATE_ARN}${NC}"
        fi
    else
        echo -e "${GREEN}✅ Certificate exists: ${CERTIFICATE_ARN}${NC}"
    fi
fi

# Check if CloudFront distribution exists
echo -e "${BLUE}🌐 Checking CloudFront distribution...${NC}"
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[?contains(@, '${DOMAIN}')]].Id" --output text 2>/dev/null || echo "")

if [ -z "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}⚠️  Creating CloudFront distribution...${NC}"

    # Create distribution config
    cat > distribution-config.json <<EOF
{
    "CallerReference": "claudekit-$(date +%s)",
    "Aliases": {
        "Quantity": 1,
        "Items": ["${DOMAIN}"]
    },
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [{
            "Id": "S3-${DOMAIN}",
            "DomainName": "${DOMAIN}.s3-website-${AWS_REGION}.amazonaws.com",
            "CustomOriginConfig": {
                "HTTPPort": 80,
                "HTTPSPort": 443,
                "OriginProtocolPolicy": "http-only"
            }
        }]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-${DOMAIN}",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"],
            "CachedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            }
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {"Forward": "none"}
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [{
            "ErrorCode": 404,
            "ResponsePagePath": "/index.html",
            "ResponseCode": "200",
            "ErrorCachingMinTTL": 300
        }]
    },
    "Comment": "ClaudeKit - kit.fperx.com",
    "Enabled": true,
    "ViewerCertificate": {
        "ACMCertificateArn": "${CERTIFICATE_ARN}",
        "SSLSupportMethod": "sni-only",
        "MinimumProtocolVersion": "TLSv1.2_2021"
    }
}
EOF

    DISTRIBUTION_ID=$(aws cloudfront create-distribution \
        --distribution-config file://distribution-config.json \
        --query 'Distribution.Id' \
        --output text)

    rm distribution-config.json

    echo -e "${GREEN}✅ CloudFront distribution created: ${DISTRIBUTION_ID}${NC}"
    echo -e "${YELLOW}⚠️  Waiting for distribution deployment (this may take 15-20 minutes)...${NC}"

    # Get CloudFront domain name
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)
else
    echo -e "${GREEN}✅ CloudFront distribution exists: ${DISTRIBUTION_ID}${NC}"
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)
fi

# Configure Route53
echo -e "${BLUE}🌐 Configuring Route53...${NC}"
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='${ROOT_DOMAIN}.'].Id" --output text | cut -d'/' -f3)

if [ -n "$HOSTED_ZONE_ID" ]; then
    echo -e "${GREEN}✅ Found hosted zone: ${HOSTED_ZONE_ID}${NC}"

    # Create/update A record
    cat > route53-change.json <<EOF
{
    "Changes": [{
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "${DOMAIN}",
            "Type": "A",
            "AliasTarget": {
                "HostedZoneId": "Z2FDTNDATAQYW2",
                "DNSName": "${CLOUDFRONT_DOMAIN}",
                "EvaluateTargetHealth": false
            }
        }
    }]
}
EOF

    aws route53 change-resource-record-sets \
        --hosted-zone-id $HOSTED_ZONE_ID \
        --change-batch file://route53-change.json

    rm route53-change.json

    echo -e "${GREEN}✅ Route53 configured${NC}"
else
    echo -e "${RED}❌ Could not find hosted zone for ${ROOT_DOMAIN}${NC}"
    echo -e "${YELLOW}⚠️  Please manually create DNS record:${NC}"
    echo "   Type: A (Alias)"
    echo "   Name: kit"
    echo "   Value: ${CLOUDFRONT_DOMAIN}"
fi

# Invalidate CloudFront cache
echo -e "${BLUE}🔄 Invalidating CloudFront cache...${NC}"
aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text

echo -e "${GREEN}✅ CloudFront cache invalidated${NC}"

# Clean up
rm -rf $BUILD_DIR

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "🌐 Website URL: ${BLUE}https://${DOMAIN}${NC}"
echo -e "🌐 CloudFront URL: ${BLUE}https://${CLOUDFRONT_DOMAIN}${NC}"
echo -e "📝 Distribution ID: ${BLUE}${DISTRIBUTION_ID}${NC}"
echo -e "🔒 Certificate ARN: ${BLUE}${CERTIFICATE_ARN}${NC}"
echo ""
echo -e "${YELLOW}Note: If this is a new distribution, it may take 15-20 minutes to fully deploy.${NC}"
echo ""
