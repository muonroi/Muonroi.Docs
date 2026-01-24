# CI/CD with Docker and Kubernetes

This demo shows an end-to-end pipeline that builds the project, publishes a Docker image, and deploys it to a Kubernetes cluster using GitHub Actions.

## 1. Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish src/YourService/YourService.csproj -c Release -o /app

FROM base AS final
COPY --from=build /app .
ENTRYPOINT ["dotnet", "YourService.dll"]
```

## 2. Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yourservice
spec:
  replicas: 1
  selector:
    matchLabels:
      app: yourservice
  template:
    metadata:
      labels:
        app: yourservice
    spec:
      containers:
        - name: yourservice
          image: ghcr.io/your-org/yourservice:latest
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: yourservice
spec:
  selector:
    app: yourservice
  ports:
    - port: 80
      targetPort: 80
```

## 3. GitHub Actions Workflow

```yaml
name: ci-cd
on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 9.0.x
      - run: dotnet build
      - run: dotnet test
      - run: docker build -t ghcr.io/your-org/yourservice:${{ github.sha }} .
      - run: echo $CR_PAT | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin
      - run: docker push ghcr.io/your-org/yourservice:${{ github.sha }}
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: azure/setup-kubectl@v4
      - uses: actions/checkout@v4
      - run: kubectl apply -f k8s/deployment.yaml
```

This workflow compiles the code, builds and pushes a Docker image, then applies the Kubernetes manifest.
