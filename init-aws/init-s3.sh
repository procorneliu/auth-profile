#!/bin/bash
echo "Creating S3 bucket 'avatars' in Localstack..."
awslocal s3 mb s3://avatars || true