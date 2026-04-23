import paramiko
import os

host = "185.121.2.220"
user = "firdavs"
password = "Akramov2233"
local_tar = r"C:\Users\teafa\AppData\Local\Temp\korovoni_sync.tar.gz"

assert os.path.exists(local_tar), f"Missing: {local_tar}"
print(f"Tarball: {local_tar} ({os.path.getsize(local_tar)} bytes)")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=20)

print("Uploading tarball via SFTP...")
sftp = client.open_sftp()
sftp.put(local_tar, "/tmp/korovoni_sync.tar.gz")
sftp.close()
print("Upload complete.")

cmd = r"""
set -e
cd ~/KorovoniUmed
echo "=== Before extract: git status ==="
git status --short | head -20
echo
echo "=== Extracting tarball (overwrites client/ and src/) ==="
tar xzf /tmp/korovoni_sync.tar.gz
rm -f /tmp/korovoni_sync.tar.gz
echo
echo "=== After extract ==="
ls -la client/src/app/\[locale\]/
echo
echo "=== Check localhost:5248 references gone ==="
grep -rn "localhost:5248" client/src/ || echo "OK: no more localhost:5248 refs"
echo
echo "=== Current .env on server ==="
ls -la .env 2>&1 || echo "no .env yet"
"""
stdin, stdout, stderr = client.exec_command(cmd)
out = stdout.read().decode(errors='replace')
err = stderr.read().decode(errors='replace')
print(out)
if err.strip():
    print("STDERR:", err)

client.close()
