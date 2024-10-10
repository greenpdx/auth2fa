# auth2fa
Web App that tests axum-totp a2f 

# The steps to test
1> enter Names, email and password -> click Register<br>
2> Click Login   You will see a UUID displayed<br>
3> click Generate    You will see a QR code<br>
4> Add the QR code to an Authenticator   You will see "CRmep: EMAIL" and numbers<br>
5> Enter the numbers in the input below the QR code and click Verify  ( Some times this fails the first time because of time synchronization )<br>
# You are logged in now. see the checkbox
<br>
click Validate to check it still works.<br>
click Profile  to get information about user * Not displayed, check the console log or network trace with a browser debugger.<br>
click Deisable to remove the used from the server<br>
click Logout to just end session.<br>

# You will have to edit the IP address of the server for your configuration.

To run:<br>
git clone https://github.com/greenpdx/auth2f.git<br>
cd auth2f<br>
npm install<br>
npm run dev<br>
access URL from browser<br>
