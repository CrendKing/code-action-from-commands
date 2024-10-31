# 0.1.3

* Instead of executing commands in-place, switch to return commands from code action, which is more idiomatic.
* Update code action whenever code action definitions from configuration change.

# 0.1.2

Make sure not triggering the commands when user explicitly invokes code actions.

# 0.1.1

Fix issue that only one Code Action provider is called, even though multiple are registered.

Make sure the created Code Actions only operate on actual files.

# 0.1.0

Initial release.
