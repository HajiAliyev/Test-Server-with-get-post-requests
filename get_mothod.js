let timerId;
let totalResponseTime = 0;
let isTestRunning = false;

function showInput(dataType) {
    document.getElementById('textDataInput').style.display = dataType === 'text' ? 'block' : 'none';
    document.getElementById('imageDataInput').style.display = dataType === 'image' ? 'block' : 'none';
    document.getElementById('videoDataInput').style.display = dataType === 'video' ? 'block' : 'none';
}

function sendRequest() {
    const apiUrl = document.getElementById('apiUrl').value;
    const method = document.getElementById('httpMethod').value;
    const timeSent = new Date().toLocaleTimeString();
    const dataTypeInput = document.querySelector('input[name="dataType"]:checked');

    if (!dataTypeInput) {
        console.error('Please select a data type.');
        return;
    }

    const dataType = dataTypeInput.value;

    // Only handle GET requests in this example //Haji added this code: 
    // if (method !== 'GET') {
    //     console.error('Only GET requests are supported in this example.');
    //     alert('Only GET requests are supported in this example.');
    //     return;
    // }

    let requestData;
    switch (dataType) {
        case 'text':
            requestData = document.getElementById('textData').value;
            break;
        case 'image':
            requestData = document.getElementById('imageData').files[0];
            break;
        case 'video':
            requestData = document.getElementById('videoData').files[0];
            break;
        case 'none':
            requestData = '';
            break;
        default:
            break;
    }

    const headers = {
        'Content-Type': 'application/json', // Default content type must be used ! PHP HEADER = 'application/json' must be there!
        // Add any additional headers if required
        //  "Access-Control-Allow-Origin": "*", //No need this header
        // For GET method, only text can be sent in the header
        ...(method === 'GET' && dataType === 'text' ? { 'Your-Text-Header': requestData } : {}), //Haji comment eledi.
        // ...(method === 'GET' || dataType === 'text' ? { 'Your-Text-Header': requestData } : {}), //Haji &&->||"" eledi.
    };

    const startTime = new Date().getTime();

    fetch(apiUrl, {
        //mode: 'no-cors', //Haji added code. correct.
        //  mode: 'cors', //Haji added code. discorrect
        method: method,
        headers: headers,
        body: method === 'POST' ? createRequestBody(dataType, requestData) : undefined,
    })
        .then(response => response.json())
        .then(data => {
            const currentTime = new Date().getTime();
            const responseTime = currentTime - startTime;
            totalResponseTime += responseTime;
            displayTotalResponseTime(totalResponseTime);
            displayApiResponse(data);
            addToResultsTable(apiUrl, method, dataType, getRequestDataForTable(dataType, requestData), timeSent, responseTime, data.currentTime);//data -> data.time
            // addToResultsTable(apiUrl, method, dataType, getRequestDataForTable(dataType, ''), timeSent, responseTime, data);//Original for all json
        })
        .catch(error => {
            console.error('Error:', error);
            displayTotalResponseTime('Error');
            displayApiResponse('Error');
            addToResultsTable(apiUrl, method, dataType, getRequestDataForTable(dataType, requestData), timeSent, 'Error', 'Error');
            // addToResultsTable(apiUrl, method, dataType, getRequestDataForTable(dataType, ''), timeSent, 'Error', 'Error'); //Haji
        });
}

function resetTable() {
    // Get the table body element
    const resultsTableBody = document.getElementById('resultsTableBody');
    // Clear the table content
    resultsTableBody.innerHTML = '';
}

let repeatInterval = 1; // Default value

function startTest() {
    if (isTestRunning) {
        console.log('Test is already running.');
        alert('Test is already running.');
        return;
    }

    totalResponseTime = 0;
    repeatInterval = parseInt(document.getElementById('repeatInterval').value, 10) || 1;
    timerId = setInterval(sendRequest, repeatInterval);

    // Disable the "Start Test" button
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.disabled = true;
    }

    // Set the flag to indicate that the test is running
    isTestRunning = true;
}

function stopTest() {
    clearInterval(timerId);

    // Enable the "Start Test" button
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.disabled = false;
    }

    // Reset the flag
    isTestRunning = false;
}


function getRequestDataForTable(dataType, requestData) {
    switch (dataType) {
        case 'text':
            return requestData;
        case 'image':
            return 'Image Data'; // Modify as needed
        case 'video':
            return 'Video Data'; // Modify as needed
        case 'none':
            return 'None';
        default:
            return '';
    }
}

function createRequestBody(dataType, requestData) {
    if (dataType === 'text') {
        return requestData;
    } else if (dataType === 'image' || dataType === 'video') {
        const formData = new FormData();
        formData.append(dataType, requestData);
        return formData;
    } else {
        return '';
    }
}

function displayTotalResponseTime(responseTime) {
    const totalResponseTimeElement = document.getElementById('totalResponseTime');
    totalResponseTimeElement.textContent = `Total Response Time: ${responseTime} ms`;
}

function displayApiResponse(response) {
    const responseTextArea = document.getElementById('responseTextArea');
    responseTextArea.value = response ? JSON.stringify(response, null, 2) : 'Empty';
}

function addToResultsTable(url, method, dataType, requestData, timeSent, responseTime, responseData) {
    const resultsTableBody = document.getElementById('resultsTableBody');
    const newRow = resultsTableBody.insertRow();

    const cellUrl = newRow.insertCell(0);
    cellUrl.textContent = url;

    const cellMethod = newRow.insertCell(1);
    cellMethod.textContent = method;

    const cellDataType = newRow.insertCell(2);
    cellDataType.textContent = dataType;

    const cellRequestData = newRow.insertCell(3);
    cellRequestData.textContent = requestData;//Haji
    // cellRequestData.textContent = 'N/A';//Haji

    const cellTimeSent = newRow.insertCell(4);
    cellTimeSent.textContent = timeSent;

    const cellResponseTime = newRow.insertCell(5);
    cellResponseTime.textContent = responseTime;

    const cellResponseData = newRow.insertCell(6);
    cellResponseData.textContent = responseData ? JSON.stringify(responseData, null, 2) : 'Empty'; //Haji commented
    // cellResponseData.textContent = responseData ? responseData.currentTime : 'Empty'; //Haji
}


function goToIndexPage() {
    // Use window.location.href to navigate to the specified file path
    // window.location.href = 'file:///D:/DIM/WebApiReact/7.12.2023_JS_zabbix_test_Server/test_server_repeating_requests/index.html';
    window.location.href = 'index.html';
}

function goToGetRequestPage() {
    // window.location.href = 'file:///D:/DIM/WebApiReact/7.12.2023_JS_zabbix_test_Server/test_server_repeating_requests/get_request.html';
    window.location.href = 'get_request.html';
}

function goToPostRequestPage() {
    // window.location.href = 'file:///D:/DIM/WebApiReact/7.12.2023_JS_zabbix_test_Server/test_server_repeating_requests/post_request.html';
    window.location.href = 'post_request.html';
}
