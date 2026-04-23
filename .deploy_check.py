import paramiko

host = "185.121.2.220"
user = "firdavs"
password = "Akramov2233"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=15)

cmds = [
    "cat ~/KorovoniUmed/docker-compose.yml",
    "echo '========== DOCKERFILE.CLIENT =========='",
    "cat ~/KorovoniUmed/Dockerfile.client",
    "echo '========== DOCKERFILE.API =========='",
    "cat ~/KorovoniUmed/Dockerfile.api",
    "echo '========== NGINX =========='",
    "ls ~/KorovoniUmed/nginx/",
    "echo '========== nginx active.conf =========='",
    "cat ~/KorovoniUmed/nginx/active.conf 2>/dev/null || echo missing",
    "echo '========== nginx default.conf =========='",
    "cat ~/KorovoniUmed/nginx/default.conf 2>/dev/null || echo missing",
    "echo '========== host nginx config =========='",
    "sudo -n ls /etc/nginx/sites-enabled/ 2>&1 || ls /etc/nginx/sites-enabled/ 2>&1",
    "echo '========== host nginx for caravanofhope =========='",
    "sudo -n cat /etc/nginx/sites-enabled/caravanofhope.tj 2>&1 | head -80 || cat /etc/nginx/sites-enabled/caravanofhope.tj 2>&1 | head -80",
    "echo '========== client .env files on server =========='",
    "ls -la ~/KorovoniUmed/client/.env* 2>&1",
    "echo '========== client next.config =========='",
    "cat ~/KorovoniUmed/client/next.config.ts 2>/dev/null | head -40",
]

for c in cmds:
    stdin, stdout, stderr = client.exec_command(c)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    print(f"### $ {c}")
    if out.strip():
        print(out.rstrip())
    if err.strip():
        print("STDERR:", err.rstrip())
    print()

client.close()
