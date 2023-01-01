.DEFAULT_GOAL := help
ENV ?= dev

setup-env: ## Update environment files
	@./tasks.sh setup-env $(username)

setup: ## Initial setup of the development environment.
	@./tasks.sh setup $(username)


POLY_CORE_RUN=docker-compose run --rm --no-deps poly-core

_poly-core-start-db:
	@docker-compose up -d db

poly-core-pnpm-install: ## Install npm packages.
	@$(POLY_CORE_RUN) pnpm install

poly-core-package-lock: ## Generate the poly-core pnpm-lock-yaml
	@$(POLY_CORE_RUN) pnpm install --lockfile-only

start_prod:
	@$(POLY_CORE_RUN) pnpm start:prod

SENTINEL_SERVER_CI_RUN=docker-compose -f docker-compose.ci.yml build sentinel-server-ci && docker-compose -f docker-compose.ci.yml run --rm --no-deps sentinel-server-ci

.PHONY: help deploy

deploy:
	helm upgrade $(SERVICE) ./charts/$(SERVICE)/ -i -f ./charts/$(SERVICE)/values-$(SERVICE)-$(ENV).yaml --set deployment.tag=$(BUILDKITE_COMMIT) --atomic
help:
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
