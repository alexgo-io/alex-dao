#!/usr/bin/env bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"
TMP_GIT_DIR="$ROOT/.git_tmp_repos"
CONTRACTS_MODULE_PATH="contracts_modules"

pre_check() {
 echo "Installing from Clarinet.json..."
 # check if file not exists
 if [ ! -f "$DIR/../Clarinet.json" ]; then
  echo "Clarity.json not found. abort..."
  exit 1
 fi

 # check if command jq is installed, if not, install jq
 if ! [ -x "$(command -v jq)" ]; then
  echo "jq not installed. Install it before continue. (brew install jq)..."
  exit 1
 fi
}

install_project() {
  project_name=${1//\"/}
  echo "Installing project...$project_name"
  commit=$(cat Clarinet.json | jq -cr ".dependencies.$project_name.commit")
  git_repo=$(cat Clarinet.json | jq -cr ".dependencies.$project_name.git")
  contracts_path_string=$(cat Clarinet.json | jq -c ".dependencies.$project_name.contracts_paths" | sed -e 's/\[//g' -e 's/\]//g' -e 's/\,/ /g')
  contracts_paths=($contracts_path_string)

  echo "Installing from $git_repo, commit $commit, to $project_name"
  mkdir -p "$TMP_GIT_DIR"/"$project_name"

  # clone project
  echo git clone "$git_repo" "$TMP_GIT_DIR"/"$project_name"
  git clone "$git_repo" "$TMP_GIT_DIR"/"$project_name"
  pushd "$TMP_GIT_DIR"/"$project_name" > /dev/null
  echo git checkout "$commit"
  git checkout "$commit"
  popd > /dev/null

  # copy contracts
  mkdir -p "$ROOT/$CONTRACTS_MODULE_PATH"
  rm -rf "$ROOT/$CONTRACTS_MODULE_PATH/${project_name:?}"

  for c in "${contracts_paths[@]}"; do
    mkdir -p "$ROOT/$CONTRACTS_MODULE_PATH/${project_name}/${c//\"/}"
    cp -r "$TMP_GIT_DIR"/"$project_name"/${c//\"/} "$ROOT"/"$CONTRACTS_MODULE_PATH"/$project_name/${c//\"/}
  done

  echo "cleaning..."
  rm -rf "$TMP_GIT_DIR"
  echo "installed $project_name"
}

install() {
  pre_check
  pushd "$DIR"/.. > /dev/null

  projects_str=$(cat Clarinet.json | jq -c ".dependencies | keys" | sed -e 's/\[//g' -e 's/\]//g' -e 's/\,/ /g')
  projects=($projects_str)

  for i in "${projects[@]}"; do
    install_project $i
  done

  echo installed all projects: $projects
}

clean() {
  rm -rf "$TMP_GIT_DIR"
  rm -rf "$ROOT/${CONTRACTS_MODULE_PATH:?}"
  echo "cleaned"
}

main() {
#   check if command is valid
  if [ "$1" == "install" ]; then
    install
  elif [ "$1" == "clean" ]; then
    clean
  else
    echo "Invalid command. Use 'install' or 'clean'"
  fi
}

main $@