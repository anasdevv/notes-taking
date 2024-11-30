provider "aws" {
  region = "us-west-2"
}

# S3 Bucket for Frontend
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "my-frontend-prod-bucket"
  # Removed the acl argument
}

resource "aws_s3_bucket_ownership_controls" "frontend_bucket_ownership" {
  bucket = aws_s3_bucket.frontend_bucket.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_bucket_public_access" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "frontend_preview_bucket" {
  bucket = "my-frontend-preview-bucket"
  # Removed the acl argument
}

resource "aws_s3_bucket_ownership_controls" "frontend_preview_bucket_ownership" {
  bucket = aws_s3_bucket.frontend_preview_bucket.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_preview_bucket_public_access" {
  bucket = aws_s3_bucket.frontend_preview_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ECS Cluster for Backend
resource "aws_ecs_cluster" "backend_cluster" {
  name = "my-backend-cluster"
}

# ECR Repository for Backend Images
resource "aws_ecr_repository" "backend_repo" {
  name = "my-backend-repo"
}
