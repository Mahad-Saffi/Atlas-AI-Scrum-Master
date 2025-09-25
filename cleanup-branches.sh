#!/bin/bash

# Atlas AI Scrum Master - Branch Cleanup Script
# This script cleans up merged branches both locally and on GitHub

echo "Ì∑π Cleaning up merged branches..."

# Update main branch
echo "Ì≥• Updating main branch..."
git checkout main
git pull origin main

# Clean up remote references
echo "Ì¥Ñ Cleaning up remote references..."
git remote prune origin

# List merged branches (excluding main and current branch)
echo "Ì≥ã Finding merged branches..."
merged_branches=$(git branch --merged main | grep -v "main\|^\*" | xargs -n 1)

if [ -z "$merged_branches" ]; then
    echo "‚ú® No merged branches found to clean up!"
else
    echo "Ì∑ëÔ∏è  Deleting merged branches:"
    for branch in $merged_branches; do
        echo "  - Deleting local branch: $branch"
        git branch -d "$branch"
    done
fi

# List remote merged branches
echo "Ìºê Checking remote merged branches..."
remote_merged=$(git branch -r --merged main | grep -v "main\|HEAD" | sed 's/origin\///')

if [ -z "$remote_merged" ]; then
    echo "‚ú® No remote merged branches found!"
else
    echo "‚ÑπÔ∏è  Found remote merged branches (delete manually on GitHub):"
    for branch in $remote_merged; do
        echo "  - origin/$branch"
    done
    echo ""
    echo "Ì≤° Tip: Enable 'Automatically delete head branches' in GitHub Settings"
    echo "   Settings ‚Üí General ‚Üí Pull Requests ‚Üí ‚úÖ Automatically delete head branches"
fi

echo ""
echo "‚úÖ Cleanup complete!"
echo "Ì≥ä Current branches:"
git branch -a
