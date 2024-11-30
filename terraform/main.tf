provider "aws" {
  region = "us-west-2"
}

# S3 Bucket for Frontend (Production)
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "my-frontend-prod-bucket"
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

# S3 Bucket for Frontend (Preview)
resource "aws_s3_bucket" "frontend_preview_bucket" {
  bucket = "my-frontend-preview-bucket"
}

# Enable Static Website Hosting for Preview Bucket
resource "aws_s3_bucket_website_configuration" "frontend_preview_bucket_website" {
  bucket = aws_s3_bucket.frontend_preview_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

# Update the Public Access Block to allow public policies
resource "aws_s3_bucket_public_access_block" "frontend_preview_bucket_public_access" {
  bucket = aws_s3_bucket.frontend_preview_bucket.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false  # Allow bucket policies to be public
  restrict_public_buckets = false  # Ensure bucket can be publicly accessible
}

# Bucket Policy for Public Read Access
resource "aws_s3_bucket_policy" "frontend_preview_bucket_policy" {
  bucket = aws_s3_bucket.frontend_preview_bucket.id

  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "${aws_s3_bucket.frontend_preview_bucket.arn}/*"
      }
    ]
  })
}

# ECS Cluster for Backend
resource "aws_ecs_cluster" "backend_cluster" {
  name = "my-backend-cluster"
}

# ECR Repository for Backend Images
resource "aws_ecr_repository" "backend_repo" {
  name = "my-backend-repo"
}

# Optional: IAM Role for ECS Task Execution (if needed)
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
