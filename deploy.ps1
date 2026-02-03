# Deploy Backend and Frontend to Vercel

$VERCEL_TOKEN = "sGrvFDl6E1pKGhyaK9r1rG08"

# Set environment variable
$env:VERCEL_TOKEN = $VERCEL_TOKEN

# Deploy backend
Write-Host "🚀 Deploying Backend..."
cd 'C:\Users\Saurav\OneDrive\Desktop\Movies_Space\backend'

# Create .vercel directory if not exists
if (-not (Test-Path .vercel)) {
    New-Item -ItemType Directory -Path .vercel -Force
}

# Create vercel metadata file
$vercelConfig = @{
    "projectId" = "prj_saurav"
    "orgId" = "team_saurav"
} | ConvertTo-Json

# Try deployment
Write-Host "Deploying with Vercel CLI..."
& vercel deploy --prod --yes --token=$VERCEL_TOKEN

Write-Host ""
Write-Host "✅ Backend deployment initiated"
Write-Host "Check: https://vercel.com/dashboard"
