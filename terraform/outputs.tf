

output "ecs_cluster_id" {
  value = aws_ecs_cluster.backend_cluster.id
}

output "ecr_repo_url" {
  value = aws_ecr_repository.backend_repo.repository_url
}
