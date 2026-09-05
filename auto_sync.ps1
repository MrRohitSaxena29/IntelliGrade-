# =====================================================================
# IntelliGrade - Automatic GitHub Sync Watcher
# Automatically commits and pushes whenever files/folders are modified
# =====================================================================

$RepoPath = $PSScriptRoot
Set-Location $RepoPath

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  IntelliGrade Auto-Sync to GitHub" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Monitoring folder: $RepoPath" -ForegroundColor Gray

# Ensure remote is configured
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    if (Test-Path "$RepoPath\token.txt") {
        $token = (Get-Content "$RepoPath\token.txt").Trim()
        $authUrl = "https://$($token)@github.com/MrRohitSaxena29/IntelliGrade.git"
        git remote add origin $authUrl
        Write-Host "[+] Configured git remote origin with GitHub token." -ForegroundColor Green
    } else {
        git remote add origin "https://github.com/MrRohitSaxena29/IntelliGrade.git"
        Write-Host "[+] Configured git remote origin." -ForegroundColor Green
    }
}

# Ensure main branch is set
git branch -M main

# Function to perform sync
function Sync-ToGitHub {
    param([string]$Reason = "Changes detected")

    $status = git status --porcelain
    if (-not [string]::IsNullOrWhiteSpace($status)) {
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "`n[$timestamp] $Reason. Syncing to GitHub..." -ForegroundColor Yellow
        
        # Debounce: brief pause in case files are still being saved
        Start-Sleep -Seconds 2

        git add -A
        $commitMsg = "Auto-sync: $timestamp - updated files"
        git commit -m $commitMsg

        Write-Host "[$timestamp] Pushing to GitHub (main)..." -ForegroundColor Cyan
        $pushOutput = git push -u origin main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] Successfully synced to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "[$timestamp] Push encountered an issue: $pushOutput" -ForegroundColor Red
            Write-Host "Attempting pull with rebase then push..." -ForegroundColor Yellow
            git pull --rebase origin main
            git push -u origin main
        }
    }
}

# Initial check & sync on launch
Sync-ToGitHub "Initial check on startup"

Write-Host "`n[✓] Watcher is actively running in real-time." -ForegroundColor Green
Write-Host "Any file/folder created, edited, or deleted will be uploaded automatically." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop syncing.`n" -ForegroundColor DarkGray

# Real-time monitoring loop (checks every 4 seconds)
while ($true) {
    Start-Sleep -Seconds 4
    $status = git status --porcelain
    if (-not [string]::IsNullOrWhiteSpace($status)) {
        Sync-ToGitHub "Change detected"
    }
}
