<!-- conductor-bridge: model=gemini-3-pro-preview extensions=conductor -->

# Plan

## Goal Summary
Finalize the "Conductor Bridge MVP" by defining missing dependencies, verifying the MCP server and cycle runner, and ensuring the system successfully orchestrates the planning-implementation-review loop using the simulated backend.

## Step-by-Step Implementation Steps

### 1. Dependency Management
- **Analyze Imports**: Confirm all external packages required by `conductor_bridge` (e.g., `requests` if used, though currently it seems stdlib-only).
- **Update Configuration**: Add necessary runtime dependencies to `pyproject.toml` if any are identified during verification.
- **Environment**: Ensure the virtual environment (`.venv`) is correctly set up and active.

### 2. Server Verification (`server.py`)
- **Health Check**: Start the MCP server in HTTP mode and verify the `/health` and `/mcp` endpoints.
- **Tool Listing**: Verify that `tools/list` returns the expected capability set (ping, get_state, run_cycle, etc.).
- **State Persistence**: Test `get_state` and `set_state` to ensure `state/state.json` is correctly read and written (even if ignored by git).

### 3. Runner Verification (`runner.py`)
- **Simulation Run**: Execute a full cycle using the `simulate` implementer:
  ```bash
  python -m conductor_bridge.runner --implementer simulate --cycles 1
  ```
- **Artifact Generation**: Confirm that `plan.md`, `handoff.md`, and `review.md` are generated in `state/artifacts/` with expected content.
- **Event Logging**: Verify `state/events.jsonl` records the phase transitions.

### 4. Integration & Polish
- **CLI Wrapper Check**: Validate `gemini_client.py` and `implementer.py` detection logic (ensure they gracefully handle missing tools).
- **Scripts**: Review `scripts/` folder (e.g., `test-mcp.ps1`) to ensure they match the current codebase.
- **Documentation**: Update `README.md` if any usage instructions differ from verification results.

## Expected Deliverables
- Verified `pyproject.toml` (if updates needed).
- Functional `conductor-bridge` server and runner.
- Successful execution log of a simulated cycle.
- Populated `state/` directory verifying persistence.

## Potential Issues
- **Port Conflicts**: Port 8765 might be in use.
- **File Permissions**: Writing to `state/` might fail if permissions are restricted.
- **Missing CLI Tools**: `gemini`, `codex`, or `claude` CLIs might be missing, forcing fallback to simulation (which is acceptable for this plan).
