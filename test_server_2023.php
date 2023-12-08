<?php
// Set the content type to JSON
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Preflight OPTIONS Request: When a browser makes a cross-origin request with certain methods (like POST with a Content-Type other than application/x-www-form-urlencoded, multipart/form-data, or text/plain), it sends a preflight OPTIONS request to check the server's CORS headers. Make sure your server responds appropriately to OPTIONS requests.
// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, OPTIONS"); // Add other allowed methods 
    header("Access-Control-Allow-Headers: Content-Type");  // It worked via this header 
    exit; // Terminate the script after handling OPTIONS
}

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get the current time including milliseconds
    list($microseconds, $seconds) = explode(' ', microtime());
    $milliseconds = round($microseconds * 1000);
    $currentTime = date('Y-m-d H:i:s') . '.' . sprintf('%03d', $milliseconds);

    // Create an associative array with the current time
    $response = array('currentTime' => $currentTime);

    // Convert the array to JSON format
    $jsonResponse = json_encode($response);

    // Send the JSON response
    echo $jsonResponse;
} else {
    // If the request method is not GET, return an error
    http_response_code(405); // Method Not Allowed
    echo json_encode(array('error' => 'Method Not Allowed'));
}
?>
