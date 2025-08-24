#!/usr/bin/env python3
"""
Development server that runs both Flask and Vite
"""
import subprocess
import sys
import os
import time
import signal
from pathlib import Path

def run_servers():
    """Run Flask and Vite dev servers concurrently"""
    
    # Set environment for development
    env = os.environ.copy()
    env['FLASK_ENV'] = 'development'
    env['FLASK_DEBUG'] = '1'
    env['PORT'] = '5001'  # Flask on 5001 to avoid AirPlay conflict
    
    processes = []
    
    try:
        # Start Vite dev server
        print("Starting Vite dev server on http://localhost:5173...")
        vite_process = subprocess.Popen(
            ['npm', 'run', 'dev'],
            cwd='anchy-english-vue',
            env=env
        )
        processes.append(vite_process)
        
        # Give Vite a moment to start
        time.sleep(2)
        
        # Start Flask server
        print("Starting Flask server on http://localhost:5001...")
        flask_process = subprocess.Popen(
            ['uv', 'run', 'python', 'server.py'],
            env=env
        )
        processes.append(flask_process)
        
        print("\n✅ Both servers are running!")
        print("📦 Vite (Vue): http://localhost:5173")
        print("🐍 Flask API: http://localhost:5001")
        print("🔗 Flask+Vue: http://localhost:5001/vue")
        print("\nPress Ctrl+C to stop both servers...\n")
        
        # Wait for interrupt
        for process in processes:
            process.wait()
            
    except KeyboardInterrupt:
        print("\n\nShutting down servers...")
        for process in processes:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
        print("Servers stopped.")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        for process in processes:
            process.terminate()
        sys.exit(1)

if __name__ == "__main__":
    run_servers()