$ErrorActionPreference = "SilentlyContinue"

# Backup de src/
$ts = Get-Date -Format "yyyyMMdd_HHmmss"
Copy-Item -Recurse -Force .\src ".\src_backup_$ts"

# Patrón a eliminar
$pat = 'wa\.me|api\.whatsapp\.com|getbutton|WhatsAppButton|WhatsappButton|widget-send-button|whatsapp|fa-whatsapp'

# Limpiar ficheros de código y html/css
$files = Get-ChildItem -Path . -Recurse -Include *.js,*.jsx,*.ts,*.tsx,*.html,*.css -File
foreach($f in $files){
  $c = Get-Content -LiteralPath $f.FullName
  if($null -ne $c){
    $n = $c | Where-Object { $_ -notmatch $pat }
    if($n.Count -ne $c.Count){
      [IO.File]::WriteAllText($f.FullName, ($n -join [Environment]::NewLine))
    }
  }
}

# Borrar componentes y assets típicos
Remove-Item -Force -ErrorAction SilentlyContinue .\src\components\WhatsAppButton.jsx, .\src\components\WhatsappButton.jsx
Get-ChildItem -Path . -Recurse -Include *whatsapp*,*getbutton* -File | Remove-Item -Force

# Verificación
$hits = Get-ChildItem -Path . -Recurse -Include *.js,*.jsx,*.ts,*.tsx,*.html,*.css -File |
  Select-String -Pattern 'wa\.me','api\.whatsapp\.com','getbutton','whatsapp','fa-whatsapp'
if($hits){ $hits | Format-Table -AutoSize } else { "OK: sin restos de WhatsApp" }
