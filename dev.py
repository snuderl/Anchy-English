#!/usr/bin/env python3
"""
Single-command development server: runs Flask + Vite together.

    uv run python dev.py

Opens http://localhost:5173 (Vite) which proxies /api → Flask on :3000.
Flask auto-reloads on Python file changes (FLASK_DEBUG=1).
Vite hot-reloads Vue/CSS/JS changes instantly.
"""

import os
import signal
import subprocess
import sys


def run_servers():
    flask_port = os.environ.get("FLASK_PORT", "3000")

    env = os.environ.copy()
    env["FLASK_DEBUG"] = "1"
    env["PORT"] = flask_port

    processes = []

    try:
        # Start Flask API (port 3000 — matches Vite proxy in vite.config.js)
        flask_process = subprocess.Popen(
            ["uv", "run", "python", "-m", "app.server"],
            env=env,
        )
        processes.append(flask_process)

        # Start Vite dev server (port 5173)
        vite_process = subprocess.Popen(
            ["pnpm", "run", "dev"],
            cwd="anchy-english-vue",
            env=env,
        )
        processes.append(vite_process)

        print()
        print("  ✅ Dev servers starting...")
        print("  🌐 App:  http://localhost:5173")
        print(f"  🐍 API:  http://localhost:{flask_port}/api/")
        print("  Press Ctrl+C to stop")
        print()

        # Wait for either process to exit
        while True:
            for p in processes:
                ret = p.poll()
                if ret is not None:
                    raise SystemExit(f"Process {p.args} exited with code {ret}")
            try:
                signal.pause()
            except AttributeError:
                # Windows fallback
                import time

                time.sleep(1)

    except (KeyboardInterrupt, SystemExit):
        print("\n  Shutting down...")
        for p in processes:
            p.terminate()
        for p in processes:
            try:
                p.wait(timeout=5)
            except subprocess.TimeoutExpired:
                p.kill()
        sys.exit(0)


if __name__ == "__main__":
    run_servers()
