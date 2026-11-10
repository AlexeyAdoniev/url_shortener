
### Run locally with Kubernetes

The manifests in `k8s/` start PostgreSQL, Redis, and **two** API replicas. The `url-shortener` ClusterIP Service selects both API pods, and the NGINX Ingress forwards `url-shortener.local` traffic to that Service using its normal round-robin upstream balancing.

Build the local image, make it available to your cluster, then apply the manifests:

```bash
docker build -t url-shortener:local .
minikube image load url-shortener:local

# For kind only (replace kind with your cluster name when needed):
kind load docker-image url-shortener:local --name kind

# Ensure an NGINX Ingress controller is installed first. For minikube:
minikube addons enable ingress

kubectl apply -R -f k8s
kubectl rollout status deployment/postgres
kubectl rollout status deployment/redis
kubectl rollout status deployment/url-shortener-app
kubectl -n ingress-nginx port-forward service/ingress-nginx-controller 8080:80
```

Point `url-shortener.local` at your local Ingress IP (for example, add `127.0.0.1 url-shortener.local` to `/etc/hosts` when the controller listens on localhost), then use `http://url-shortener.local`. The PostgreSQL data has a 1Gi local PVC; Redis is intentionally ephemeral for development. `k8s/secrets.local.yaml` contains development-only credentials and must be replaced before any non-local deployment.


