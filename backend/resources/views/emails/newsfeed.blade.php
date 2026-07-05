<!DOCTYPE html>
<html>
<head>
    <title>Beyond The Grind - Weekly Newsfeed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-family: 'Playfair Display', serif; color: #000;">Beyond The Grind</h1>
        <p style="color: #666; font-style: italic;">Documenting the journey, one cup at a time.</p>
    </div>

    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="margin-top: 0;">This Week's Featured Spots</h2>
        <p>Here are some of the best cafes and places we've highlighted recently:</p>

        @foreach($cafes as $cafe)
            <div style="margin-bottom: 20px; border-bottom: 1px solid #eaeaea; padding-bottom: 20px;">
                <h3 style="margin-bottom: 5px;">{{ $cafe->title }}</h3>
                <p style="font-size: 0.9em; color: #888; margin-top: 0;">{{ $cafe->location }}</p>
                <p>{{ Str::limit($cafe->review, 100) }}</p>
                <a href="{{ url(env('FRONTEND_URL', 'http://localhost:4200') . '/article/' . $cafe->id) }}" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 4px; font-weight: bold; font-size: 0.8em; text-transform: uppercase;">Read More</a>
            </div>
        @endforeach
    </div>

    <div style="text-align: center; margin-top: 30px; font-size: 0.8em; color: #999;">
        <p>You are receiving this because you subscribed to the Beyond The Grind newsfeed.</p>
        <p>&copy; {{ date('Y') }} Beyond The Grind. All rights reserved.</p>
    </div>

</body>
</html>
