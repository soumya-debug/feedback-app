window.onload = function(event) {
    console.log(event);
    loadData();
};

const baseUrl = "http://localhost:8080";

function loadData() {
    fetch(baseUrl + "/products")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Process the response data
            console.log(data);
            bindProducts(data);
        })
        .catch((error) => {
            // Handle any errors
            console.error("Error:", error);
        });
}

function getProduct(id) {
    fetch(baseUrl + "/products/" + id)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Process the response data
            console.log(data);
            bindProduct(data);
        })
        .catch((error) => {
            // Handle any errors
            console.error("Error:", error);
        });
}

function bindProducts(products) {
    let rowList = document.getElementById("product-list");
    rowList.innerText = "";
    let productElement = document.getElementById("product");
    productElement.innerText = "";
    for (let key in products) {
        let product = products[key];
        let productElement = productAsList(product);
        let feedbackElement = document.createElement('div');
        feedbackElement.innerHTML = `<button class='btn btn-primary' onclick='getProduct(${product.id})'>Feedback</button>`;
        let recordElement = document.createElement("div");
        recordElement.className = "row mb-4";
        recordElement.appendChild(productElement);
        recordElement.appendChild(feedbackElement);

        let feedbackTextElement = document.createElement("div");
        feedbackTextElement.className = "col-sm-6";
        feedbackTextElement.innerText = "";
        feedbackTextElement.id = "feedback-text-" + product.id;
        recordElement.appendChild(feedbackTextElement);
        rowList.appendChild(recordElement);
    }
}

function bindProduct(product) {
    let rowList = document.getElementById("product-list");
    rowList.innerText = "";
    let productItemElement = document.getElementById("product");
    productItemElement.innerText = "";

    let productElement = productAsList(product);
    let feedbackElement = getFeedbackElement(product);
    let recordElement = document.createElement("div");
    recordElement.className = "row mb-4";
    recordElement.appendChild(productElement);
    recordElement.appendChild(feedbackElement);

    let feedbackTextElement = document.createElement("div");
    feedbackTextElement.className = "col-sm-12";
    feedbackTextElement.innerText = "";
    feedbackTextElement.id = "feedback-text-" + product.id;
    feedbackElement.appendChild(feedbackTextElement);
    productItemElement.appendChild(recordElement);
}

function getFeedbackElement(product) {
    let feedbackElement = document.createElement("div");
    feedbackElement.className = "col-sm-6";
    feedbackElement.id = "feedback-" + product.id;

    let formGroupElement = document.createElement("div");
    formGroupElement.className = "form-group";

    let textareaElement = document.createElement("textarea");
    textareaElement.id = product.id;
    textareaElement.className = "form-control";

    let h1Element = document.createElement("h2");
    h1Element.innerHTML = "Feedback";
    formGroupElement.appendChild(h1Element);
    formGroupElement.appendChild(textareaElement);

    let buttonElement1 = document.createElement("button");
    buttonElement1.className = "btn btn-primary";
    buttonElement1.innerHTML = "Submit Feedback";
    buttonElement1.productId = product.id;
    buttonElement1.userId = product.userId;
    buttonElement1.onclick = saveFeedback;

    let buttonElement2 = document.createElement("button");
    buttonElement2.className = "btn btn-primary";
    buttonElement2.innerHTML = "Show Feedback";
    buttonElement2.productId = product.id;
    buttonElement2.userId = product.userId;
    buttonElement2.onclick = attachFeedbackList;

    feedbackElement.appendChild(formGroupElement);
    feedbackElement.appendChild(buttonElement1);
    feedbackElement.appendChild(buttonElement2);

    return feedbackElement;
}

function attachFeedbackList(event) {
    let productId = event.target.productId;
    findFeedback(productId);
}

function setFeedbackElements(id, feedbacks) {
    let feedbackTextElement = document.getElementById("feedback-text-" + id);
    feedbackTextElement.innerHTML = "<br/>";
    for (let key in feedbacks) {
        let spanElement = document.createElement("div");
        console.log(feedbacks[key].content);
        spanElement.innerHTML = feedbacks[key].content;
        spanElement.className = "alert alert-warning";
        spanElement.role = "alert";
        spanElement.style = `overflow: auto;
            word-wrap: break-word;
            white-space: pre-wrap;`;
        feedbackTextElement.appendChild(spanElement);
    }
}

function productAsList(product) {
    let ulElement = document.createElement("ul");
    ulElement.className = "list-group";
    for (let key in product) {
        let value = product[key];
        let liElement = document.createElement("li");
        liElement.className = "list-group-item";
        if (key === 'image') {
            liElement.innerHTML = `<img width='60%' src=${value}></img>`;
        } else {
            liElement.innerHTML = `<strong>${toSentenceCase(key)}: </strong> ${value}`;
        }
        ulElement.appendChild(liElement);
    }

    let productElement = document.createElement("div");
    productElement.className = "col-sm-6";
    productElement.appendChild(ulElement);

    return productElement;
}

function saveFeedback(event) {
    let productId = event.target.productId;
    let userId = event.target.userId;
    let value = document.getElementById(productId).value;
    console.log(value, userId);

    const feedback = {
        userId: userId,
        content: value,
        productId: productId,
    };
    sendFeedbackRequest(feedback);
}

function findFeedback(id) {
    fetch(baseUrl + "/products/feedback/" + id)
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Process the response data
            console.log(data);
            setFeedbackElements(id, data);
            return data;
        })
        .catch((error) => {
            // Handle any errors
            console.error("Error:", error);
        });
}

function sendFeedbackRequest(feedback) {
    const url = baseUrl + "/products/feedback"; // Replace with your API endpoint

    const data = feedback;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    fetch(url, options)
        .then((response) => { console.log(response); return response.json(); })
        .then((data) => {
            console.log(data);
            findFeedback(data.productId);
        })
        .catch((error) => {
            console.error("Error:", error);
            // Handle any errors
        });
}

function toSentenceCase(str) {
    if (typeof str !== "string") {
        return "";
    }

    // Convert the string to lowercase and split into words
    let words = str.toLowerCase().split(" ");

    // Capitalize the first letter of each word
    words = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // Join the words back into a sentence
    return words.join(" ");
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sleepForMs(timeMs) {
    console.log("Before sleep");
    await sleep(timeMs); // Sleep for 2000 milliseconds (2 seconds)
    console.log("After sleep");
}
