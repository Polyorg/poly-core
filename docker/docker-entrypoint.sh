#!/usr/bin/env bash

set -eu

# In dev only, use fixuid to fix ownership of files created in the container.
if [[ "${BUILD_STAGE:-}" = "dev" ]]; then
  set -- fixuid -q "$@"
fi

# Use tini as process manager.
set -- tini -- "$@"

exec "$@"
