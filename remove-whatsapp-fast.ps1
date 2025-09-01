$ErrorActionPreference = "SilentlyContinue"

# Backup rápido de src (una sola vez)
if(-not (Test-Path ".\src_backup_latest")) {
  Copy-Item -Recurse -Force .\src .\src_backup_latest
}

# Patrón a eliminar (en líneas completas)
$pat = "wa\.me|api\.whatsapp\.com|getbutton|WhatsAppButton|WhatsappButton|widget-send-button|fa-whatsapp|whatsapp"

# Limpiar SOLO archivos del código (sin node_modules)
$files = Get-ChildItem -Path .\src -Recurse -Include *.jsx,*.tsx,*.js,*.ts,*.html,*.css -File

$changed = 0
for($i=0; $i -lt $files.Count; $i++){
  $f = $files[$i]
  if (Select-String -Path $f.FullName -Pattern $pat -Quiet) {
    $c = Get-Content -LiteralPath $f.FullName
    $n = $c | Where-Object { $_ -notmatch $pat }
    if($n.Count -ne $c.Count){
      [IO.File]::WriteAllText($f.FullName, ($n -join [Environment]::NewLine))
      Write-Host "LIMPIO: $($f.FullName)"
      $changed++
    }
  }
}

# index.html en la raíz del frontend
if (Test-Path .\index.html) {
  if (Select-String -Path .\index.html -Pattern $pat -Quiet) {
    $c = Get-Content .\index.html
    $n = $c | Where-Object { $_ -notmatch $pat }
    Set-Content -Path .\index.html -Value ($n -join [Environment]::NewLine)
    Write-Host "LIMPIO: .\index.html"
    $changed++
  }
}

# Borrar componentes/archivos típicos
Remove-Item -Force -ErrorAction SilentlyContinue .\src\components\WhatsAppButton.jsx, .\src\components\WhatsappButton.jsx
Get-ChildItem -Path .\src -Recurse -Include *whatsapp*,*getbutton* -File | Remove-Item -Force

if ($changed -eq 0) { Write-Host "OK: sin restos de WhatsApp" } else { Write-Host "Hecho: $changed archivo(s) limpiado(s)." }
