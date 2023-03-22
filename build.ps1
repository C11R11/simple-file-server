$CurrentDirectory = Get-Location
$env:FAKE_REST_VOLUME_DIR = "$CurrentDirectory/../data" 
$env:SIMPLE_FILE_SERVE_PORT = 80 
$env:FAKE_REST_CONTAINER_VOLUME = "/data"
$env:SIMPLE_FILE_SERVE_URL = "http://localhost/"
$env:FAKE_REST_URL = "http://localhost:3456/"
$env:FAKE_REST_CONTAINER_PORT = 3456

Invoke-Command {docker compose build}
Invoke-Command {docker compose up}