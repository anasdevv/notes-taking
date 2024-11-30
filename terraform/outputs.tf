output "frontend_bucket" {
  value = aws_s3_bucket.frontend_bucket.id
}

output "ecs_cluster_id" {
  value = aws_ecs_cluster.backend_cluster.id
}

output "ecr_repo_url" {
  value = aws_ecr_repository.backend_repo.repository_url
}
