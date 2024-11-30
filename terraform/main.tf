provider "aws" {
  region = "us-west-2"
}

# ECS Cluster for Backend
resource "aws_ecs_cluster" "backend_cluster" {
  name = "my-backend-cluster"
}

# ECR Repository for Backend Images
resource "aws_ecr_repository" "backend_repo" {
  name = "my-backend-repo"
  
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
}

# VPC and Networking (Basic Example)
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "Main VPC"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnets" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = "us-west-2${count.index == 0 ? "a" : "b"}"
  
  tags = {
    Name = "Public Subnet ${count.index + 1}"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([{
    name  = "backend-container"
    image = "${aws_ecr_repository.backend_repo.repository_url}:latest"
    portMappings = [{
      containerPort = 5000
      hostPort      = 5000
    }]
    environment = [
      {
        name  = "PORT"
        value = "5000"
      },
      {
        name  = "NODE_ENV"
        value = "production"
      }
    ]
    secrets = [
      {
        name      = "MONGO_URI"
        valueFrom = "arn:aws:secretsmanager:us-west-2:YOUR_ACCOUNT_ID:secret:MONGO_URI"
      },
      {
        name      = "SECRET"
        valueFrom = "arn:aws:secretsmanager:us-west-2:YOUR_ACCOUNT_ID:secret:SECRET"
      }
    ]
  }])
}

# ECS Service
resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.backend_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  launch_type     = "FARGATE"

  desired_count = 2

  network_configuration {
    subnets          = aws_subnet.public_subnets[*].id
    assign_public_ip = true
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Attach necessary policies to ECS Task Execution Role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Optional: CloudWatch Log Group for ECS
resource "aws_cloudwatch_log_group" "backend_logs" {
  name              = "/ecs/backend-logs"
  retention_in_days = 30
}