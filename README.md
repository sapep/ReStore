Start DB with: docker run --name ReStoreDB -e POSTGRES_USER=user -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:latest
If the container already exists, use: docker start ReStoreDB