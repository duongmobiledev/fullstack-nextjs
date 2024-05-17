Run Project
- yarn production
- yarn dev => check http://localhost:2999  on your browser
- on request login func …..In your email before use magic link you need change port’s magic link from 3000 to 2999
  * Example: http://localhost:3000/login/authorize?jwt=<jsonwebtoken>  => http://localhost:2999/login/authorize?jwt=<jsonwebtoken>