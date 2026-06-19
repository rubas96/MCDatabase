# ============================================================
#  Sube la app de Marvel Champions a rubas.aypapol.com
#  Uso: clic derecho -> "Ejecutar con PowerShell"  (o abre PowerShell y corre: .\subir-a-rubas.ps1)
#  Te pedira la contrasena del panel al ejecutar (no se guarda en el archivo).
# ============================================================

# --- Ajusta si hace falta ---
$FB_USER = 'rubas'                                                            # usuario del panel
$LOCAL   = 'D:\Documentos\Claude\Marvel Champions\Marvel Champions Collection.html'  # el archivo de la app
$PROJ    = 'marvel-champions'                                                 # nombre del proyecto (minusculas, sin espacios)
$VIS     = 'oculto'                                                           # 'publico' (se lista en la home) u 'oculto' (solo por link)
# ----------------------------

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$base = 'https://rubas.aypapol.com/admin/api'

if (-not (Test-Path $LOCAL)) { Write-Error "No encuentro el archivo: $LOCAL"; return }

$pwPlain = Read-Host 'Contrasena del panel de rubas'   # se pide al ejecutar; no queda guardada
$u = [uri]::EscapeDataString($FB_USER)
$p = [uri]::EscapeDataString($pwPlain)                 # la API espera la contrasena url-encoded en el header

try {
  # 1) Login -> token (usuario en la URL, contrasena en el header X-Password)
  $token = Invoke-RestMethod -Method Post -Uri "$base/auth/login?username=$u&recaptcha=" -Headers @{ 'X-Password' = $p }
} catch { Write-Error "Login fallo: $($_.Exception.Message)"; return }
if ("$token" -notmatch '\.') { Write-Error 'Login fallo: revisa usuario/contrasena.'; return }
Write-Host 'Login OK' -ForegroundColor Green

# 2) Crear la carpeta del proyecto (idempotente)
try { Invoke-RestMethod -Method Post -Uri "$base/resources?path=/$VIS/$PROJ/&source=srv&isDir=true&auth=$token" | Out-Null } catch {}

# 3) Subir la app como index.html (se renombra en el servidor, no hace falta tocar el archivo local)
$bytes = [System.IO.File]::ReadAllBytes($LOCAL)
try {
  Invoke-RestMethod -Method Post -Uri "$base/resources?path=/$VIS/$PROJ/index.html&source=srv&override=true&auth=$token" -Body $bytes -ContentType 'text/html' | Out-Null
} catch { Write-Error "Subida fallo: $($_.Exception.Message)"; return }

Write-Host ''
Write-Host "LISTO  ->  https://rubas.aypapol.com/$PROJ/   ($VIS)" -ForegroundColor Green
