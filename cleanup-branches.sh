#!/bin/bash

# Atlas AI Scrum Master - Branch Cleanup Script
# This script cleans up merged branches both locally and on GitHub

echo "Cleaning up merged branches..."

# Update main branch
echo "Updating main branch..."
git checkout main
git pull origin main

# Clean up remote references
echo "Cleaning up remote references..."
git remote prune origin

# List merged branches (excluding main and current branch)
echo "Finding merged branches..."
merged_branches=$(git branch --merged main | grep -v "main\|^\*" | xargs -n 1)

if [ -z "$merged_branches" ]; then
    echo "No merged branches found to clean up!"
else
    echo "Deleting merged branches:"
    for branch in $merged_branches; do
        echo "  - Deleting local branch: $branch"
        git branch -d "$branch"
    done
fi

# List remote merged branches
echo "Checking remote merged branches..."
remote_merged=$(git branch -r --merged main | grep -v "main\|HEAD" | sed 's/origin\///')

if [ -z "$remote_merged" ]; then
    echo "No remote merged branches found!"
else
    echo "Found remote merged branches (delete manually on GitHub):"
    for branch in $remote_merged; do
        echo "  - origin/$branch"
    done
    echo ""
    echo "Tip: Enable 'Automatically delete head branches' in GitHub Settings"
    echo "   Settings -> General -> Pull Requests -> Automatically delete head branches"
fi

echo ""
echo "Cleanup complete!"
echo "Current branches:"
git branch -a
