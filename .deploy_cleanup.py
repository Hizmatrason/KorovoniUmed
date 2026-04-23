import paramiko

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('185.121.2.220', username='firdavs', password='Akramov2233', timeout=15)

# Step 1: kill processes
print("=== Killing stale build processes ===")
for k in [
    "pkill -9 -f 'compose build' 2>/dev/null; echo kill1_rc=$?",
    "pkill -9 -f 'KorovoniUmed' 2>/dev/null; echo kill2_rc=$?",
]:
    _, o, e = c.exec_command(k)
    print(o.read().decode().strip())
    err = e.read().decode().strip()
    if err:
        print("ERR:", err)

import time
time.sleep(3)

# Step 2: check state
print("\n=== Current state ===")
for cmd in [
    "ps -eo pid,comm,args | grep -E 'docker.*build|buildkit|npm ci|compose' | grep -v grep",
    "docker ps --format '{{.Names}} {{.Status}}'",
    "docker ps -a | grep -v korovoniumed | grep -v 'CONTAINER ID' || echo 'only our containers'",
]:
    _, o, e = c.exec_command(cmd)
    print(f"$ {cmd}")
    out = o.read().decode().strip()
    print(out or "(empty)")
    err = e.read().decode().strip()
    if err:
        print("ERR:", err)
    print()

c.close()
