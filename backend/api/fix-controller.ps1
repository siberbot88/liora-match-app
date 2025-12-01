# Quick fix - align controller method calls with service methods
$controller = "src\classes\classes.controller.ts"
$content = Get-Content $controller -Raw

# Fix method calls
$content = $content -replace 'this\.classesService\.enrollStudent\(classId, user\.userId\)', 'this.classesService.enroll(user.userId, classId)'
$content = $content -replace 'this\.classesService\.unenrollStudent\(classId, user\.userId\)', 'this.classesService.unenroll(user.userId, classId)'
$content = $content -replace 'this\.classesService\.createClass\(user\.userId, dto\)', 'this.classesService.create(user.userId, dto)'
$content = $content -replace 'this\.classesService\.updateClass\(id, user\.userId, dto\)', 'this.classesService.update(user.userId, id, dto)'
$content = $content -replace 'this\.classesService\.deleteClass\(id, user\.userId\)', 'this.classesService.delete(user.userId, id)'
$content = $content -replace 'this\.classesService\.getClassSessions\(classId\)', 'this.classesService.getSessions(classId)'
$content = $content -replace 'this\.classesService\.getSession\(sessionId\)', 'this.classesService.getSingleSession(sessionId)'

Set-Content $controller -Value $content -NoNewline
Write-Host "✅ Fixed ClassesController method calls" -ForegroundColor Green
