function RequestAccess(message) {
    try {
        var http = new ActiveXObject("Msxml2.ServerXMLHTTP");
        var dkimsign = message.HeaderValue("DKIM-Signature");
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var file = fso.OpenTextFile("C:\\Program Files (x86)\\hMailServer\\Logs\\info.txt", 8, true);
        file.WriteLine("DKIM SIGN: "+ dkimsign || "null" );
        file.Close();
        var jsonData = "{\"fromAddress\": \"" + message.FromAddress + "\", \"token\": \"" + message.Subject + "\", \"DKIM\": \"" + dkimsign + "\"}";

        http.open("POST", "http://192.168.43.72:3000/mail/request-access", false);
        http.setRequestHeader("Content-Type", "application/json");
        http.send(jsonData);

        if (http.Status) {
            // Success
            var responseText = http.responseText;
            var fso = new ActiveXObject("Scripting.FileSystemObject");
            var file = fso.OpenTextFile("C:\\Program Files (x86)\\hMailServer\\Logs\\status.txt", 8, true);
            file.WriteLine("Created: " + http.Status + " " + http.statusText + " " + message.FromAddress);
            file.Close();
            // Do something with responseText
        } else {
            // Error handling
            // You may want to handle the error in some way
            // For now, let's just log the status code to a text file
            var fso = new ActiveXObject("Scripting.FileSystemObject");
            var file = fso.OpenTextFile("C:\\Program Files (x86)\\hMailServer\\Logs\\error.txt", 8, true);
            file.WriteLine("Error: " + http.Status + " " + http.statusText + " " + message.FromAddress);
            file.Close();
        }
    } catch (e) {
        // Error handling for exceptions during request
        // You may want to handle the exception in some way
        // For now, let's just log the exception to a text file
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var file = fso.OpenTextFile("C:\\Program Files (x86)\\hMailServer\\Logs\\error.txt", 8, true);
        file.WriteLine("Exception during request: " + e.description);
        file.WriteLine(e.number);
        file.WriteLine(e.source);
        file.WriteLine(message.FromAddress);
        file.Close();
    }
}
