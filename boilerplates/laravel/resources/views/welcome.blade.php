<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
        .card { text-align: center; padding: 3rem 4rem; background: #fff; border-radius: 1rem; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
        h1 { margin: 0 0 .5rem; font-size: 2rem; color: #e3342f; }
        p { margin: 0; color: #64748b; }
    </style>
</head>
<body>
    <div class="card">
        <h1>{{ config('app.name', 'Laravel') }}</h1>
        <p>Welcome to your new Laravel application!</p>
    </div>
</body>
</html>
