## Phase 1: Set up the Shared File

First, make sure you have a base file on your main branch.
1. Open your terminal and ensure you are on your main branch with the latest code:

```bash
git checkout main
git pull origin main
```
2. Create or open your configuration file (e.g., config.json) and add a line of text
```
{
  "environment": "development"
}
```

3. Commit and push this to your remote repository:bash

```bash
# Add
git add config.json
# Commit
git commit -m "Add base configuration"
# Push
git push origin main
```

## Phase 2: Create the First Change (Branch A)

Now, create a branch that changes the environment to "production".
1. Create and switch to branch-a: 
```
git checkout -b branch-a
```

Then in your favorite text editor, write a config.json file:

```
{
  "environment": "production"
}
```

3. Commit and push branch-a:

```bash
git add config.json
git commit -m "Update environment to production"
git push origin branch-a
```

Phase 3: Create the Conflicting Change (Branch B)

Go back to the main branch and create a second branch that changes that same line to something else (e.g., "staging").
1. Switch back to main:

```bash
git checkout main
```
2. Create and switch to branch-b:

```
git checkout -b branch-b
```

3. Open config.json. It will still say "development" because it doesn't have Branch A's changes. Change it to:

```
{
  "environment": "staging"
}
```

4. Commit and push branch-b:bash
```
git add config.json
git commit -m "Update environment to staging"
git push origin branch-b
```

Phase 4: Trigger the Conflict via PR

Now you will simulate another teammate merging their work first, which causes your PR to conflict.

1. Go to your repository on GitHub/GitLab/Bitbucket.
2. Open a Pull Request to merge branch-a into main.
3. Click Merge Pull Request. (This goes through perfectly fine because there are no conflicts yet).
4. Now, open a second Pull Request to merge branch-b into main.

The Result: Git will look at the line you changed in branch-b ("staging"), see that main now says ("production") thanks to branch-a, and throw a Merge Conflict warning. The merge button will be grayed out.

Phase 5: Resolve the Conflict via the PR UI

Most modern Git platforms allow you to resolve simple conflicts directly in the browser.
1. Click the Resolve conflicts button inside your open branch-b PR.
2. You will see Git's conflict markers in the file editor:
   
```text
<<<<<<< branch-b
  "environment": "staging"
=======
  "environment": "production"
>>>>>>> main
```

3. Edit the file directly in the browser window to look exactly how you want it to look final. Delete the markers (`<<<<<<<`, `=======`, `>>>>>>>`) completely.
4. For example, if you decide "production" is the right choice, make the file look like this:

```json
{
  "environment": "production"
}
```

4. Click Mark as resolved in the top right corner.

5. Click Commit changes (this automatically commits a merge resolution to branch-b).

6. The PR page will refresh, the merge button will turn green, and you can now successfully click **Merge Pull Request**.
