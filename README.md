# auth2fa
Web App that tests axum-totp a2f 

# The steps to test
1> enter Names, email and password -> click Register
2> Click Login   You will see a UUID displayed
3> click Generate    You will see a QR code
4> Add the QR code to an Authenticator   You will see "CRmep: EMAIL" and numbers
5> Enter the numbers in the input below the QR code and click Verify  ( Some times this fails the first time because of time synchronization )
# You are logged in now. see the checkbox

click Validate to check it still works.
click Profile  to get information about user * Not displayed, check the console log or network trace with a browser debugger.
click Deisable to remove the used from the server
click Logout to just end session.

# You will have to edit the IP address of the server for your configuration.

To run: 
git clone https://github.com/greenpdx/auth2f.git
cd auth2f
npm install
npm run dev
access URL from browser
