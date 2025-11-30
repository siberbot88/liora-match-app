# Generate NestJS Modules

Write-Host "Generating NestJS modules..." -ForegroundColor Cyan

# Auth
npx nest g module auth --no-spec
npx nest g service auth --no-spec  
npx nest g controller auth --no-spec

# Users
npx nest g module users --no-spec
npx nest g service users --no-spec
npx nest g controller users --no-spec

# Teachers
npx nest g module teachers --no-spec
npx nest g service teachers --no-spec
npx nest g controller teachers --no-spec

# Students
npx nest g module students --no-spec
npx nest g service students --no-spec
npx nest g controller students --no-spec

# Classes
npx nest g module classes --no-spec
npx nest g service classes --no-spec
npx nest g controller classes --no-spec

# Bookings
npx nest g module bookings --no-spec
npx nest g service bookings --no-spec
npx nest g controller bookings --no-spec

# Messages (with websocket gateway)
npx nest g module messages --no-spec
npx nest g service messages --no-spec
npx nest g gateway messages --no-spec

Write-Host "Done!" -ForegroundColor Green
