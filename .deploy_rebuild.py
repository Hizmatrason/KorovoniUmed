import paramiko

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('185.121.2.220', username='firdavs', password='Akramov2233', timeout=20)

# Single clean rebuild. Package-lock already regenerated in a prior run.
cmd = r"""
set -e
cd ~/KorovoniUmed
echo "=== PKG-LOCK SIZE ==="
wc -l client/package-lock.json
echo
echo "=== docker compose build client (--no-cache) ==="
docker compose build --no-cache client 2>&1 | tail -30
echo
echo "=== docker compose build api ==="
docker compose build api 2>&1 | tail -15
echo
echo "=== up -d --no-deps client api ==="
docker compose up -d --no-deps client api
sleep 10
echo
echo "=== docker ps ==="
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
echo
echo "=== client logs (last 30) ==="
docker logs --tail 30 korovoniumed-client-1 2>&1
echo
echo "=== api logs (last 15) ==="
docker logs --tail 15 korovoniumed-api-1 2>&1
echo
echo "=== curl check against localhost:3000 ==="
curl -s -o /dev/null -w "client HTTP %{http_code}\n" http://localhost:3000/ru || true
curl -s -o /dev/null -w "api   HTTP %{http_code}\n" http://localhost:5000/api/content || true
"""
_, out, err = c.exec_command(cmd, timeout=900)
# Wait for completion and capture all
output = out.read().decode(errors='replace')
error = err.read().decode(errors='replace')
print(output)
if error.strip():
    print("===STDERR===")
    print(error)
c.close()
